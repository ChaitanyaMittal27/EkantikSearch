"""
update_DB.py - Fetches new Q&A videos, extracts questions, and updates `ekankik_data.db`.

This script:
1. Calls YouTube API to fetch all uploaded video titles and IDs.
2. Filters videos that match the Q&A format (`#XXX`).
3. Fetches descriptions for selected videos.
4. Extracts timestamps and questions.
5. Inserts them into `ekankik_data.db`.

Requirements:
- Uses API key from `.env`.
- Uses `db_controller.py` to insert data.
"""

import requests
import sqlite3
import os
import re
import datetime
from dotenv import load_dotenv

# Load API Key
load_dotenv(dotenv_path="../.env")
API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_ID = "UCEk1jBxAl6fe-_G37G7huQA"

DB_PATH = "ekankik_data.db"
ALL_VIDEOS_PATH = "all_videos.txt"
FILTERED_VIDEOS_PATH = "filtered_videos.txt"

# YouTube API URLs
CHANNEL_URL = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}"
VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos"

def get_uploads_playlist_id():
    """Fetch the uploads playlist ID of the channel."""
    response = requests.get(CHANNEL_URL)
    data = response.json()
    
    try:
        return data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    except (KeyError, IndexError):
        print("❌ ERROR: Could not retrieve uploads playlist ID. Check API Key and Channel ID.")
        return None

def fetch_video_list(playlist_id):
    """Fetch all video titles and IDs from the channel and save them to `all_videos.txt`."""
    video_list = []
    next_page_token = ""

    while True:
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&pageToken={next_page_token}&key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        for item in data.get("items", []):
            video_id = item["snippet"]["resourceId"]["videoId"]
            title = item["snippet"]["title"]
            date = item["snippet"]["publishedAt"][:10]  # Extract YYYY-MM-DD

            video_list.append(f"{video_id} | {date} | {title}")

        next_page_token = data.get("nextPageToken", "")
        if not next_page_token:
            break

    # Save to file
    with open(ALL_VIDEOS_PATH, "w", encoding="utf-8") as f:
        for entry in video_list:
            f.write(entry + "\n")

    print(f"✅ Saved {len(video_list)} videos to {ALL_VIDEOS_PATH}")

def filter_relevant_videos():
    """
    Reads `all_videos.txt` and extracts videos matching `#XXX` format.
    Saves them to `filtered_videos.txt`.
    """
    pattern = re.compile(r"#(\d{3})")  # Matches # followed by exactly 3 digits
    filtered_videos = []

    with open(ALL_VIDEOS_PATH, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split(" | ")
            if len(parts) != 3:
                continue

            video_id, date, title = parts
            if pattern.search(title):
                filtered_videos.append(f"{video_id} | {date} | {title}")

    with open(FILTERED_VIDEOS_PATH, "w", encoding="utf-8") as f:
        for entry in filtered_videos:
            f.write(entry + "\n")

    print(f"✅ Saved {len(filtered_videos)} filtered Q&A videos to {FILTERED_VIDEOS_PATH}")

def fetch_video_description(video_id):
    """Fetches video description using YouTube API."""
    url = f"{VIDEO_DETAILS_URL}?part=snippet&id={video_id}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    try:
        return data["items"][0]["snippet"]["description"]
    except (KeyError, IndexError):
        print(f"❌ ERROR: Could not retrieve description for video {video_id}.")
        return ""

def extract_questions(description):
    """
    Extracts timestamps and questions from the video description.
    Returns a list of questions.
    """
    lines = description.split("\n")
    questions = [line.strip() for line in lines if re.match(r"\d{2}:\d{2}", line)]
    return questions

def insert_into_db(video_id, date, title, questions):
    """
    Inserts extracted questions into `ekankik_data.db`.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for question in questions:
        timestamp = question.split(" - ")[0]
        cursor.execute("INSERT INTO questions (video_title, timestamp, question) VALUES (?, ?, ?)", 
                       (title, timestamp, question))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    print("🔹 Fetching uploads playlist ID...")
    playlist_id = get_uploads_playlist_id()

    if playlist_id:
        print("🔹 Fetching all video titles and IDs...")
        fetch_video_list(playlist_id)

        print("🔹 Filtering relevant Q&A videos...")
        filter_relevant_videos()

        print("🔹 Fetching descriptions and extracting questions...")
        with open(FILTERED_VIDEOS_PATH, "r", encoding="utf-8") as f:
            for line in f:
                video_id, date, title = line.strip().split(" | ")
                description = fetch_video_description(video_id)
                questions = extract_questions(description)

                if questions:
                    insert_into_db(video_id, date, title, questions)
                    print(f"✅ Added {len(questions)} questions from {title}")

        print("✅ Database update completed successfully!")
    else:
        print("❌ Process failed: No playlist ID found.")
