class Review {
  constructor(database) {
    this.db = database;
  }

  async findByBookId(bookId) {
    return await this.db.all("SELECT * FROM reviews WHERE book_id = ?", [
      bookId,
    ]);
  }

  async findById(id) {
    return await this.db.get("SELECT * FROM reviews WHERE id = ?", [id]);
  }

  async findAll() {
    return await this.db.all("SELECT * FROM reviews");
  }

  async save(review) {
    if (review.id) {
      return await this.db.run(
        "UPDATE reviews SET book_id = ?, user_name = ?, rating = ?, content = ? WHERE id = ?",
        [
          review.book_id,
          review.user_name,
          review.rating,
          review.content,
          review.id,
        ]
      );
    }
    return await this.db.run(
      "INSERT INTO reviews (book_id, user_name, rating, content) VALUES (?, ?, ?, ?)",
      [review.book_id, review.user_name, review.rating, review.content]
    );
  }

  async delete(id) {
    return await this.db.run("DELETE FROM reviews WHERE id = ?", [id]);
  }

  async deleteByBookId(bookId) {
    return await this.db.run("DELETE FROM reviews WHERE book_id = ?", [bookId]);
  }
}

module.exports = Review;
