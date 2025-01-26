class ApiService {
  constructor(baseUrl = "http://localhost:3000/api") {
    this.baseUrl = baseUrl;
  }

  async fetchBooks() {
    const response = await fetch(`${this.baseUrl}/books`);
    return await response.json();
  }

  async createBook(bookData) {
    try {
      const response = await fetch(`${this.baseUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }

  async fetchReviews(bookId = null) {
    const url = bookId
      ? `${this.baseUrl}/books/${bookId}/reviews`
      : `${this.baseUrl}/reviews`;
    const response = await fetch(url);
    return await response.json();
  }

  async createReview(reviewData) {
    try {
      const response = await fetch(`${this.baseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async updateReview(id, reviewData) {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      const response = await fetch(`${this.baseUrl}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      const response = await fetch(`${this.baseUrl}/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }
}
