// common types.
// Define the shape of a question item
export interface Question {
    id: number;
    question_text: string;
    video_index: number;
    timestamp: number; // Stored in seconds
    video_date: string; // Format: YYYY-MM-DD
}

// API Response for search
export interface SearchResponse {
    results: Question[];
}

// API Response for updates
export interface UpdateResponse {
    message: string;
}