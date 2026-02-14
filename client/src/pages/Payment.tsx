import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  paymentService,
  PRICING,
  type PlanPeriod,
} from "../services/paymentService";
import type { PlanType, SubscriptionDuration } from "../types";
import "../App.css";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const { user, token } = useAuthContext();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  const [selectedPeriod, setSelectedPeriod] = useState<PlanPeriod>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!user || !token) return;

    setLoading(true);
    setError("");

    try {
      const order = await paymentService.createOrder({
        planType: selectedPlan,
        period: selectedPeriod as SubscriptionDuration,
      });

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "PaintOS",
        description: `${selectedPlan.toUpperCase()} - ${
          PRICING[selectedPlan][selectedPeriod].label
        }`,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "",
        },
        theme: { color: "#4F46E5" },
        handler: async (response: any) => {
          await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
          navigate("/");
        },
      });

      razorpay.open();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const plans: PlanType[] = ["basic", "pro"];
  const periods: PlanPeriod[] = ["monthly", "quarterly", "6months", "1year"];

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Choose Your Plan</h1>
          <p>Select a subscription plan</p>
        </div>

        <div className="payment-content">
          {/* LEFT SIDE */}
          <div className="plan-section">
            <div className="plan-types">
              {plans.map((plan) => (
                <button
                  key={plan}
                  className={`plan-btn ${
                    selectedPlan === plan ? "active" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="period-options">
              {periods.map((period) => {
                const pricing = PRICING[selectedPlan][period];

                return (
                  <button
                    key={period}
                    className={`period-btn ${
                      selectedPeriod === period ? "active" : ""
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <span>{pricing.label}</span>
                    <strong>₹{pricing.amount}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="payment-summary">
            <div className="summary-row">
              <span>Plan</span>
              <span>{selectedPlan.toUpperCase()}</span>
            </div>

            <div className="summary-row">
              <span>Duration : </span>
              <span>{PRICING[selectedPlan][selectedPeriod].label}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{PRICING[selectedPlan][selectedPeriod].amount}</span>
            </div>

            {error && <div className="payment-error">{error}</div>}

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${PRICING[selectedPlan][selectedPeriod].amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
