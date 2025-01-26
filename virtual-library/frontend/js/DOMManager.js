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
          const bookData = {
            title: formData.get("title").trim(),
            author: formData.get("author").trim(),
            year: parseInt(formData.get("year"), 10),
            description: formData.get("description")?.trim() || "",
          };

          let newBook;
          const bookId = formData.get("bookId");

          if (bookId) {
            newBook = await this.api.updateBook(bookId, bookData);
            if (!newBook) throw new Error("Failed to update book");

            const books = this.state
              .get("books")
              .map((book) => (book.id === parseInt(bookId) ? newBook : book));
            this.state.set("books", books);
          } else {
            newBook = await this.api.createBook(bookData);
            const books = [...this.state.get("books"), newBook];
            this.state.set("books", books);
          }

          this.hideModal("book-modal");
          e.target.reset();
        } catch (error) {
          alert(`Failed to save book: ${error.message}`);
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

          let newReview;
          const reviewId = formData.get("reviewId");

          if (reviewId) {
            newReview = await this.api.updateReview(reviewId, reviewData);
            const reviews = this.state
              .get("currentBookReviews")
              .map((review) =>
                review.id === parseInt(reviewId) ? newReview : review
              );
            this.state.set("currentBookReviews", reviews);
          } else {
            newReview = await this.api.createReview(reviewData);
            const reviews = [
              ...this.state.get("currentBookReviews"),
              newReview,
            ];
            this.state.set("currentBookReviews", reviews);
          }

          this.hideModal("review-modal");
          this.showModal("reviews-section");
          e.target.reset();
        } catch (error) {
          alert(`Failed to save review: ${error.message}`);
        }
      });

    document
      .getElementById("filter-reviews")
      ?.addEventListener("change", (e) => {
        const rating = parseInt(e.target.value, 10);
        const allReviews = this.state.get("currentBookReviews");

        if (rating === 0) {
          this.renderReviews(allReviews);
        } else {
          const filteredReviews = allReviews.filter(
            (review) => review.rating === rating
          );
          this.renderReviews(filteredReviews);
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
                <div class="book-actions">
                    <button onclick="domManager.showReviews(${
                      book.id
                    })">Show Reviews</button>
                    <button onclick="domManager.editBook(${JSON.stringify(
                      book
                    ).replace(/"/g, "&quot;")})">
                        Edit
                    </button>
                    <button onclick="domManager.deleteBook(${book.id})">
                        Delete
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  renderReviews(reviewsToRender = null) {
    const reviewsList = document.getElementById("reviews-list");
    const reviews = reviewsToRender || this.state.get("currentBookReviews");
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
            <div class="review-actions">
              <button onclick="domManager.editReview(${JSON.stringify(
                review
              ).replace(/"/g, "&quot;")})">
                Edit
              </button>
              <button onclick="domManager.deleteReview(${review.id})">
                Delete
              </button>
            </div>
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
      if (document.getElementById("filter-reviews")) {
        document.getElementById("filter-reviews").value = "0";
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to load reviews");
    }
  }

  async editReview(review) {
    const form = document.getElementById("review-form");
    form.elements["reviewId"].value = review.id;
    form.elements["bookId"].value = review.book_id;
    form.elements["reviewer"].value = review.user_name;
    form.elements["rating"].value = review.rating;
    form.elements["content"].value = review.content;

    this.hideModal("reviews-section");
    this.showModal("review-modal");
  }

  async deleteReview(reviewId) {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await this.api.deleteReview(reviewId);
        const reviews = this.state
          .get("currentBookReviews")
          .filter((review) => review.id !== reviewId);
        this.state.set("currentBookReviews", reviews);
      } catch (error) {
        alert(`Failed to delete review: ${error.message}`);
      }
    }
  }

  async editBook(book) {
    const form = document.getElementById("book-form");
    form.elements["bookId"].value = book.id;
    form.elements["title"].value = book.title;
    form.elements["author"].value = book.author;
    form.elements["year"].value = book.year;
    form.elements["description"].value = book.description || "";

    this.showModal("book-modal");
  }

  async deleteBook(bookId) {
    if (
      confirm(
        "Are you sure you want to delete this book? All reviews will also be deleted."
      )
    ) {
      try {
        await this.api.deleteBook(bookId);
        const books = this.state
          .get("books")
          .filter((book) => book.id !== bookId);
        this.state.set("books", books);
      } catch (error) {
        alert(`Failed to delete book: ${error.message}`);
      }
    }
  }
}
