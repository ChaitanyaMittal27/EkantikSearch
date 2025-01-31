import os

print("🚀 Running full update process...")

# Step 1: Update the database
os.system("python update_DB.py")

# Step 2: Export to JSON
os.system("python export_to_json.py")

print("✅ Update process completed successfully!")
