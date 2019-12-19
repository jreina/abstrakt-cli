const path = require("path");
const fs = require("fs");
const os = require("os");

class FileRA {
    
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.wtfimt");
  }

  save(key, data) {
      const currentLog = path.join(this._logPath, `/${key}.json`);
  }
  _ensureLog(file) {
    if (!fs.existsSync(file)) fs.mkdirSync(file);
  }
}
