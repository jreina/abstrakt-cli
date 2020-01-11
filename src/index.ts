#!/usr/bin/env node

import program from "commander";
import switchCase from "./utils/switchCase";
import LogManager from "./managers/LogManager";
import GistInfoManager from "./managers/GistInfoManager";
const { version } = require("../package.json");
import formatTable from "./utils/format-table";
import { compile } from "esotrakt-compiler";

program
  .name("esotrakt")
  .version(version)
  .option("-a, --append <data>", "append an entry")
  .option("-e, --edit <id> <data>", "Edit an entry")
  .option("-v, --view", "view all entries")
  .option("-f, --filter <t>", "filter entries by t")
  .option("-s, --set-gist <id>", "set the Gist ID to use on this computer")
  .option("-d, --delete <id>", "delete an entry")
  .option("-j, --json", "parse and print entries in JSON format")
  .option(
    "-u, --unfinished",
    "list start entries without a reference in an end entry"
  )
  .option("-d, --delete <id>", "delete an entry");

program.parse(process.argv);

switchCase(
  {
    append: (data: string) => {
      const mgr = new LogManager();
      return mgr.addLogEntry(data);
    },
    edit: (id: string, data: string) => {
      const mgr = new LogManager();
      return mgr.editLogEntry(id, data);
    },
    delete: (id: string) => {
      console.log(`Dropping log entry ${id}`);
      const mgr = new LogManager();
      return mgr.dropLogEntry(id);
    },
    filter: async (t: string) => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const ofT = items.filter(item => item.split("::")[2] === t);
      const table = formatTable(ofT);
      console.log(table);
    },
    json: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const objects = compile(items.join('\n'));
      console.log(JSON.stringify(objects));
    },
    setGist: id => {
      const mgr = new GistInfoManager();
      return mgr.save(id);
    },
    unfinished: async () => {
      const mgr = new LogManager();
      const items = (await mgr.listLogEntries()).map(item => item.split("::"));
      const starts = items.filter(([, , t]) => ["S", "_"].includes(t));
      const ends = items.filter(([, , t]) => ["E", "."].includes(t));
      const startsWithoutEnds = starts
        .filter(([id]) => ends.find(([, , , m1]) => id === m1) === undefined)
        .map(x => x.join("::"));
      const table = formatTable(startsWithoutEnds);
      console.log(table);
    },
    view: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const table = formatTable(items);
      console.log(table);
    }
  },
  program,
  program.outputHelp.bind(program)
);
