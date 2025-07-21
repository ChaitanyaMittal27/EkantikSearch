import os
import psycopg2
from dotenv import load_dotenv

# Load .env.supabase
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env.supabase"))

def get_connection():
    host = os.getenv("PGHOST")
    port = os.getenv("PGPORT")
    dbname = os.getenv("PGDATABASE")
    user = os.getenv("PGUSER")
    password = os.getenv("PGPASSWORD")

    dsn = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    
    # debug: print(f"\n🔗 Connecting via DSN: {dsn.replace(password, '****')}\n")  # For debug (hides password)

    return psycopg2.connect(dsn)
