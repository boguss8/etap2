class Book {
  constructor(database) {
    this.db = database;
  }

  async findAll() {
    return await this.db.all("SELECT * FROM books");
  }

  async findById(id) {
    return await this.db.get("SELECT * FROM books WHERE id = ?", [id]);
  }

  async save(book) {
    if (book.id) {
      return await this.db.run(
        "UPDATE books SET title = ?, author = ?, year = ?, description = ? WHERE id = ?",
        [book.title, book.author, book.year, book.description, book.id]
      );
    }
    return await this.db.run(
      "INSERT INTO books (title, author, year, description) VALUES (?, ?, ?, ?)",
      [book.title, book.author, book.year, book.description]
    );
  }

  async delete(id) {
    return await this.db.run("DELETE FROM books WHERE id = ?", [id]);
  }
}

module.exports = Book;
