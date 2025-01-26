const express = require("express");
const { initDatabase } = require("./config/database");
const Database = require("./libraries/Database");
const Router = require("./libraries/Router");
const Book = require("./models/Book");
const Review = require("./models/Review");
const BookController = require("./controllers/BookController");
const ReviewController = require("./controllers/ReviewController");
const LibraryManager = require("./libraries/LibraryManager");

const app = express();
const port = 3000;
const router = new Router();

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Initialize services
const database = new Database(initDatabase());
const bookModel = new Book(database);
const reviewModel = new Review(database);
const libraryManager = new LibraryManager(bookModel, reviewModel);
const bookController = new BookController(bookModel, libraryManager);
const reviewController = new ReviewController(reviewModel);

// Book routes
router.get("/books", (req, res) => bookController.index(req, res));
router.get("/books/:id", (req, res) => bookController.show(req, res));
router.post("/books", (req, res) => bookController.create(req, res));
router.put("/books/:id", (req, res) => bookController.update(req, res));
router.delete("/books/:id", (req, res) => bookController.delete(req, res));

// Review routes
router.get("/books/:bookId/reviews", (req, res) =>
  reviewController.index(req, res)
);
router.get("/reviews", (req, res) => reviewController.index(req, res));
router.get("/reviews/:id", (req, res) => reviewController.show(req, res));
router.post("/reviews", (req, res) => reviewController.create(req, res));
router.put("/reviews/:id", (req, res) => reviewController.update(req, res));
router.delete("/reviews/:id", (req, res) => reviewController.delete(req, res));

app.use(router.middleware());

app.listen(port, () => console.log(`Server running on port ${port}`));
