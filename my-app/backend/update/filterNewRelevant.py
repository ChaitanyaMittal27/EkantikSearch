"""
filterNewRelevant.py - Filters #XXX format videos from update/new_videos.txt.
"""

import re

INPUT_FILE = "update/new_videos.txt"
OUTPUT_FILE = "update/new_filtered.txt"

def filter_relevant():
    pattern = re.compile(r"#(\d{3,4})")
    filtered = []
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            title = line.strip().split(" | ")[-1]
            if pattern.search(title):
                filtered.append(line.strip())
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for v in filtered:
            f.write(v + "\n")
    print(f"✅ {len(filtered)} videos filtered and saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    print("🔹 Starting filtering for relevant videos...")
    filter_relevant()
    print("✅ Filtering complete. Relevant videos saved. \n")
