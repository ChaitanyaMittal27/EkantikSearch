// src/controller.ts
import Fuse from 'fuse.js';

// Load environment variables (Ensure dotenv is set up in your project)
const MICROSOFT_TRANSLATOR_KEY = import.meta.env.VITE_MICROSOFT_AZURE_KEY;
const MICROSOFT_TRANSLATOR_REGION = import.meta.env.VITE_MICROSOFT_TRANSLATOR_REGION || "centralindia";
const MICROSOFT_TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com";
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
    const response = await fetch(`${MICROSOFT_TRANSLATOR_ENDPOINT}/transliterate?api-version=3.0&language=hi&fromScript=latn&toScript=deva`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": MICROSOFT_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": MICROSOFT_TRANSLATOR_REGION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ "Text": query }]),
    });

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
    const response = await fetch(`${MICROSOFT_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=hi`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": MICROSOFT_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": MICROSOFT_TRANSLATOR_REGION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ "Text": query }]),
    });

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
export const generateSearchVariants = async (query: string): Promise<string[]> => {
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
    //DEBUG: console.log("🔍 Called searchQuestions() for query:", query);
    if (!query.trim()) return [];

  const variants = await generateSearchVariants(query);
  const qsResponse = await fetch("/all_qs.json");
  const allQuestions: { id: number; question: string }[] = await qsResponse.json();

  const fuseOptions = {
    keys: ['question'],
    threshold: SEARCH_THRESHOLD,
  };

  const matchingIds = new Set<number>();
  variants.forEach((variant) => {
    const fuse = new Fuse(allQuestions, fuseOptions);
    const fuseResults = fuse.search(variant);
    fuseResults.forEach(result => matchingIds.add(result.item.id));
  });

  return Array.from(matchingIds);
};

/**
 * handleSearch:
 * Uses searchQuestions to retrieve matching question IDs, then fetches
 * the full results from '/all.json' and filters by those IDs.
 */
export const handleSearch = async (query: string): Promise<{ id: number, question: string, video_url: string, video_date: string, video_index: number }[]> => {
  const matchingIds = await searchQuestions(query);
  const fullResponse = await fetch("/all.json");
  const fullResults = await fullResponse.json();
  return fullResults.filter((item: { id: number; }) => matchingIds.includes(item.id));
};

/**
 * fetchResults:
 * Wraps handleSearch to ensure compatibility with Results.tsx.
 */
export const fetchResults = async (query: string): Promise<{ id: number, question: string, video_url: string, video_date: string, video_index: number }[]> => {
    //DEBUG: console.log("🔍 Called fetchResults() for query:", query);
    try {
    return await handleSearch(query);
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};
