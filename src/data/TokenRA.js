const path = require("path");
const fs = require("fs");
const os = require("os");

class TokenRA {
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.wtfimt");
    this._currentLog = path.join(this._logPath, "/auth.json");
    this._ensureLog();
  }
  /**
   * @returns {Promise<string>}
   */
  async load() {
    const local = this._fromFile();
    if (local) return local;
    const oauth = await this._fromOauth();
    return oauth;
  }
  _ensureLog() {
    if (!fs.existsSync(this._logPath)) fs.mkdirSync(this._logPath);
    if (!fs.existsSync(this._currentLog)) this._save({ token: null });
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
  _fromFile() {
    const { token } = this._read();
    return token;
  }
  _fromOauth() {
    const githubOAuth = require("github-oauth")({
      githubClient: "4e0032121591ec7bf6eb",
      githubSecret: "a626dd4594fe7736d3f88e85862fcaa3e5343b92",
      baseURL: "http://localhost:9001",
      loginURI: "/login",
      callbackURI: "/callback",
      scope: "gist"
    });

    return new Promise((resolve, reject) => {
      this.server = require("http")
        .createServer((req, res) => {
          if (req.url.match(/login/)) return githubOAuth.login(req, res);
          if (req.url.match(/callback/)) {
            githubOAuth.callback(req, res);
            res.end("You may close this window now.");
          }
        })
        .listen(9001);

      githubOAuth.on("error", err => {
        console.error("there was a login error", err);
        this.server.close();
        return reject(err);
      });

      githubOAuth.on("token", (token, serverResponse) => {
        console.log("<TOKEN=%s>", token.access_token);
        this._save({ token: token.access_token });
        this.server.close();
        return resolve(token.access_token);
      });

      require("openurl").open("http://localhost:9001/login");
    });
  }
}

module.exports = new TokenRA();