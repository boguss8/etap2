class ReactiveState {
  constructor(initialState = {}) {
    this.state = {};
    this.observers = new Map();
    this.init(initialState);
  }

  init(initialState) {
    for (const [key, value] of Object.entries(initialState)) {
      this.state[key] = value;
      this.observers.set(key, new Set());
    }
  }

  subscribe(property, callback) {
    if (!this.observers.has(property)) {
      this.observers.set(property, new Set());
    }
    this.observers.get(property).add(callback);
    return () => {
      this.observers.get(property).delete(callback);
    };
  }

  notify(property) {
    if (this.observers.has(property)) {
      this.observers
        .get(property)
        .forEach((callback) => callback(this.state[property]));
    }
  }

  set(property, value) {
    this.state[property] = value;
    this.notify(property);
  }

  get(property) {
    return this.state[property];
  }
}
