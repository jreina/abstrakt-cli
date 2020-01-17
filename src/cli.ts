#!/usr/bin/env node

import program from "commander";
import switchCase from "./utils/switchCase";
const { version } = require("../package.json");
import { abstrakt } from "./index";

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
    ref: async (data: string) => {
      const newId = await abstrakt.ref(data);
      console.log(`Created ref ${newId} -> ${data}`);
    },
    tag: (id: string, data: string) => {
      return abstrakt.tag(id, data);
    },
    filter: async (title: string) => {
      const items = await abstrakt.filter(title);
      console.log(items);
    },
    refs: async () => {
      const items = await abstrakt.refs();
      console.log(items);
    },
    find: async (id: string) => {
      const item = await abstrakt.find(id);
      console.log(item);
    },
    start: async (id: string, override?: string) => {
      const newId = await abstrakt.start(id, override);
      console.log(
        `Created start entry with ID ${newId}`,
        override ? `overriding with time ${override}` : ""
      );
    },
    end: async (id: string, override?: string) => {
      await abstrakt.end(id, override);
      console.log(`Ended entry ${id}`);
    },
    instance: async (id: string, data?: string) => {
      const newId = await abstrakt.instance(id, data);
      console.log(`Created instance record with ID ${newId}`);
    },
    delete: async (id: string) => {
      console.log(`Dropping log entry ${id}`);
      await abstrakt.delete(id);
    },
    setGist: id => {
      return abstrakt.setGist(id);
    },
    unfinished: async () => {
      const startsWithoutEnds = await abstrakt.unfinished();
      console.log(startsWithoutEnds);
    },
    view: async () => {
      const items = await abstrakt.view();
      console.log(items);
    }
  },
  program,
  program.outputHelp.bind(program)
);
