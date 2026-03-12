import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB() {
  const db = await open({
    filename: "./journal.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      ambience TEXT,
      text TEXT,
      emotion TEXT,
      summary TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}
