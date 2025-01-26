class DOMManager {
  constructor(state, apiService) {
    this.state = state;
    this.api = apiService;
    this.setupEventListeners();
    this.setupStateObservers();
  }

  setupStateObservers() {
    this.state.subscribe("books", () => this.renderBooks());
    this.state.subscribe("currentBookReviews", () => {
      this.renderReviews();
      this.showModal("reviews-section");
    });
  }

  setupEventListeners() {
    document.getElementById("add-book-btn")?.addEventListener("click", () => {
      this.showModal("book-modal");
    });
    document
      .getElementById("book-form")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.target);
          const bookData = Object.fromEntries(formData.entries());
          bookData.year = parseInt(bookData.year, 10);
          const newBook = await this.api.createBook(bookData);
          const books = [...this.state.get("books"), newBook];
          this.state.set("books", books);
          this.hideModal("book-modal");
          e.target.reset();
        } catch (error) {
          console.error("Error creating book:", error);
          alert("Failed to create book. Please try again.");
        }
      });
    document.querySelectorAll(".close-modal").forEach((button) => {
      button.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) {
          this.hideModal(modal.id);
        }
      });
    });
    document.getElementById("sort-books").addEventListener("change", (e) => {
      const books = [...this.state.get("books")];
      const key = e.target.value;
      books.sort((a, b) => {
        if (key === "id" || key === "year") {
          return a[key] - b[key];
        }
        return a[key].localeCompare(b[key]);
      });
      this.state.set("books", books);
    });
    document.getElementById("add-review-btn")?.addEventListener("click", () => {
      const bookId = this.state.get("currentBookId");
      document.querySelector('#review-form input[name="bookId"]').value =
        bookId;
      this.hideModal("reviews-section");
      this.showModal("review-modal");
    });
    document
      .getElementById("review-form")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.target);
          const reviewData = {
            book_id: parseInt(formData.get("bookId"), 10),
            user_name: formData.get("reviewer").trim(),
            rating: parseInt(formData.get("rating"), 10),
            content: formData.get("content").trim(),
          };
          if (
            !reviewData.book_id ||
            !reviewData.user_name ||
            !reviewData.rating ||
            !reviewData.content
          ) {
            throw new Error("Please fill in all fields");
          }
          const newReview = await this.api.createReview(reviewData);
          const reviews = [...this.state.get("currentBookReviews"), newReview];
          this.state.set("currentBookReviews", reviews);
          this.hideModal("review-modal");
          this.showModal("reviews-section");
          e.target.reset();
        } catch (error) {
          alert(`Failed to create review: ${error.message}`);
        }
      });
  }

  showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  hideModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }

  renderBooks() {
    const booksList = document.getElementById("books-list");
    const books = this.state.get("books");
    booksList.innerHTML = books
      .map(
        (book) => `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p>By: ${book.author}</p>
                <p>Year: ${book.year}</p>
                ${book.description ? `<p>${book.description}</p>` : ""}
                <button onclick="domManager.showReviews(${
                  book.id
                })">Show Reviews</button>
            </div>
        `
      )
      .join("");
  }

  renderReviews() {
    const reviewsList = document.getElementById("reviews-list");
    const reviews = this.state.get("currentBookReviews");
    if (!reviewsList || !reviews) return;
    if (reviews.length === 0) {
      reviewsList.innerHTML = "<p>No reviews yet</p>";
      return;
    }
    reviewsList.innerHTML = reviews
      .map(
        (review) => `
            <div class="review-card">
                <div class="rating">${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )}</div>
                <p>${review.content}</p>
                <small>By: ${review.user_name}</small>
            </div>
        `
      )
      .join("");
  }

  async showReviews(bookId) {
    try {
      const reviews = await this.api.fetchReviews(bookId);
      this.state.set("currentBookId", bookId);
      this.state.set("currentBookReviews", reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to load reviews");
    }
  }
}
