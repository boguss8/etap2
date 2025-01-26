const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const initDatabase = () => {
  const db = new sqlite3.Database(
    path.resolve(__dirname, "../data/library.db")
  );

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER,
            description TEXT
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            user_name TEXT NOT NULL,
            rating INTEGER,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(book_id) REFERENCES books(id)
        )`);
  });

  return db;
};

module.exports = { initDatabase };
