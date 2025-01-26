class LibraryManager {
  constructor(bookModel, reviewModel) {
    this.bookModel = bookModel;
    this.reviewModel = reviewModel;
  }

  async getBookWithReviews(bookId) {
    const book = await this.bookModel.findById(bookId);
    if (!book) return null;
    book.reviews = await this.reviewModel.findByBookId(bookId);
    return book;
  }

  async deleteBookWithReviews(bookId) {
    try {
      const book = await this.bookModel.findById(bookId);
      if (!book) {
        throw new Error("Book not found");
      }

      await this.reviewModel.deleteByBookId(bookId);

      await this.bookModel.delete(bookId);

      return true;
    } catch (error) {
      console.error("Error in deleteBookWithReviews:", error);
      throw error;
    }
  }
}

module.exports = LibraryManager;
