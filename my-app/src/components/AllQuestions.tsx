// All Questions Page - Displays Archived Questions with Clickable Video Links
import React, { useEffect, useState } from "react";
import "../css/AllQuestions.css";

interface QuestionData {
    id: number;
    question: string;
    video_url: string;
    timestamp: string;
    video_date: string;
}

const AllQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<QuestionData[]>([]);

    useEffect(() => {
        fetch("/all.json")
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error("Error fetching questions:", error));
    }, []);

    // Function to format date to DD-MM-YYYY
    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="all-questions-container">
            <h1 className="all-questions-title">All Questions Archive</h1>
            <p className="instructions">Click on a question to jump to that part of the video.</p>

            <div className="table-container">
                <table className="questions-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Video Date</th>
                            <th>Timestamp</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => {
                            // Convert timestamp to clickable YouTube link
                            const videoLink = `${q.video_url}&t=${q.timestamp.replace(":", "m")}s`;

                            return (
                                <tr key={q.id}>
                                    <td>
                                        <a href={videoLink} target="_blank" rel="noopener noreferrer">
                                            {q.question}
                                        </a>
                                    </td>
                                    <td>{formatDate(q.video_date)}</td>
                                    <td>{q.timestamp}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllQuestions;
