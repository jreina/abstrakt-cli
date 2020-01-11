import GistRA from "../data/GistRA";
import TokenRA from "../data/TokenRA";
import GistInfoRA from "../data/GistInfoRA";
import { CollectionItem } from "../models/CollectionItem";
import { NewCollectionItem } from "../models/NewCollectionItem";

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
    const items = data.filter(line => line.id !== idToDelete);
    return ra.update(items, gistId);
  }
  async addRef(title: string) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);

    const maxId = data.reduce((a, { id }) => (a > +id ? a : +id), 0) + 1;

    data.push({ title, id: maxId.toString() });
    return ra.update(data, gistId);
  }
  async add(item: NewCollectionItem) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);

    const maxId = data.reduce((a, { id }) => (a > +id ? a : +id), 0) + 1;

    data.push({ ...item, id: maxId.toString() });
    return ra.update(data, gistId);
  }
  async editLogEntry(
    id: string,
    xform: (item: CollectionItem) => CollectionItem
  ) {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);

    const newEntries = data.map(entry =>
      entry.id === id ? xform(entry) : entry
    );

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
