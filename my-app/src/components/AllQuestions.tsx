import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // import your client
import "../css/AllQuestions.css";

interface QuestionData {
  id: number;
  question: string;
  video_url: string;
  timestamp: string;
  video_date: string;
}

const PAGE_SIZE = 30;

const AllQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (pageNumber: number) => {
    setLoading(true);
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("questions")
      .select("id, question_text, video_url, timestamp, video_date")
      .order("video_index", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Failed to fetch questions:", error.message);
      setQuestions([]);
    } else {
      const formatted = data.map((q) => ({
        id: q.id,
        question: q.question_text,
        video_url: q.video_url,
        timestamp: q.timestamp,
        video_date: q.video_date,
      }));
      setQuestions(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="all-questions-container">
      <h1 className="all-questions-title">All Questions Archive</h1>
      <p className="instructions">
        Browse all timestamped questions from Ekantik videos.
        <br />
        Use arrow buttons to navigate through pages.
      </p>

      {loading && <p>Loading...</p>}

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
              const videoLink = `${q.video_url}&t=${q.timestamp.replace(
                ":",
                "m"
              )}s`;
              return (
                <tr key={q.id}>
                  <td>
                    <a
                      href={videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

      <div className="pagination-controls">
        <button
          className="nav-button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          ⬅️ Previous
        </button>
        <span className="page-label">Page {page + 1}</span>
        <button
          className="nav-button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={questions.length < PAGE_SIZE}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default AllQuestions;
