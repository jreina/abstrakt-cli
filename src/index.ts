#!/usr/bin/env node

import program from "commander";
import switchCase from "./utils/switchCase";
import LogManager from "./managers/LogManager";
import GistInfoManager from "./managers/GistInfoManager";
const { version } = require("../package.json");
import moment from "moment";

program
  .name("abstrakt")
  .version(version)
  .option("-r, --ref <data>", "create a ref entry")
  .option("-t, --tag <id> <data>", "add tag to an entry")
  .option("-v, --view", "view all entries")
  .option("-f, --filter <title>", "filter entries by title")
  .option("-F, --find <id>", "find an entry by id")
  .option(
    "-s, --start <id> [time]",
    "create a start entry using a top-level ref ID, or supply a timestamp in local time to override the existing time"
  )
  .option(
    "-e, --end <id> [time]",
    "create a end entry using an instance ref ID, or supply a timestamp in local time to override the existing time"
  )
  .option("-i, --instance <id> [data]", "create an instance with optional data")
  .option("-d, --delete <id>", "delete an entry")
  .option("--set-gist <id>", "set the Gist ID to use on this computer")
  .option("--refs", "list refs")
  .option(
    "-u, --unfinished",
    "list start entries without a reference in an end entry"
  );

program.parse(process.argv);

switchCase(
  {
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

      console.log(ofT);
    },
    refs: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const ofT = items.filter(
        ({ start, end, time }) =>
          start === undefined && end === undefined && time === undefined
      );

      console.log(ofT);
    },
    find: async (id: string) => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const item = items.find(item => item.id === id);

      console.log(item);
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
      const item = { start: time, ...template };
      return mgr.add(item);
    },
    end: async (id: string, override?: string) => {
      const mgr = new LogManager();
      const time =
        override !== undefined
          ? moment
              .utc(override, ["MM/DD/YYYY HH:mm", "MM/DD/YYYY"])
              .toISOString()
          : moment()
              .utc()
              .toISOString();
      return mgr.editLogEntry(id, item => ({ ...item, end: time}));
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
      console.log(`Dropping log entry ${id}`);
      const mgr = new LogManager();
      return mgr.dropLogEntry(id);
    },
    setGist: id => {
      const mgr = new GistInfoManager();
      return mgr.save(id);
    },
    unfinished: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const startsWithoutEnds = items.filter(
        ({ start, end }) => start !== undefined && end === undefined
      );
      console.log(startsWithoutEnds);
    },
    view: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      console.log(items);
    }
  },
  program,
  program.outputHelp.bind(program)
);
