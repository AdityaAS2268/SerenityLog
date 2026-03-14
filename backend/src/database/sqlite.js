import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB() {
  const db = await open({
    filename: "./journal.db",
    driver: sqlite3.Database,
  });

  // Create table if it does not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      emotion TEXT,
      confidence REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}
