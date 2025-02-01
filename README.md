# Ekantik Search 🔍
**Live Website:** 
[Ekantik Search](https://ekantiksearch.vercel.app/) 🚀

Ekantik Search is a **spiritual question search engine** that helps users **find answers** from a curated YouTube channel focused on spirituality. It automatically **fetches, filters, and updates** the database with the latest Q&A content.

---

## 🌟 **Project Overview**
This project is a **full-stack application** built to provide **efficient search** for spiritual questions. It consists of:

- **Frontend**: React-based search UI (deployed on Vercel)
- **Backend Scripts**: Python scripts for **fetching YouTube data** and **updating the database**
- **Database**: SQLite (`ekantik_data.db`) for storing processed questions
- **Automated Updates**: GitHub Actions to **fetch, filter, and update** data daily

---

## 🏠 **Architecture Overview**
### 🔹 **Frontend (React)**
- Built with **TypeScript + React**
- Handles **search and transliteration**
- Deployed on **Vercel** for auto-build & deployment

### 🔹 **Backend (Python Scripts)**
- No traditional API server, just **processing scripts**
- **Fetches latest YouTube videos** using `fetchVideoList.py`
- **Filters relevant Q&A videos** using `filterRelevantVideos.py`
- **Extracts questions and stores in SQLite DB** via `setupAndPopulateDB.py`
- **Exports JSON for frontend consumption** (`export_to_json.py`)

### 🔹 **Database (SQLite)**
- Stores processed **spiritual Q&A data**
- Updated automatically every day via GitHub Actions

---

## ⚙️ **Automated Updates & Deployment**
This project is **fully automated** with:
1. **GitHub Actions for Daily Updates** ✅
   - Runs `populateDB.py` every day at **midnight UTC**
   - Fetches, filters, and updates `ekantik_data.db`
   - Commits new JSON data to the repo

2. **Continuous Deployment on Vercel** 🚀
   - Auto-builds and deploys the frontend when code is pushed to **main**
   - Provides instant **live updates** on [Ekantik Search](https://ekantiksearch.vercel.app/)

---

## 🚀 **How It Works**
1. **User searches for a question** 🔎 → React frontend queries the JSON database
2. **If new questions are uploaded** on YouTube 🎥 → GitHub Actions fetches them daily
3. **Data updates automatically** in the SQLite database 📊 → JSON is refreshed for frontend use
4. **Frontend is always up-to-date** via **Vercel auto-deploy** 🚀

---

## 🛠 **Tech Stack**
- **Frontend**: React (TypeScript), TailwindCSS, Vercel Hosting
- **Backend**: Python (Requests, SQLite)
- **Database**: SQLite (`ekantik_data.db`)
- **Automation**: GitHub Actions for auto-updates
- **Hosting**: Vercel (React frontend), GitHub Actions (Backend processing)

---

## 👨‍💻 **How to Contribute**
1. **Clone the repo**:
   ```sh
   git clone https://github.com/ChaitanyaMittal27/EkantikSearch.git
   cd EkantikSearch
   ```
2. **Install Python dependencies**:
   ```sh
   pip install requests python-dotenv
   ```
3. **Run update scripts manually** (optional):
   ```sh
   python my-app/backend/update/populateDB.py
   ```
4. **Push changes & watch them deploy** 🚀

---

## 📨 **Contact & Support**
- **Maintainer**: [Chaitanya Mittal](https://github.com/ChaitanyaMittal27)
- **GitHub Repo**: [Ekantik Search](https://github.com/ChaitanyaMittal27/EkantikSearch)
- **Issues?** Open a [GitHub Issue](https://github.com/ChaitanyaMittal27/EkantikSearch/issues)

---

### 🎉 **Enjoy seamless, automated search for spiritual knowledge!** 🎉
