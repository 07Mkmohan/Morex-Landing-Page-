import { api } from "../api/client";
import type { PlanType, SubscriptionDuration } from "../types";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface CreateOrderParams {
  planType: PlanType;
  period: SubscriptionDuration;
}

export const paymentService = {
  /**
   * Create a Razorpay order
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const { data } = await api.post("/payment/create-order", params);
    return data;
  },

  /**
   * Verify payment with Razorpay
   */
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<VerifyPaymentResponse> {
    const { data } = await api.post("/payment/verify-payment", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return data;
  },
};

// Pricing data aligned with backend
export const PRICING = {
  basic: {
    monthly: { amount: 999, label: "Monthly" },
    quarterly: { amount: 2499, label: "Quarterly" },
    "6months": { amount: 4999, label: "6 Months" },
    "1year": { amount: 8999, label: "1 Year" },
  },
  pro: {
    monthly: { amount: 1999, label: "Monthly" },
    quarterly: { amount: 5499, label: "Quarterly" },
    "6months": { amount: 9999, label: "6 Months" },
    "1year": { amount: 17999, label: "1 Year" },
  },
};

export type PlanPeriod = keyof typeof PRICING.basic;
