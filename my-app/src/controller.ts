import { Question, SearchResponse, UpdateResponse } from "./types";

// Handles search input processing and API calls
export const processSearch = async (query: string) => {
    try {
        // TODO: Replace with actual transliteration API (for English to Hindi conversion)
        const hindiQuery = await transliterate(query);

        // TODO: Replace with actual backend API call to fetch search results
        window.location.href = `/results?search=${encodeURIComponent(hindiQuery)}`;
    } catch (error) {
        console.error("Search processing failed:", error);
    }
};

// Dummy transliteration function (Replace with actual Google Input Tools API)
const transliterate = async (text: string) => {
    // TODO: Implement API for real transliteration
    return text; // Placeholder - returns the same text for now
};

/**
 * Fetch search results from the backend.
 * @param query - The search text (already in Hindi).
 * @returns List of matching questions
 */
export const fetchResults = async (query: string) => {
    try {
        console.log(`Fetching results for: ${query}`);

        // TODO: Replace with actual API endpoint
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch results");

        return await response.json();
    } catch (error) {
        console.error("Error fetching results:", error);
        return [];
    }
};
