// src/components/Search.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/CSS/Search.css";
//import { fetchResults } from "../controller";

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
  const handleSearch = () => {
    if (!query.trim()) return;
    //DEBUG: console.log("🔍 Triggering search for:", query);
    //fetchResults(query);
    // Navigate to results page with the search query as a URL parameter.
    navigate(`/results?search=${encodeURIComponent(query)}`);
  };

  // Handle Enter key press.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // When a suggestion is clicked, update the query and trigger search.
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
  };

  return (
    <div className="search-container">
        <h1 className="search-title">🔍 Ekantik Question Search</h1>
        <p className="search-instructions">Enter a query and press <b>Enter</b> or click the search icon.</p>

        <div className="search-wrapper">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for wisdom..."
            className="search-bar"
            />
            <button className="search-button" onClick={handleSearch}>
            🔍
            </button>
        </div>

        <div className="suggestions">
            <p className="suggestion-heading">Try searching:</p>
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
