"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
require("dotenv/config");
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for Drizzle migrations');
}
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
