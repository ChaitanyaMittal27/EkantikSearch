import sqlite3
import os
import re
import datetime
from googleapiclient.discovery import build
from dotenv import load_dotenv


# Retrieve API key
API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    raise ValueError("❌ API_KEY is missing! Make sure it's set in the .env file.")

# 🔹 YouTube channel ID for Bhajan Marg
CHANNEL_ID = "UCEk1jBxAl6fe-_G37G7huQA"

DB_PATH = "ekankik_data.db"
ARCHIVE_FOLDER = "db_archives"

def get_latest_video_number():
    """Fetch the highest video number from ekankik_data.db"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT video_title FROM questions WHERE video_title LIKE '#%' ORDER BY video_index DESC LIMIT 1")
    result = cursor.fetchone()
    conn.close()

    if result:
        match = re.search(r"#(\d{3})", result[0])
        return int(match.group(1)) if match else None
    return None

def fetch_recent_videos():
    """Fetch recent videos from YouTube API and filter for Q&A videos (#XXX format)."""
    youtube = build("youtube", "v3", developerKey=API_KEY)
    request = youtube.search().list(
        part="snippet",
        channelId=CHANNEL_ID,
        maxResults=10,
        order="date"
    )
    response = request.execute()

    filtered_videos = []
    video_numbers = []
    pattern = re.compile(r"#(\d{3})")  # Matches # followed by exactly 3 digits

    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        date = item["snippet"]["publishedAt"][:10]

        match = pattern.search(title)
        if match:
            video_numbers.append(int(match.group(1)))
            filtered_videos.append((video_id, date, title))

    return filtered_videos

def fetch_video_description(video_id):
    """Fetch video description from YouTube API."""
    youtube = build("youtube", "v3", developerKey=API_KEY)
    request = youtube.videos().list(
        part="snippet",
        id=video_id
    )
    response = request.execute()
    return response["items"][0]["snippet"]["description"]

def extract_questions(description):
    """Extract timestamps and questions from video description."""
    lines = description.split("\n")
    questions = []

    for line in lines:
        if re.match(r"\d{2}:\d{2}", line):
            questions.append(line.strip())

    return questions

def insert_into_db(video_id, date, title, questions):
    """Insert extracted questions into ekankik_data.db."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for question in questions:
        timestamp = question.split(" - ")[0]
        cursor.execute("INSERT INTO questions (video_title, timestamp, question) VALUES (?, ?, ?)",
                       (title, timestamp, question))

    conn.commit()
    conn.close()

def archive_filtered_videos(filtered_videos):
    """Save filtered videos to a timestamped file."""
    os.makedirs(ARCHIVE_FOLDER, exist_ok=True)
    archive_file = f"{ARCHIVE_FOLDER}/filtered_videos_{datetime.datetime.now().strftime('%Y%m%d')}.txt"

    with open(archive_file, "w", encoding="utf-8") as f:
        for entry in filtered_videos:
            f.write(" | ".join(entry) + "\n")

if __name__ == "__main__":
    latest_video_number = get_latest_video_number()
    recent_videos = fetch_recent_videos()

    new_videos = [v for v in recent_videos if int(re.search(r"#(\d{3})", v[2]).group(1)) > latest_video_number]

    for video_id, date, title in new_videos:
        description = fetch_video_description(video_id)
        questions = extract_questions(description)
        insert_into_db(video_id, date, title, questions)

    archive_filtered_videos(new_videos)
    print(f"✅ {len(new_videos)} new videos added to the database.")
