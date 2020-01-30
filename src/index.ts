import LogManager from "./managers/LogManager";
import GistInfoManager from "./managers/GistInfoManager";
import moment from "moment";
import Database from "./managers/Database";

export const abstrakt = {
  ref: (data: string) => {
    const mgr = new LogManager();
    return mgr.addRef(data);
  },
  tag: (id: string, data: string) => {
    const mgr = new LogManager();
    return mgr.editLogEntry(id, item => {
      if (item.tags === undefined) item.tags = [];
      item.tags.push(data);
      return item;
    });
  },
  filter: async (title: string) => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const ofT = items.filter(item => RegExp(title).test(item.title));

    return ofT;
  },
  refs: async () => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const ofT = items.filter(
      ({ start, end, time }) =>
        start === undefined && end === undefined && time === undefined
    );

    return ofT;
  },
  find: async (id: string) => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const item = items.find(item => item.id === id);

    return item;
  },
  start: async (id: string, override?: string) => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const template = items.find(item => item.id === id);
    if (template === undefined) throw new Error(`Ref not found: ${id}`);
    const time =
      override === undefined
        ? moment()
            .utc()
            .toISOString()
        : moment(override, ["MM/DD/YYYY HH:mm", "MM/DD/YYYY"])
            .utc()
            .toISOString();

    if (template.start !== undefined) {
      await mgr.editLogEntry(id, item => ({ ...item, start: time }));
      return +id;
    } else {
      const item = { start: time, ...template };
      return mgr.add(item);
    }
  },
  end: async (id: string, override?: string) => {
    const mgr = new LogManager();
    const time =
      override === undefined
        ? moment()
            .utc()
            .toISOString()
        : moment(override, ["MM/DD/YYYY HH:mm", "MM/DD/YYYY"])
            .utc()
            .toISOString();
    return mgr.editLogEntry(id, item => ({ ...item, end: time }));
  },
  instance: async (id: string, data?: string) => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const template = items.find(item => item.id === id);
    if (template === undefined) throw new Error(`Ref not found: ${id}`);
    const time = moment()
      .utc()
      .toISOString();
    const item = { ...template, time, data };
    return mgr.add(item);
  },
  delete: (id: string) => {
    const mgr = new LogManager();
    return mgr.dropLogEntry(id);
  },
  setGist: (id: string) => {
    const mgr = new GistInfoManager();
    return mgr.save(id);
  },
  unfinished: async () => {
    const mgr = new LogManager();
    const items = await mgr.listLogEntries();
    const startsWithoutEnds = items.filter(
      ({ start, end }) => start !== undefined && end === undefined
    );
    return startsWithoutEnds;
  },
  view: async () => {
    const mgr = new LogManager();
    return await mgr.listLogEntries();
  }
};

export { Database };
