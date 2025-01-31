import React, { useState, useEffect } from "react";

const AllQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all questions from `public/all.json`
    useEffect(() => {
        fetch("/all.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setQuestions(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Error fetching questions:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="all-questions-container">
            <h1 className="page-title">📜 All Questions (Debug View)</h1>

            {loading ? (
                <p className="loading-text">📡 Loading data...</p>
            ) : (
                <table className="questions-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Question</th>
                            <th>Video</th>
                            <th>Watch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={index}>
                                <td>{q.timestamp}</td>
                                <td>{q.question}</td>
                                <td>{q.video_title}</td>
                                <td>
                                    <a href={q.video_url} target="_blank" rel="noopener noreferrer">▶ Watch</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllQuestions;
