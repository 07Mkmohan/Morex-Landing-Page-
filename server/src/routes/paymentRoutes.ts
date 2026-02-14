import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../config/env";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
});

// Pricing defined BEFORE usage
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

// Create Razorpay order
router.post(
  "/create-order",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = createOrderSchema.parse(req.body);
      const { planType, period } = body;

      const amount = pricing[planType][period];

      // Convert to paise
      const amountInPaise = amount * 100;

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          planType,
          period,
          userId: req.user?.userId?.toString() || "",
        },
      });

      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: config.razorpayKeyId,
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      return res.status(400).json({
        message: error?.message || "Failed to create order",
      });
    }
  },
);

// Verify payment
router.post(
  "/verify-payment",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res
          .status(400)
          .json({ message: "Missing payment verification details" });
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

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      return res.status(400).json({
        message: error?.message || "Failed to verify payment",
      });
    }
  },
);

export default router;
