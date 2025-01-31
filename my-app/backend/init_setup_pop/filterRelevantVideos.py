"""
filterRelevantVideos.py - Filters relevant videos from the list.

This script:
- Reads `backend/all_videos.txt`.
- Extracts only videos with `#XXX` in the title, where XXX is a 3-digit number.
- Saves the filtered list to `backend/filtered_videos.txt`.
- Identifies missing video numbers and checks if they exist in `all_videos.txt`.
- Saves missing results to `backend/missingafterfilter.txt`.

Output:
- `backend/filtered_videos.txt` (Filtered relevant videos).
- `backend/missingafterfilter.txt` (Missing videos check).
"""


import re

# 🔹 Input and output file paths
INPUT_FILE = "all_videos.txt"
OUTPUT_FILE = "filtered_videos.txt"
MISSING_FILE = "missingafterfilter.txt"

def debug_dump(video_numbers):
    """Prints a debug statement showing video number range and missing videos."""
    if not video_numbers:
        print("❌ No valid videos found matching #XXX format.")
        return
    
    min_num, max_num = min(video_numbers), max(video_numbers)
    full_range = set(range(min_num, max_num + 1))
    missing_numbers = sorted(full_range - set(video_numbers))
    
    print(f"🔹 Video Range: {min_num} - {max_num}")
    if not missing_numbers:
        print(f"✅ All videos from {min_num} to {max_num} are present.")
    else:
        print(f"⚠️ Missing videos: {', '.join(map(str, missing_numbers))}")
    
    generate_missing_report(missing_numbers)

def generate_missing_report(missing_numbers):
    """Generates a report checking if missing numbers exist in all_videos.txt."""
    found, not_found = [], []
    
    with open(INPUT_FILE, "r", encoding="utf-8") as infile:
        all_videos = infile.read()
    
    for num in missing_numbers:
        if f"#{num}" in all_videos:
            found.append(num)
        else:
            not_found.append(num)
    
    # Sort found (high to low) and not found (high to low)
    found.sort(reverse=True)
    not_found.sort(reverse=True)
    
    # Write results to missing file
    with open(MISSING_FILE, "w", encoding="utf-8") as outfile:
        for num in found:
            outfile.write(f"{num} | Yes\n")
        for num in not_found:
            outfile.write(f"{num} | No\n")
    
    print(f"✅ Missing video check completed. Results saved to {MISSING_FILE}")

def filter_relevant_videos():
    """Reads all_videos.txt and extracts videos matching #XXX format in the title."""
    filtered_videos = []
    video_numbers = []
    pattern = re.compile(r"#(\d{3})")  # Matches # followed by exactly 3 digits
    
    with open(INPUT_FILE, "r", encoding="utf-8") as infile:
        for line in infile:
            parts = line.strip().split(" | ")
            if len(parts) == 3:
                video_id, video_date, video_title = parts
                match = pattern.search(video_title)
                if match:
                    video_number = int(match.group(1))
                    video_numbers.append(video_number)
                    filtered_videos.append(f"{video_id} | {video_date} | {video_title}")
    
    # Save filtered videos
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        for video in filtered_videos:
            outfile.write(video + "\n")
    
    print(f"✅ Filtered {len(filtered_videos)} videos and saved to {OUTPUT_FILE}")
    debug_dump(video_numbers)

if __name__ == "__main__":
    filter_relevant_videos()