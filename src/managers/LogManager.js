const path = require("path");
const fs = require("fs");
const os = require("os");
const GistManager = require("./GistManager");

module.exports = class LogManager {
  constructor() {}
  async dropLogEntry(idToDelete) {
    const data = JSON.parse(await GistManager.load());
    const items = data.filter(({ id }) => id !== idToDelete);
    return GistManager.updateGist(items);
  }
  async addLogEntry(entry) {
    const items = JSON.parse(await GistManager.load());
    const maxId = items.map(x => x.id).reduce((a, b) => (a > b ? a : b), 0);
    entry.setId(maxId + 1);
    items.push(entry);
    GistManager.updateGist(JSON.stringify(items));
  }
  listLogEntries() {
    return GistManager.load().then(x => JSON.parse(x));
  }
};
