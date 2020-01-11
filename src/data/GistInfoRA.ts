import path from "path";
import fs from "fs";
import os from "os";

class GistInfoRA {
  _logPath: string;
  _currentLog: string;
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.esotrakt");
    this._currentLog = path.join(this._logPath, "/gistinfo.json");
    this._ensureLog();
  }
  /**
   * @returns {string}
   */
  load(): string | null {
    return this._read();
  }
  save(gist_id: string) {
    this._save({ gist_id });
  }
  _ensureLog() {
    if (!fs.existsSync(this._logPath)) fs.mkdirSync(this._logPath);
    if (!fs.existsSync(this._currentLog)) this._save({ gist_id: null });
  }
  _save(data: { gist_id: string | null }) {
    fs.writeFileSync(this._currentLog, JSON.stringify(data), {
      encoding: "utf8"
    });
  }
  _read(): string | null {
    const data = fs.readFileSync(this._currentLog, { encoding: "utf8" });
    return JSON.parse(data).gist_id;
  }
}

export default new GistInfoRA();
