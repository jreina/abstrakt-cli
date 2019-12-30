module.exports = class DailyLogEntry {
  constructor(time, rating) {
    this.rating = rating;
    this.time = time;
  }
  setId(id) {
    this.id = id;
  }
};
