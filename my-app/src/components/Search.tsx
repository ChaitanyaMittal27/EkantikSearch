// Search Page - Handles User Input, Suggestions & Redirects to Results
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/CSS/Search.css";

const customSuggestions: string[] = [
    "धर्म", "कर्म", "गुरु", "भक्ति", "अहंकार",
    "क्रोध", "सत्य", "धैर्य", "सफलता", "संयम",
    "श्रद्धा", "मोक्ष", "साधना", "गृहस्थ", "संस्कार",
    "ईश्वर", "समर्पण", "ज्ञान", "ध्यान", "शांति"
]; 

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  // When search is triggered (either by clicking the search button or pressing Enter).
  const handleSearch = (searchTerm?: string) => {
    const actualQuery = searchTerm !== undefined ? searchTerm : query;
    if (!actualQuery.trim()) return;  
    navigate(`/results?search=${encodeURIComponent(actualQuery)}`);
  };

  // Handle Enter key press.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // When a suggestion is clicked, immediately trigger search.
  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion); // Perform search
    setQuery(suggestion); // Update input field for clarity (optional)
  };

  return (
    <div className="search-container">
        <h1 className="search-title">Ekantik Question Search 🔍</h1>
        <p className="search-instructions">
          Enter a query and press <b>Enter</b> or click the search icon.
        </p>
        <p className="transcription-info">
          You can search in English, Hindi, or Hinglish. Typing <b>'naam'</b> (English spelling of a Hindi word) gives the same results as <b>'नाम'</b> or <b>'name'</b>
        </p>
        <div className="search-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a topic..."
              className="search-bar"
            />
            <button className="search-button" onClick={() => handleSearch()}>
              🔍
            </button>
        </div>

        <div className="suggestions">
            <p className="suggestion-heading">Quick Searches:</p>
            <div className="suggestion-grid">
                {customSuggestions.map((s, index) => (
                    <span key={index} className="suggestion-chip" onClick={() => handleSuggestionClick(s)}>
                        {s}
                    </span>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Search;
