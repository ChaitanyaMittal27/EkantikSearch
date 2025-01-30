import { useState } from "react";
import "../CSS/Search.css";
import { processSearch } from "../controller"; // Handles transliteration & results fetching

const Search: React.FC = () => {
    const [query, setQuery] = useState("");

    // TODO: Replace with API-based popular questions later
    const popularQuestions = [
        "धर्म क्या है?",
        "कर्मयोग कैसे करें?",
        "गुरु का महत्व क्या है?",
        "श्री कृष्ण के अनुसार भक्ति क्या है?",
        "अहंकार से कैसे बचें?",
    ];

    // Handle search input submission
    const handleSearch = () => {
        if (query.trim()) {
            processSearch(query); // Send query to backend
        }
    };

    // Clicking a popular question auto-fills & searches
    const handlePopularClick = (question: string) => {
        setQuery(question);
        processSearch(question);
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="search-bar"
                />
                <button className="search-button" onClick={handleSearch}>🔍</button>
            </div>

            <h2 className="popular-title">Popular Questions</h2>

            <ul className="popular-list">
                {popularQuestions.map((question, index) => (
                    <li key={index} onClick={() => handlePopularClick(question)} className="popular-item">
                        {question}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
