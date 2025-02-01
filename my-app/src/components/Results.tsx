// Search Results Page - Fetches & Displays Search Results in Table Format
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../css/Results.css";
import { fetchResults } from "../../src/controller";

// Updated interface to include an optional timestamp field.
interface Result {
  id: number;
  question: string;
  video_url: string;
  video_date: string;
  video_index: number;
  timestamp?: string; // optional, in "mm:ss" format (e.g., "01:23")
}

/**
 * Converts a "mm:ss" formatted timestamp into total seconds.
 */
const convertTimestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(":").map(Number);
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  return 0;
};

/**
 * Constructs a jump URL by appending the timestamp parameter.
 * If the videoLink already has query parameters, it appends using '&'; otherwise, '?'.
 */
const constructJumpURL = (videoLink: string, timestamp?: string): string => {
    if (!timestamp) return videoLink; // No timestamp? Return original URL
  
    const seconds = convertTimestampToSeconds(timestamp);
    if (seconds === 0) return videoLink; // Invalid timestamp? Return original URL
  
    const separator = videoLink.includes("?") ? "&" : "?";
    return `${videoLink}${separator}t=${seconds}s`;
  };

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchResults(searchQuery)
        .then((data: Result[]) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchQuery]);
  
  
  return (
    <div className="results-container">
      <h2 className="all-questions-title">Search Results for: "{searchQuery}"</h2>
      <p className="instructions">Click on <strong>Watch</strong> to jump to that part of the video.</p>

      {loading && <p>Loading...</p>}

      {!loading && (error || results.length === 0) && (
        <div className="error-section">
          <p className="error-message">
            {error ? `Error: ${error}` : "No results found for this search."}
          </p>
          <button className="retry-button" onClick={() => navigate("/")}>
            🔄 Search Again
          </button>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Ekantik #</th>
                <th>Timestamp</th>
                <th>Date</th>
                <th>Video</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 30).map((r) => {
                const finalVideoURL = constructJumpURL(r.video_url, r.timestamp);
                return (
                  <tr key={r.id}>
                    <td>{r.question}</td>
                    <td>{r.video_index}</td>
                    <td>{r.timestamp || "N/A"}</td>
                    <td>{r.video_date}</td>
                    <td>
                      <a href={finalVideoURL} target="_blank" rel="noopener noreferrer">
                        Watch
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Results;
