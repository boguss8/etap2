class Review {
  constructor(database) {
    this.db = database;
  }

  async findAll() {
    return await this.db.all("SELECT * FROM reviews");
  }

  async findById(id) {
    return await this.db.get("SELECT * FROM reviews WHERE id = ?", [id]);
  }

  async findByBookId(bookId) {
    return await this.db.all("SELECT * FROM reviews WHERE book_id = ?", [
      bookId,
    ]);
  }

  async save(review) {
    try {
      if (
        !review.book_id ||
        !review.user_name ||
        !review.rating ||
        !review.content
      ) {
        throw new Error("Missing required fields");
      }

      if (review.id) {
        const result = await this.db.run(
          "UPDATE reviews SET book_id = ?, user_name = ?, rating = ?, content = ? WHERE id = ?",
          [
            review.book_id,
            review.user_name,
            review.rating,
            review.content,
            review.id,
          ]
        );
        return await this.findById(review.id);
      } else {
        const result = await this.db.run(
          "INSERT INTO reviews (book_id, user_name, rating, content) VALUES (?, ?, ?, ?)",
          [review.book_id, review.user_name, review.rating, review.content]
        );

        if (!result || !result.id) {
          throw new Error("Failed to get ID of inserted review");
        }

        return await this.findById(result.id);
      }
    } catch (error) {
      throw new Error(`Failed to save review: ${error.message}`);
    }
  }

  async delete(id) {
    return await this.db.run("DELETE FROM reviews WHERE id = ?", [id]);
  }

  async deleteByBookId(bookId) {
    return await this.db.run("DELETE FROM reviews WHERE book_id = ?", [bookId]);
  }
}

module.exports = Review;
