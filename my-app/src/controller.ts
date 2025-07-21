// src/controller.ts
import Fuse from "fuse.js";
import { supabase } from "./supabaseClient";
import { Question } from "./types.ts";

// Load environment variables (Ensure dotenv is set up in your project)
const MICROSOFT_TRANSLATOR_KEY = import.meta.env.VITE_MICROSOFT_AZURE_KEY;
const MICROSOFT_TRANSLATOR_REGION =
  import.meta.env.VITE_MICROSOFT_TRANSLATOR_REGION || "centralindia";
const MICROSOFT_TRANSLATOR_ENDPOINT =
  "https://api.cognitive.microsofttranslator.com";
const SEARCH_THRESHOLD = 0.24;

/**
 * isHindiText:
 * Detects if the query is already in Hindi (Devanagari script).
 * If text contains characters in the Unicode range \u0900-\u097F, it is considered Hindi.
 */
export const isHindiText = (query: string): boolean => {
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(query);
};

/**
 * transcribeQuery:
 * Calls Microsoft's Transliteration API to convert English words into Hindi script.
 * Only runs if the input is NOT already in Hindi.
 */
export const transcribeQuery = async (query: string): Promise<string> => {
  if (isHindiText(query)) return query; // Skip API call if already Hindi

  //DEBUG: console.log("Transcribing query:", query);

  try {
    const response = await fetch(
      `${MICROSOFT_TRANSLATOR_ENDPOINT}/transliterate?api-version=3.0&language=hi&fromScript=latn&toScript=deva`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": MICROSOFT_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": MICROSOFT_TRANSLATOR_REGION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: query }]),
      }
    );

    const data = await response.json();
    return data[0]?.text || query; // Return transliterated text or fallback
  } catch (error) {
    console.error("Error in transliteration:", error);
    return query;
  }
};

/**
 * translateToHindi:
 * Calls Microsoft's Translation API to convert an English query into Hindi.
 * Only runs if the input is NOT already in Hindi.
 */
export const translateToHindi = async (query: string): Promise<string> => {
  if (isHindiText(query)) return query; // Skip API call if already Hindi

  // DEBUG: console.log("Translating query to Hindi:", query);

  try {
    const response = await fetch(
      `${MICROSOFT_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=hi`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": MICROSOFT_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": MICROSOFT_TRANSLATOR_REGION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: query }]),
      }
    );

    const data = await response.json();
    return data[0]?.translations[0]?.text || query; // Return translated text or fallback
  } catch (error) {
    console.error("Error in translation:", error);
    return query;
  }
};

/**
 * generateSearchVariants:
 * Given the original query string, generates an array of search variations:
 *   - Original query (English or Hindi)
 *   - Transliterated version (English words in Hindi script)
 *   - Translated version (Fully translated Hindi sentence)
 * Avoids unnecessary API calls if the query is already in Hindi.
 */
export const generateSearchVariants = async (
  query: string
): Promise<string[]> => {
  //DEBUG: console.log("🔍 Called generateSearchVariants() for query:", query);
  const englishQuery = query;
  const transcribedQuery = await transcribeQuery(query);
  const translatedQuery = await translateToHindi(query);
  // DEBUG: console.log("Search Variants:", [englishQuery, transcribedQuery, translatedQuery]);
  return Array.from(new Set([englishQuery, transcribedQuery, translatedQuery])); // Remove duplicates
};

/**
 * searchQuestions:
 * Searches the minimal question list (from '/all_qs.json') using Fuse.js.
 */
export const searchQuestions = async (query: string): Promise<number[]> => {
  if (!query.trim()) return [];

  const variants = await generateSearchVariants(query);

  const { data: allQuestions, error } = await supabase
    .from("questions")
    .select("id, question_text");

  if (error || !allQuestions) {
    console.error("Supabase question fetch error:", error?.message);
    return [];
  }

  const fuse = new Fuse(allQuestions, {
    keys: ["question_text"],
    threshold: SEARCH_THRESHOLD,
  });

  const matchingIds = new Set<number>();
  variants.forEach((variant) => {
    fuse.search(variant).forEach((result) => matchingIds.add(result.item.id));
  });

  return Array.from(matchingIds);
};

/**
 * handleSearch:
 * Uses searchQuestions to retrieve matching question IDs, then fetches
 * the full results supabase and filters by those IDs.
 */
export const handleSearch = async (
  query: string
): Promise<
  {
    id: number;
    question_text: string;
    video_url: string;
    video_date: string;
    video_index: number;
  }[]
> => {
  const matchingIds = await searchQuestions(query);
  const { data: fullResults, error } = await supabase
    .from("questions")
    .select("id, question_text, video_url, video_date, video_index, timestamp")
    .in("id", matchingIds);

  if (error || !fullResults) {
    console.error("Supabase full result fetch error:", error?.message);
    return [];
  }

  return fullResults;
};

/**
 * fetchResults:
 * Wraps handleSearch to ensure compatibility with Results.tsx.
 */
export const fetchResults = async (
  query: string
): Promise<
  {
    id: number;
    question_text: string;
    video_url: string;
    video_date: string;
    video_index: number;
  }[]
> => {
  //DEBUG: console.log("🔍 Called fetchResults() for query:", query);
  try {
    return await handleSearch(query);
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export async function fetchAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question_text, video_url, timestamp, video_date, video_index")
    .order("video_index", { ascending: false })
    .range(0, 499);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return data.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    video_url: q.video_url,
    timestamp: q.timestamp,
    video_date: q.video_date,
    video_index: q.video_index,
  }));
}
