import { Parser } from 'json2csv';

export const toCsv = <T extends Record<string, unknown>>(rows: T[]) => {
  const parser = new Parser();
  return parser.parse(rows);
};
