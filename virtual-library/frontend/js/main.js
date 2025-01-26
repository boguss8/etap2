document.addEventListener("DOMContentLoaded", async () => {
  const state = new ReactiveState({
    books: [],
    currentBookReviews: [],
    currentBookId: null,
  });

  const apiService = new ApiService();
  const domManager = new DOMManager(state, apiService);
  window.domManager = domManager;
  const books = await apiService.fetchBooks();
  state.set("books", books);
});
