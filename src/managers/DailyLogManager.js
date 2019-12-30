const DailyGistRA = require("../data/DailyGistRA");
const TokenRA = require("../data/TokenRA");
const GistInfoRA = require("../data/GistInfoRA");

module.exports = class DailyLogManager {
  constructor() {}
  /**
   *
   * @param {number} idToDelete
   */
  async dropLogEntry(idToDelete) {
    const token = await TokenRA.load();
    const ra = new DailyGistRA(token);
    const gistId = GistInfoRA.load();
    if (!gistId) return console.log("Nothing to drop");
    const data = await ra.load(gistId);
    const items = data.filter(({ id }) => id !== idToDelete);
    return ra.update(items, gistId);
  }
  async addLogEntry(entry) {
    const token = await TokenRA.load();
    const ra = new DailyGistRA(token);
    const gistId = GistInfoRA.load();
    if (!gistId) {
      const id = await ra.create();
      GistInfoRA.save(id);
    }
    const data = await ra.load(gistId);

    const maxId = data.map(x => x.id).reduce((a, b) => (a > b ? a : b), 0);
    entry.setId(maxId + 1);
    data.push(entry);
    return ra.update(data, gistId);
  }
  async listLogEntries() {
    const token = await TokenRA.load();
    const ra = new DailyGistRA(token);
    return ra.load(GistInfoRA.load());
  }
};
