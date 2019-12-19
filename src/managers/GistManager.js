const TokenRA = require("../data/TokenRA");
const GistInfoRA = require("../data/GistInfoRA");
const github = require("@octokit/rest");

class GistManager {
  constructor() {
    this.GIST_JSON_EMPTY = {
      description: "Abstrakt Entries",
      public: false,
      files: {
        "log.json": {
          content: "[]"
        }
      }
    };
  }
  async load() {
    const token = await TokenRA.load();
    const gh = new github({ auth: `token ${token}` });
    const { gist_id } = GistInfoRA.load();
    if (!gist_id) return this.createGist();
    const gists = await gh.gists.get({ gist_id });
    return gists.data.files['log.json'].content;
  }

  async createGist() {
    const token = await TokenRA.load();
    const gh = new github({ auth: `token ${token}` });
    const gist = await gh.gists.create(this.GIST_JSON_EMPTY);
    const id = gist.data.id;
    GistInfoRA.save(id);
  }

  async updateGist(content) {
    const token = await TokenRA.load();
    const gh = new github({ auth: `token ${token}` });
    const { gist_id } = GistInfoRA.load();
    if (!gist_id) return this.createGist();
    return gh.gists.update({
      gist_id,
      files: {
        "log.json": {
          content
        }
      }
    });
  }
}

module.exports = new GistManager();
