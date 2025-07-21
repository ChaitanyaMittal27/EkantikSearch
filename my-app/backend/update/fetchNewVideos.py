"""
fetchNewVideos.py - Fetches only newly uploaded YouTube videos after the last in Supabase.

Steps:
1. Connects to Supabase to find latest inserted video_index.
2. Fetches all videos from YouTube.
3. Saves only videos with a higher #index than the DB.
"""

import requests, os, re
from dotenv import load_dotenv

# 🔧 Fix path to allow importing from db/
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from db.db_controller import get_connection

OUTPUT_FILE = "update/new_videos.txt"
CHANNEL_ID = "UCEk1jBxAl6fe-_G37G7huQA"

# YTData API key
load_dotenv(dotenv_path="../.env")
API_KEY = os.getenv("YOUTUBE_API_KEY")
if not API_KEY:
    raise ValueError("❌ API_KEY is missing!")

def get_max_video_index():
    """Fetch latest video_index from Supabase."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT MAX(video_index) FROM questions")
    result = cur.fetchone()
    cur.close()
    conn.close()
    print(f"🔍 Latest video index in DB: {result[0]}")
    return result[0] if result[0] is not None else 0

def get_uploads_playlist_id():
    url = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}"
    return requests.get(url).json()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

def fetch_all_videos(playlist_id):
    video_list, page_token = [], ""
    while True:
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&pageToken={page_token}&key={API_KEY}"
        items = requests.get(url).json().get("items", [])
        for item in items:
            vid = item["snippet"]["resourceId"]["videoId"]
            date = item["snippet"]["publishedAt"][:10]
            title = item["snippet"]["title"]
            video_list.append(f"{vid} | {date} | {title}")
        page_token = requests.get(url).json().get("nextPageToken", "")
        if not page_token: break
    return video_list

def extract_index(title):
    match = re.match(r"#(\d+)", title)
    return int(match.group(1)) if match else -1

def save_new_videos(videos, max_index):
    new_videos = [v for v in videos if extract_index(v.split(" | ")[2]) > max_index]
    if len(new_videos) == 0:
        print("🔹 No new videos found since last update.")
        return 0
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for v in new_videos:
            f.write(v + "\n")
    print(f"✅ {len(new_videos)} new videos saved to {OUTPUT_FILE}")
    return len(new_videos)

if __name__ == "__main__":
    print("🔹 Starting new video fetch...")
    max_index = get_max_video_index()
    pid = get_uploads_playlist_id()
    videos = fetch_all_videos(pid)
    print("✅ New video fetch complete.")

    count = save_new_videos(videos, max_index)
    if count == 0:
        print("🔹 No new videos to process.")
        exit(1)

    print(f"📁 New videos saved to {OUTPUT_FILE} \n")
