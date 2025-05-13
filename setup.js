import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

const dataDir = path.resolve('data');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.sqlite');

const init = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS races (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      race_id INTEGER,
      race_name TEXT,
      name TEXT,
      time TEXT,
      FOREIGN KEY (race_id) REFERENCES races(id)
    );
  `);

  console.log("Database and tables created.");
  await db.close();
};

init().catch(err => {
  console.error("Setup failed:", err);
});
