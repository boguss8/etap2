class BookController {
  constructor(bookModel, libraryManager) {
    this.bookModel = bookModel;
    this.libraryManager = libraryManager;
  }

  async index(req, res) {
    try {
      const books = await this.bookModel.findAll();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const book = await this.libraryManager.getBookWithReviews(req.params.id);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const result = await this.bookModel.save(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const result = await this.bookModel.save({
        ...req.body,
        id: req.params.id,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.libraryManager.deleteBookWithReviews(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BookController;
