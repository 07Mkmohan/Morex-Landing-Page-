// routes/admin.ts

import express from "express";
import prisma from "../prisma/client";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = express.Router();

router.get(
  "/registered-users",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          companyName: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
