"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const userService_1 = require("../services/userService");
const auth_1 = require("../middleware/auth");
const csv_1 = require("../utils/csv");
const router = (0, express_1.Router)();
const userSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['admin', 'user']),
});
const updateSchema = userSchema.partial();
const sanitizeUser = (user) => {
    const { password, ...rest } = user;
    return rest;
};
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/', async (_req, res) => {
    const users = await (0, userService_1.listUsers)();
    return res.json({ users });
});
router.post('/', async (req, res) => {
    try {
        const body = userSchema.parse(req.body);
        const user = await (0, userService_1.createUser)(body);
        return res.status(201).json({ user: sanitizeUser(user) });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to create user';
        return res.status(400).json({ message });
    }
});
router.get('/export/csv', async (_req, res) => {
    const users = await (0, userService_1.listUsers)();
    const csv = (0, csv_1.toCsv)(users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    })));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"users.csv\"');
    return res.send(csv);
});
router.put('/:id', async (req, res) => {
    try {
        const body = updateSchema.parse(req.body);
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const user = await (0, userService_1.updateUser)(id, body);
        return res.json({ user: user ? sanitizeUser(user) : null });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to update user';
        return res.status(400).json({ message });
    }
});
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user id' });
    }
    await (0, userService_1.deleteUser)(id);
    return res.status(204).send();
});
exports.default = router;
