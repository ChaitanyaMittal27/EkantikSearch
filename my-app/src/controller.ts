// src/controller.ts
import Fuse from 'fuse.js';

export interface Question {
  id: number;
  question: string;  // Note: our minimal JSON uses "question"
}

export interface Result {
  id: number;
  question: string;  // Ensure the full JSON uses "question" as well.
  video_url: string;
  video_date: string;
  video_index: number;
}

/**
 * transcribeQuery:
 * Asynchronously processes/transcribes the search query.
 * Future: integrate the Microsoft Translator API's transliteration endpoint.
 */
export const transcribeQuery = async (query: string): Promise<string> => {
  // Placeholder: Here you would call Microsoft’s transliteration API.
  // Example (pseudo-code):
  // const response = await fetch(MICROSOFT_TRANSLITERATION_ENDPOINT, { ... });
  // const data = await response.json();
  // return data.transliteratedText;
  return query;  // For now, simply return the original query.
};

/**
 * translateToHindi:
 * Asynchronously translates the query to Hindi.
 * Future: integrate Microsoft Translator Text API's translation endpoint.
 */
export const translateToHindi = async (query: string): Promise<string> => {
  // Placeholder: Call Microsoft’s translation API.
  // Example (pseudo-code):
  // const response = await fetch(MICROSOFT_TRANSLATION_ENDPOINT, { ... });
  // const data = await response.json();
  // return data.translatedText;
  return query;  // For now, simply return the original query.
};

/**
 * generateSearchVariants:
 * Given the original query string, returns an array of variants.
 * Variants include:
 *   - the original query (English),
 *   - the transcribed version,
 *   - the translated version.
 */
export const generateSearchVariants = async (query: string): Promise<string[]> => {
  const englishQuery = query;
  const transcribedQuery = await transcribeQuery(query);
  const translatedQuery = await translateToHindi(query);
  // Remove duplicates by using a Set.
  console.log("Query variants:", [englishQuery, transcribedQuery, translatedQuery]);
  return Array.from(new Set([englishQuery, transcribedQuery, translatedQuery]));
};

/**
 * searchQuestions:
 * Searches the minimal questions list (from '/all_qs.json') using Fuse.js.
 * For each query variant, it performs fuzzy matching on the 'question' field,
 * combines the matching IDs (avoiding duplicates), and returns them.
 */
export const searchQuestions = async (query: string): Promise<number[]> => {
  if (!query.trim()) {
    return [];
  }
  
  // Generate the query variants.
  const variants = await generateSearchVariants(query);
  
  // Fetch the minimal questions list from public/all_qs.json.
  const qsResponse = await fetch("/all_qs.json");
  const allQuestions: Question[] = await qsResponse.json();
  
  // Configure Fuse.js: we search the "question" field.
  const fuseOptions = {
    keys: ['question'],
    threshold: 0.2,  // Adjust as needed for fuzziness.
  };
  
  const matchingIds = new Set<number>();
  
  // Run Fuse.js search for each variant.
  variants.forEach((variant) => {
    const fuse = new Fuse(allQuestions, fuseOptions);
    const fuseResults = fuse.search(variant);
    fuseResults.forEach(result => matchingIds.add(result.item.id));
  });
  
  return Array.from(matchingIds);
};

/**
 * handleSearch:
 * Uses searchQuestions to retrieve matching question IDs from the minimal list,
 * then fetches the full results from '/all.json' and filters by those IDs.
 */
export const handleSearch = async (query: string): Promise<Result[]> => {
  // Get matching question IDs.
  const matchingIds = await searchQuestions(query);
  
  // Fetch the full data from public/all.json.
  const fullResponse = await fetch("/all.json");
  const fullResults: Result[] = await fullResponse.json();
  
  // Filter full results based on matching IDs.
  const processedResults = fullResults.filter(item =>
    matchingIds.includes(item.id)
  );
  
  console.log("Processed results:", processedResults);
  return processedResults;
};

/**
 * fetchResults:
 * For backward compatibility with view code, wraps handleSearch.
 */
export const fetchResults = async (query: string): Promise<Result[]> => {
  try {
    return await handleSearch(query);
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};
