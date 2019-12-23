#!/usr/bin/env node

const program = require("commander");
const switchCase = require("./switchCase");
const LogEntry = require("./LogEntry");
const LogManager = require("./managers/LogManager");
const { version } = require("../package.json");
const formatTable = require("./utils/format-table");

const makeEntryFor = category => subject => {
  const mgr = new LogManager();
  const entry = new LogEntry(category, new Date().toISOString(), subject);
  return mgr.addLogEntry(entry);
};

program
  .name("abstrakt")
  .version(version)
  .option("-w, --work <subject>", "add an entry for work code")
  .option("-c, --create <subject>", "add an entry for creative/personal code")
  .option("-l, --learn <subject>", "add an entry for learning")
  .option("-e, --end", "add an end entry")
  .option("-v, --view", "view all log entries")
  .option("-d, --delete <id>", "delete a log entry", parseInt)
  .parse(process.argv);

switchCase(
  {
    work: makeEntryFor("work"),
    create: makeEntryFor("create"),
    learn: makeEntryFor("learn"),
    view: async () => {
      const mgr = new LogManager();
      const items = await mgr.listLogEntries();
      const table = formatTable(items);
      console.log(table);
    },
    end: () => makeEntryFor("end")("end"),
    delete: id => {
      console.log(`Dropping log entry ${id}`);
      const mgr = new LogManager();
      return mgr.dropLogEntry(id);
    }
  },
  program,
  program.outputHelp.bind(program)
);
