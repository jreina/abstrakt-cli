const TokenRA = require("../data/TokenRA");
const GistInfoRA = require("../data/GistInfoRA");
const github = require("@octokit/rest");
const got = require("got");

class DailyGistRA {
  /**
   *
   * @param {string} token
   */
  constructor(token) {
    this.github = new github({ auth: `token ${token}` });
    this.GIST_JSON_EMPTY = {
      description: "Abstrakt Entries",
      public: false,
      files: {
        "log.json": {
          content: "[]"
        },
        "daily.json": {
          content: "[]"
        }
      }
    };
  }
  /**
   *
   * @param {string} gistId
   * @returns {Array<{category: string, time: Date, subject: string, id: number}>}
   */
  async load(gistId) {
    const gists = await this.github.gists.get({ gist_id: gistId });
    const file = gists.data.files["daily.json"];
    if(!file) return [];
    if (file.truncated) {
      const { body } = await got(file.raw_url);
      return JSON.parse(body);
    }
    return JSON.parse(file.content);
  }

  /**
   * @returns {Promise<string>} The ID of the newly created gist.
   */
  async create() {
    const gist = await this.github.gists.create(this.GIST_JSON_EMPTY);
    const id = gist.data.id;
    return id;
  }

  /**
   *
   * @param {Array<{category: string, time: Date, subject: string, id: number}>} content
   * @param {string} gistId
   */
  async update(content, gistId) {
    content = JSON.stringify(content);
    return this.github.gists.update({
      gist_id: gistId,
      files: {
        "daily.json": {
          content
        }
      }
    });
  }
}

module.exports = DailyGistRA;
