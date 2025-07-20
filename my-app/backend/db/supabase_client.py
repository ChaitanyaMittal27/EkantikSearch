# backend/db/supabase_client.py

import os
import psycopg2
from dotenv import load_dotenv

# Load Supabase SQL DB credentials
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env.supabase"))

# Debug: Show exactly what values are being used
PGHOST = os.getenv("PGHOST")
PGPORT = os.getenv("PGPORT")
PGDATABASE = os.getenv("PGDATABASE")
PGUSER = os.getenv("PGUSER")
PGPASSWORD = os.getenv("PGPASSWORD")


def get_connection():
    return psycopg2.connect(
        host=PGHOST,
        port=PGPORT,
        database=PGDATABASE,
        user=PGUSER,
        password=PGPASSWORD
    )
