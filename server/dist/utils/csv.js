"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCsv = void 0;
const json2csv_1 = require("json2csv");
const toCsv = (rows) => {
    const parser = new json2csv_1.Parser();
    return parser.parse(rows);
};
exports.toCsv = toCsv;
