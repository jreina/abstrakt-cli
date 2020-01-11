import path from "path";
import fs from "fs";
import os from "os";
import http from "http";
import GithubOAuth from "github-oauth";
import { TokenInfo } from "../models/TokenInfo";

class TokenRA {
  private _logPath: string;
  private _currentLog: string;
  constructor() {
    this._logPath = path.join(os.userInfo().homedir, "/.abstrakt2");
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
    if(!oauth) throw new Error('Could not authenticate with GitHub!');
    return oauth;
  }
  _ensureLog() {
    if (!fs.existsSync(this._logPath)) fs.mkdirSync(this._logPath);
    if (!fs.existsSync(this._currentLog)) this._save({ token: null });
  }
  _save(data: TokenInfo) {
    fs.writeFileSync(this._currentLog, JSON.stringify(data), {
      encoding: "utf8"
    });
  }
  _read(): TokenInfo {
    const data = fs.readFileSync(this._currentLog, { encoding: "utf8" });
    return JSON.parse(data);
  }
  _fromFile(): string | null {
    const { token } = this._read();
    return token;
  }
  _fromOauth(): Promise<string | null> {
    const githubOAuth = GithubOAuth({
      githubClient: "e522f5bed93e6015d935",
      githubSecret: "c5f7989eb0cbcd449475dc8069b6e22e0134c512",
      baseURL: "http://localhost:9001",
      loginURI: "/login",
      callbackURI: "/callback",
      scope: "gist"
    });

    return new Promise((resolve, reject) => {
      const server = http
        .createServer((req, res) => {
          if (!req.url) return;
          if (req.url.match(/login/)) return githubOAuth.login(req, res);
          if (req.url.match(/callback/)) {
            githubOAuth.callback(req, res);
            res.end("You may close this window now.");
          }
        })
        .listen(9001);

      githubOAuth.on("error", (err: Error) => {
        console.error("there was a login error", err);
        server.close();
        return reject(err);
      });

      githubOAuth.on("token", (token: { access_token: string | null }) => {
        this._save({ token: token.access_token });
        server.close();
        return resolve(token.access_token);
      });

      require("openurl").open("http://localhost:9001/login");
    });
  }
}

export default new TokenRA();
