"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables', parsed.error.format());
    throw new Error('Invalid environment variables');
}
const env = parsed.data;
exports.config = {
    port: Number(env.PORT) || 4000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
};
