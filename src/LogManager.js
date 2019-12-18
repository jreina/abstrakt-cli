const path = require("path");
const fs = require("fs");
const os = require("os");

module.exports = class LogManager {
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.wtfimt");
    this._currentLog = path.join(this._logPath, "/log.json");
    this._ensureLog();
  }
  dropLogEntry(idToDelete) {
    const items = this._read().filter(({ id }) => id !== idToDelete);
    this._save(items);
  }
  addLogEntry(entry) {
    const items = this._read();
    const maxId = items.map(x => x.id).reduce((a, b) => a > b ? a : b, 0);
    entry.setId(maxId + 1);
    items.push(entry);
    this._save(items);
  }
  listLogEntries() {
    return this._read();
  }
  _ensureLog() {
    if (!fs.existsSync(this._logPath)) fs.mkdirSync(this._logPath);
    if (!fs.existsSync(this._currentLog)) this._save([]);
  }
  _read() {
    const text = fs.readFileSync(this._currentLog, { encoding: "utf8" });
    return JSON.parse(text);
  }
  _save(items) {
    const text = JSON.stringify(items);
    fs.writeFileSync(this._currentLog, text, { encoding: "utf8" });
  }
}
