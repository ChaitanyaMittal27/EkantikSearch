// src/components/Results.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../src/CSS/Results.css";
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
    let hasFetched = false; // Prevents duplicate calls in React Strict Mode
  
    if (searchQuery.trim() && results.length === 0 && !hasFetched) {
      //DEBUG: console.log("🔍 Fetching results for:", searchQuery);
      hasFetched = true; // Mark as fetched
  
      fetchResults(searchQuery)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [searchQuery]);
  
  
  return (
    <div className="results-container">
      <h2>Search Results for: "{searchQuery}"</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && (
        <div className="error-section">
          <p className="error-message">Search failed: {error}</p>
          <button className="retry-button" onClick={() => navigate("/")}>
            Search Again
          </button>
        </div>
      )}
      {!loading && !error && results.length === 0 && (
        <div className="error-section">
          <p className="error-message">No results found.</p>
          <button className="retry-button" onClick={() => navigate("/")}>
            Search Again
          </button>
        </div>
      )}
      {!loading && results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Ekantik #</th>
              <th>Timestamp</th>
              <th>Date</th>
              <th>Go to Video</th>
            </tr>
          </thead>
          <tbody>
            {results.slice(0, 30).map((r) => {
              // If a timestamp is provided, construct the jump URL.
              const finalVideoURL = r.timestamp
                ? constructJumpURL(r.video_url, r.timestamp)
                : r.video_url;
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
      )}
    </div>
  );
};

export default Results;
