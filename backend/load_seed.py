import os
import sqlite3

def load_seed(db_path: str = None, seed_path: str = "seed_data.sql"):
    if not db_path:
        db_url = os.getenv("DATABASE_URL", "sqlite:///./drivora.db")
        if db_url.startswith("sqlite:///"):
            db_path = db_url.replace("sqlite:///", "")
        else:
            db_path = "drivora.db"

    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    if not os.path.exists(seed_path):
        seed_path = os.path.join(os.path.dirname(__file__), "..", "seed_data.sql")
    if not os.path.exists(seed_path):
        seed_path = os.path.join(os.path.dirname(__file__), "seed_data.sql")

    conn = sqlite3.connect(db_path)
    with open(seed_path, "r", encoding="utf-8") as f:
        sql_script = f.read()
    conn.executescript(sql_script)
    conn.commit()
    conn.close()
    print("Seed data loaded successfully.")

if __name__ == "__main__":
    load_seed()
