import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME     = os.getenv("DB_NAME", "api_monitoring")
DB_PORT     = int(os.getenv("DB_PORT", 3306))

# CONNECT TO MYSQL (no database selected yet)
db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    port=DB_PORT
)
cursor = db.cursor(dictionary=True)

# CREATE DATABASE
cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")

# USE DATABASE
cursor.execute(f"USE {DB_NAME}")

# READ schema.sql
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(BASE_DIR, "schema.sql")

with open(schema_path, "r") as file:
    sql_script = file.read()

# SPLIT AND EXECUTE QUERIES
for query in sql_script.split(";"):
    query = query.strip()
    if query:
        cursor.execute(query)

db.commit()
print("Database + Tables Ready")


def create_connection():
    db = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )
    cursor = db.cursor(dictionary=True)
    return db, cursor