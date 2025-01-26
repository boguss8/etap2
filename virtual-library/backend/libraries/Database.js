class Database {
  constructor(db) {
    this.db = db;
  }

  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (error, row) => {
        if (error) reject(error);
        resolve(row);
      });
    });
  }

  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (error) {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          id: this ? this.lastID : undefined,
          changes: this ? this.changes : 0,
        });
      });
    });
  }
}

module.exports = Database;
