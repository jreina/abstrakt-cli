const moment = require('moment');

const prop = key => obj => obj[key];
const max = (a, b) => (a > b ? a : b);
const len = x => x.length;
const toString = x => x.toString();

function padStart(input, num, char) {
  if (input.length >= num) return input;
  let output = input;
  for (let i = 0; i < num - input.length; i++) output = char + output;
  return output;
}

function padEnd(input, num, char) {
  if (input.length >= num) return input;
  let output = input;
  for (let i = 0; i < num - input.length; i++) output += char;
  return output;
}

function formatRow(columnLengths, item, joinChar = " ", seperatorChar = "|") {
  return Object.entries(item)
    .map(([key, value]) =>
      padStart(
        padEnd(toString(value), columnLengths[key], joinChar),
        columnLengths[key] + 1,
        joinChar
      )
    )
    .join(seperatorChar);
}

function formatTime(obj) {
    obj.time = moment(obj.time).format('MM/DD/YYYY HH:mm:ss');
    return obj;
}

module.exports = function formatTable(items) {
    items = items.map(formatTime);
  const columns = Object.keys(items[0]);
  const columnLengths = columns.reduce((memo, val) => {
    memo[val] =
      items
        .map(prop(val))
        .concat(val)
        .map(toString)
        .map(len)
        .reduce(max) + 1;
    return memo;
  }, {});

  const rows = items.map(item => formatRow(columnLengths, item));
  const columnItem = Object.fromEntries(columns.map(x => [x, x]));
  const separatorItem = Object.fromEntries(columns.map(x => [x, ""]));

  const table = [
    formatRow(columnLengths, columnItem),
    formatRow(columnLengths, separatorItem, "-", "+"),
    ...rows
  ].join("\n");
  return table;
};
