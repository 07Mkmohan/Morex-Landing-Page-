import { Request, Response, Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../config/env";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
});

const pricing = {
  basic: {
    monthly: 999,
    quarterly: 2499,
    "6months": 4999,
    "1year": 8999,
  },
  pro: {
    monthly: 1999,
    quarterly: 5499,
    "6months": 9999,
    "1year": 17999,
  },
};

const createOrderSchema = z.object({
  planType: z.enum(["basic", "pro"]),
  period: z.enum(["monthly", "quarterly", "6months", "1year"]),
});

router.post(
  "/create-order",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { planType, period } = createOrderSchema.parse(req.body);

      const amount = pricing[planType][period];
      const amountInPaise = amount * 100;

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          planType,
          period,
          userId: req.user!.userId.toString(),
        },
      });

      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: config.razorpayKeyId,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error?.message || "Failed to create order",
      });
    }
  },
);

router.post(
  "/verify-payment",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        planType,
        period,
      } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ message: "Missing details" });
      }

      const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

      const expectedSignature = crypto
        .createHmac("sha256", config.razorpayKeySecret)
        .update(payload)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: "Invalid signature",
        });
      }

      // calculate renewal date
      const now = new Date();
      const renewalDate = new Date(now);

      if (period === "monthly") renewalDate.setMonth(now.getMonth() + 1);
      if (period === "quarterly") renewalDate.setMonth(now.getMonth() + 3);
      if (period === "6months") renewalDate.setMonth(now.getMonth() + 6);
      if (period === "1year") renewalDate.setFullYear(now.getFullYear() + 1);

      await db
        .update(users)
        .set({
          planType,
          subscriptionDuration: period,
          renewalDate,
          accountStatus: "pending_approval",
        })
        .where(eq(users.id, req.user!.userId));

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error?.message || "Failed to verify payment",
      });
    }
  },
);

export default router;
