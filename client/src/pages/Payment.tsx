import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  paymentService,
  PRICING,
  type PlanPeriod,
} from "../services/paymentService";
import type { PlanType, SubscriptionDuration } from "../types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const { user, token } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  const [selectedPeriod, setSelectedPeriod] = useState<PlanPeriod>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Get plan from URL params if provided
  const planParam = searchParams.get("plan") as PlanType | null;
  const periodParam = searchParams.get("period") as PlanPeriod | null;

  useEffect(() => {
    if (planParam && (planParam === "basic" || planParam === "pro")) {
      setSelectedPlan(planParam);
    }
    if (periodParam && PRICING.basic[periodParam as PlanPeriod]) {
      setSelectedPeriod(periodParam as PlanPeriod);
    }
  }, [planParam, periodParam]);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () =>
        setError("Failed to load payment gateway. Please refresh the page.");
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handlePayment = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create order on backend
      const order = await paymentService.createOrder({
        planType: selectedPlan,
        period: selectedPeriod as SubscriptionDuration,
      });

      // Step 2: Open Razorpay checkout
      const razorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "PaintOS",
        description: `${selectedPlan.toUpperCase()} Plan - ${PRICING[selectedPlan][selectedPeriod].label}`,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "",
        },
        theme: {
          color: "#4F46E5",
        },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            const result = await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );

            if (result.success) {
              setSuccess(true);
            } else {
              setError(result.message || "Payment verification failed");
            }
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled. Please try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initiate payment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="payment-success">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p className="success-message">
            Thank you for subscribing to the {selectedPlan.toUpperCase()} plan.
          </p>
          <p className="admin-contact">The admin will contact you soon.</p>
          <button className="btn primary" onClick={() => navigate("/admin")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const plans: PlanType[] = ["basic", "pro"];
  const periods: PlanPeriod[] = ["monthly", "quarterly", "6months", "1year"];

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Choose Your Plan</h1>
          <p>Select a plan that best fits your factory's needs</p>
        </div>

        {/* Plan Type Selection */}
        <div className="plan-selection">
          <h3>Select Plan</h3>
          <div className="plan-types">
            {plans.map((plan) => (
              <button
                key={plan}
                className={`plan-type-btn ${selectedPlan === plan ? "active" : ""} ${plan}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan === "basic" ? "Basic" : "Pro"}
              </button>
            ))}
          </div>
        </div>

        {/* Period Selection */}
        <div className="period-selection">
          <h3>Select Duration</h3>
          <div className="period-options">
            {periods.map((period) => {
              const pricing = PRICING[selectedPlan][period];
              return (
                <button
                  key={period}
                  className={`period-btn ${selectedPeriod === period ? "active" : ""}`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  <span className="period-label">{pricing.label}</span>
                  <span className="period-price">₹{pricing.amount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="payment-summary">
          <div className="summary-row">
            <span>Plan</span>
            <span>{selectedPlan === "basic" ? "Basic" : "Pro"}</span>
          </div>
          <div className="summary-row">
            <span>Duration</span>
            <span>{PRICING[selectedPlan][selectedPeriod].label}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{PRICING[selectedPlan][selectedPeriod].amount}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="payment-error">{error}</div>}

        {/* Pay Button */}
        <button
          className="btn primary pay-btn"
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded}
        >
          {loading
            ? "Processing..."
            : razorpayLoaded
              ? `Pay ₹${PRICING[selectedPlan][selectedPeriod].amount}`
              : "Loading Payment..."}
        </button>

        <p className="payment-note">Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
};

export default Payment;
