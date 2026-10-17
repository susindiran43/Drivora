import os
import sqlite3

def load_seed(db_path: str = "drivora.db", seed_path: str = "seed_data.sql"):
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
