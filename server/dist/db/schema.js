"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['admin', 'user']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    name: (0, pg_core_1.text)('name').notNull(),
    password: (0, pg_core_1.text)('password').notNull(),
    mobile: (0, pg_core_1.text)('mobile'),
    companyName: (0, pg_core_1.text)('company_name'),
    companyAddress: (0, pg_core_1.text)('company_address'),
    role: (0, exports.roleEnum)('role').notNull().default('user'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
