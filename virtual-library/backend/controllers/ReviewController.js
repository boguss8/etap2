class ReviewController {
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }

  async index(req, res) {
    try {
      const reviews = req.params.bookId
        ? await this.reviewModel.findByBookId(req.params.bookId)
        : await this.reviewModel.findAll();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const review = await this.reviewModel.findById(req.params.id);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const result = await this.reviewModel.save(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const result = await this.reviewModel.save({
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
      await this.reviewModel.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReviewController;
