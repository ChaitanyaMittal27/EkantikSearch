import { useState } from "react";
import "../CSS/SearchBar.css";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>("");

    return (
        <div className="search-bar-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a question..."
                className="search-input"
            />
            <button onClick={() => onSearch(query)} className="search-button">
                Search
            </button>
        </div>
    );
};

export default SearchBar;
