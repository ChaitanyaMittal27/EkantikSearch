// src/components/Search.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/CSS/Search.css";
import { fetchResults } from "../controller";

// A list of custom suggested questions.
const customSuggestions: string[] = [
  "धर्म क्या है?",
  "कर्मयोग कैसे करें?",
  "गुरु का महत्व क्या है?",
  "श्री कृष्ण की भक्ति क्या है?",
  "अहंकार से कैसे बचें?"
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
      <div className="search-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter search query..."
          className="search-bar"
        />
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>
      <div className="suggestions">
        <p>Suggested Questions:</p>
        <ul className="suggestions-list">
          {customSuggestions.map((s, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
