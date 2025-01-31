/**
 * Controller module for handling API calls between React frontend and Flask backend.
 * Ensures input validation, API communication, and redirection for search results.
 */

import { Question, SearchResponse, UpdateResponse } from "./types";

/**
 * Processes the search input by validating it and calling the Flask API.
 * - Calls Flask API for transliteration and search processing.
 * - Redirects to the results page after receiving a valid response.
 * 
 * @param query - The search text input by the user.
 */
export const processSearch = async (query: string) => {
    try {
        if (!query.trim()) throw new Error("Query cannot be empty");
        
        // Call Flask API to process the search query
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to process search");
        
        const results = await response.json();
        
        // Redirect to results page with the search query (React will fetch results on this page)
        window.location.href = `/results?search=${encodeURIComponent(query)}`;
    } catch (error) {
        console.error("Search processing failed:", error);
    }
};

/**
 * Fetches search results from the backend.
 * - This function is called by the Results Page (`Results.tsx`) after redirection.
 * - It sends a request to Flask and retrieves a list of matching questions.
 * 
 * @param query - The search text (expected to be already transliterated in Hindi).
 * @returns List of matching questions from the backend.
 */
export const fetchResults = async (query: string) => {
    try {
        console.log(`Fetching results for: ${query}`);
        
        // Call Flask API to retrieve search results
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch results");
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching results:", error);
        return [];
    }
};