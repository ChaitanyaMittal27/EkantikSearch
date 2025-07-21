# Ekantik Search 🔍

**Live Website:**  
[Ekantik Search](https://ekantiksearch.vercel.app/) 🚀

Ekantik Search is a **spiritual question search engine** that helps users **find timestamped answers** from a curated YouTube channel focused on spiritual wisdom. It supports **Hindi, English, and Hinglish input**, and keeps its database **automatically updated** using GitHub Actions and Supabase.

## 🌟 Project Overview

This is a **full-stack multilingual search engine** designed to:

- Let users search spiritual questions intuitively.
- Support **Hindi transliteration and translation**.
- Auto-fetch new YouTube videos and questions regularly.
- Serve fast responses via a PostgreSQL database on Supabase.

## 🏠 Architecture Overview

### 🔹 Frontend (React + Vercel)

- Built with **React + TypeScript**
- Search suggestions, query parsing, and result display
- **Multilingual support** via Microsoft Translator API
- Deployed using **Vercel** for CI/CD and instant updates

### 🔹 Backend (Python Scripts)

- Python scripts fetch, parse, and insert YouTube video Q&A data
- Supabase (PostgreSQL) is used for question storage
- Includes initial setup tools and ongoing update logic

### 🔹 Database (Supabase PostgreSQL)

- Schema:
  ```sql
  CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT,
    video_url TEXT,
    timestamp TEXT,
    video_date TEXT,
    video_index INT,
    video_question_index INT
  );
  ```
- Indexed by latest Ekantik video uploads and timestamps

## ⚙️ Automated Updates & Deployment

### ✅ GitHub Actions (Daily)

- Runs Python update scripts every night (UTC)
- Adds **only new videos/questions** to Supabase
- Logs failures and update metadata

### 🚀 Vercel CI/CD

- Automatic frontend deployment on every push to `main`
- Uses `.env` environment variables for Translator API keys

## 🚀 How It Works

1. **Search** from the UI in English, Hindi (देवनागरी), or Hinglish
2. The app detects language and translates/transliterates as needed
3. Queries are matched using **Supabase** (PostgreSQL) and **Fuse.js fuzzy search**
4. Links direct users to **specific YouTube timestamps** for each answer

## 🗂 Project Structure

```plaintext
EkantikSearch/
├── src/                   # React Frontend
│   ├── components/        # Search, Results, AllQuestions, etc.
│   └── css/               # styles for components
│   └── controller.ts/     # main controller for ui logic
│   └── supabaseClient.ts/ # access to supabase elements
│   └── types.ts/          # typeset for table and "question"
│
├── backend/
│   ├── db/                # db scripts
│   ├── init_populate/     # One-time DB init and historical scraping
│   ├── tests/             # testing
│   ├── update             #  update the db, run by ci/cd
│
├── public/                # Static files (optional, may be empty)
└── README.md
```

## 🧪 Testing Locally

1. Clone the repo:

```bash
git clone https://github.com/ChaitanyaMittal27/EkantikSearch.git
cd EkantikSearch
```

2. Set up environment variables in `.env` (or Vercel dashboard):

```
VITE_MICROSOFT_AZURE_KEY=<your-api-key>
VITE_MICROSOFT_TRANSLATOR_REGION=centralindia
```

3. Install Python requirements:

```bash
pip install -r requirements.txt
```

4. Run backend scripts:

```bash
python init_populate/setupdb.py  # Optional: Initial data load
```

5. Start the frontend:

```bash
npm install
npm run dev
```

## 📁 Related READMEs

- [`init_populate/README.md`](init_populate/README.md) → For initial setup, old JSON export, and population steps
- [`backend/update/README.md`](backend/update/README.md) → For scheduled auto-update logic and how Supabase is used

## 🛠 Tech Stack

| Layer                | Tech Used                                                |
| -------------------- | -------------------------------------------------------- |
| Frontend             | React, TypeScript, TailwindCSS                           |
| Backend              | Python, Supabase Client, YouTube API                     |
| Database             | PostgreSQL (via Supabase)                                |
| Language Support     | Microsoft Translator API (Translation + Transliteration) |
| Hosting & Automation | Vercel + GitHub Actions                                  |

## 🧠 Suggestions / Feature Requests

- Open a GitHub Issue
- Or contribute ideas to `SUGGESTIONS.md`

---

## 📬 Maintainer & Contact

- [Chaitanya Mittal](https://github.com/ChaitanyaMittal27)
- Project Repo: [Ekantik Search on GitHub](https://github.com/ChaitanyaMittal27/EkantikSearch)

---

### 🙏🏼 Enjoy seamless, intelligent access to timeless wisdom.
