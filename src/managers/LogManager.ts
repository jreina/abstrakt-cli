import GistRA from "../data/GistRA";
import TokenRA from "../data/TokenRA";
import GistInfoRA from "../data/GistInfoRA";
import { hasId } from "../utils/hasId";
import { not } from "../utils/not";

export default class LogManager {
  constructor() {}
  /**
   *
   * @param {number} idToDelete
   */
  async dropLogEntry(idToDelete: string) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = GistInfoRA.load();
    if (!gistId) return console.log("Nothing to drop");
    const data = await ra.load(gistId);
    const items = data.filter(line => line.split("::")[0] !== idToDelete);
    return ra.update(items, gistId);
  }
  async addLogEntry(entry: string) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);

    const maxId =
      data.map(x => +x.split("::")[0]).reduce((a, b) => (a > b ? a : b), 0) + 1;

    data.push(`${maxId}::${new Date().getTime()}::${entry}`);
    return ra.update(data, gistId);
  }
  async editLogEntry(id: string, entry: string) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);
    const newEntry = `${id}::${new Date().getTime()}::${entry}`;

    const newEntries = data.filter(not(hasId(id))).concat(newEntry);

    return ra.update(newEntries, gistId);
  }
  async listLogEntries() {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    return ra.load(gistId);
  }
  private async _ensureGist(): Promise<string> {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    let gistId = GistInfoRA.load();
    if (!gistId) {
      gistId = await ra.create();
      GistInfoRA.save(gistId);
    }
    return gistId;
  }
}
