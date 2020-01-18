import GistRA from "../data/GistRA";
import TokenRA from "../data/TokenRA";
import GistInfoRA from "../data/GistInfoRA";
import { CollectionItem } from "../models/CollectionItem";

export default class Database<T extends Partial<CollectionItem>> {
  constructor() {}
  /**
   * Delete an item by `id`
   * @param {number} id
   */
  async delete(id: string): Promise<void> {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = GistInfoRA.load();
    if (!gistId) return;
    const data = await ra.load(gistId);
    const items = data.filter(line => line.id !== id);
    await ra.update(items, gistId);
  }
  /**
   * Insert an item and return the `id` of the new item.
   * @param item 
   */
  async add(item: T): Promise<number> {
    const token = await TokenRA.load();
    const ra = new GistRA(token);
    const gistId = await this._ensureGist();
    const data = await ra.load(gistId);

    const maxId = data.reduce((a, { id }) => (a > +id ? a : +id), 0) + 1;

    data.push({ ...item, id: maxId });
    await ra.update(data, gistId);
    return maxId;
  }
  /**
   * Map over an item by its `id`
   * @param id 
   * @param xform 
   */
  async update(
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

    await ra.update(newEntries, gistId);
  }
  async list(): Promise<Array<T>> {
    const token = await TokenRA.load();
    // @ts-ignore
    const ra = new GistRA<T>(token);
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
