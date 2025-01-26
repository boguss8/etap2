const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../data/library.db");

const seedDatabase = () => {
  require("fs").unlinkSync(dbPath);

  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`CREATE TABLE books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER,
            description TEXT
        )`);

    db.run(`CREATE TABLE reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            user_name TEXT NOT NULL,
            rating INTEGER,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(book_id) REFERENCES books(id)
        )`);

    const books = [
      ["Pan Tadeusz", "Adam Mickiewicz", 1834, "Epopeja narodowa"],
      ["Lalka", "Bolesław Prus", 1890, "Powieść społeczno-obyczajowa"],
      ["Quo Vadis", "Henryk Sienkiewicz", 1896, "Powieść historyczna"],
      ["Chłopi", "Władysław Reymont", 1904, "Epopeja chłopska"],
      ["Ferdydurke", "Witold Gombrowicz", 1937, "Powieść awangardowa"],
    ];

    const insertBook = db.prepare(
      "INSERT INTO books (title, author, year, description) VALUES (?, ?, ?, ?)"
    );
    books.forEach((book) => insertBook.run(book));
    insertBook.finalize();

    const reviews = [
      [1, "Jan", 5, "Klasyka polskiej literatury"],
      [1, "Anna", 4, "Wspaniała epopeja"],
      [2, "Piotr", 5, "Świetne studium społeczne"],
      [2, "Maria", 4, "Doskonały obraz XIX wieku"],
      [3, "Tomasz", 5, "Porywająca historia"],
    ];

    const insertReview = db.prepare(
      "INSERT INTO reviews (book_id, user_name, rating, content) VALUES (?, ?, ?, ?)"
    );
    reviews.forEach((review) => insertReview.run(review));
    insertReview.finalize();
  });

  db.close(() => {
    console.log("Database reset");
  });
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
