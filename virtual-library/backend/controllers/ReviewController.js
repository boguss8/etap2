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
      const required = ["book_id", "user_name", "rating", "content"];
      for (const field of required) {
        if (req.body[field] === undefined || req.body[field] === "") {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const rating = parseInt(req.body.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be a number between 1 and 5");
      }

      const reviewData = {
        book_id: parseInt(req.body.book_id),
        user_name: req.body.user_name.trim(),
        rating: rating,
        content: req.body.content.trim(),
      };

      const result = await this.reviewModel.save(reviewData);
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
