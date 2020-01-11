import * as _ from "lodash";

const max = (a: number, b: number) => (a > b ? a : b);
const asString = (x: any) => x.toString();

function padStart(input: string, num: number, char: string) {
  if (input.length >= num) return input;
  let output = input;
  for (let i = 0; i < num - input.length; i++) output = char + output;
  return output;
}

function padEnd(input: string, num: number, char: string) {
  if (input.length >= num) return input;
  let output = input;
  for (let i = 0; i < num - input.length; i++) output += char;
  return output;
}

function formatRow(
  columnLengths: { [key: string]: number },
  item: Array<string>,
  joinChar = " ",
  seperatorChar = "|"
) {
  return Object.entries(item)
    .map(([key, value]) =>
      padStart(
        padEnd(asString(value), columnLengths[key] + 1, joinChar),
        columnLengths[key] + 2,
        joinChar
      )
    )
    .join(seperatorChar);
}

/**
 * Someone fix this please
 * @param items
 */
export default function formatTable(items: Array<string>) {
  const entries = items
    .map(item => item.split("::"))
    .map(([id, dt, t = "", m1 = "", m2 = ""]) => [id, dt, t, m1, m2]);

  const cols = _.zip(...entries);
  const columns = ["id", "dt", "t", "m1", "m2"];
  const columnLengths = cols.map((col, i) => {
    const len = col.concat(columns[i]).map(c => c?.toString().length ?? 0).reduce(max, 0);
    return [i, len];
  });

  const columnLengthLookup = Object.fromEntries(columnLengths);

  const rows = items
    .map(item => item.split("::"))
    .map(([id, dt, t = "", m1 = "", m2 = ""]) => [id, dt, t, m1, m2])
    .map(item => formatRow(columnLengthLookup, item));
  const separatorItem = columns.map(_ => "");

  const table = [
    formatRow(columnLengthLookup, columns),
    formatRow(columnLengthLookup, separatorItem, "-", "+"),
    ...rows
  ].join("\n");
  return table;
}
