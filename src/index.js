#!/usr/bin/env node

const program = require("commander");
const switchCase = require("./switchCase");
const LogEntry = require("./LogEntry");
const LogManager = require("./LogManager");

const makeEntryFor = category => subject => {
  const mgr = new LogManager();
  const entry = new LogEntry(category, new Date().toISOString(), subject);
  mgr.addLogEntry(entry);
};

program
  .name("abstrakt")
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
    view: () => {
      const mgr = new LogManager();
      mgr.listLogEntries().forEach(x => console.log(x));
    },
    end: () => makeEntryFor("end")("end"),
    delete: id => {
      console.log(`Dropping log entry ${id}`);
      const mgr = new LogManager();
      mgr.dropLogEntry(id);
    }
  },
  program,
  program.outputHelp.bind(program)
);
