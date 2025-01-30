import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../CSS/Results.css";
import { fetchResults } from "../controller";

const Results: React.FC = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || ""; // Get search query from URL

    const [results, setResults] = useState<{ id: number; question_text: string; video_url: string; video_date: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("");

    // Fetch results from backend when the page loads
    useEffect(() => {
        if (searchQuery) {
            fetchResults(searchQuery)
                .then(data => {
                    setResults(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [searchQuery]);

    // Sorting function
    const handleSort = (column: string) => {
        const sorted = [...results].sort((a, b) => {
            if (column === "question_text") {
                return a.question_text.localeCompare(b.question_text);
            }
            if (column === "video_date") {
                return new Date(a.video_date).getTime() - new Date(b.video_date).getTime();
            }
            return 0;
        });
        setSortBy(column);
        setResults(sorted);
    };

    return (
        <div className="results-container">
            <h2>Search Results for: "{searchQuery}"</h2>

            {loading ? <p>Loading...</p> : null}
            {error ? <p className="error-message">Error: {error}</p> : null}

            {results.length === 0 && !loading ? <p>No results found.</p> : null}

            {results.length > 0 && (
                <table className="results-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("question_text")}>Question ⬆⬇</th>
                            <th onClick={() => handleSort("video_date")}>Date ⬆⬇</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(q => (
                            <tr key={q.id}>
                                <td>{q.question_text}</td>
                                <td>{q.video_date}</td>
                                <td>
                                    <a href={q.video_url} target="_blank" rel="noopener noreferrer">
                                        Watch
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Results;
