const path = require("path");
const fs = require("fs");
const os = require("os");

class GistInfoRA {
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.wtfimt");
    this._currentLog = path.join(this._logPath, "/gistinfo.json");
    this._ensureLog();
  }
  load() {
    return this._read();
  }
  save(gist_id) {
    this._save({ gist_id })
  }
  _ensureLog() {
    if (!fs.existsSync(this._logPath)) fs.mkdirSync(this._logPath);
    if (!fs.existsSync(this._currentLog)) this._save({ gist_id: null });
  }
  _save(data) {
    fs.writeFileSync(this._currentLog, JSON.stringify(data), {
      encoding: "utf8"
    });
  }
  _read() {
    const data = fs.readFileSync(this._currentLog, { encoding: "utf8" });
    return JSON.parse(data);
  }
}

module.exports = new GistInfoRA();
