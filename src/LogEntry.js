module.exports = class LogEntry {
  constructor(category, time, subject) {
    this.category = category;
    this.time = time;
    this.subject = subject;
  }
  setId(id) {
    this.id = id;
  }
};
