from db_controller import TableEntry, insert_into_db, setup_database, debug_print

# 🔹 Ensure database is set up
setup_database()

# 🔹 Sample data entries
sample_entries = [
    TableEntry("क्या भगवान हमारे कर्मों को माफ कर सकते हैं?", "https://youtube.com/watch?v=123456", "02:15", "2025-01-28", 2, 0),
    TableEntry("कैसे ध्यान करें कि मन इधर-उधर ना भागे?", "https://youtube.com/watch?v=654321", "05:45", "2025-01-27", 3, 1),
    TableEntry("क्या सिर्फ नाम जप से सारे कर्म नष्ट हो जाएंगे?", "https://youtube.com/watch?v=987654", "07:30", "2025-01-29", 1, 2),
]

# 🔹 Insert test entries into the database
for entry in sample_entries:
    insert_into_db(entry)

# 🔹 Print stored data for verification
print("\n✅ Debug Dump - Expected Sorted Order (Highest `video_index` first):")
debug_print()
