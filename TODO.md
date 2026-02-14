# TODO: Implement Buy Plan Flow

## Task: When a user clicks on Buy Plan:

- If not registered → redirect to registration page
- If registered but hasn't completed payment → redirect to Razorpay payment page
- If registering for the first time → automatically redirect to Razorpay payment page (already implemented in Register.tsx)
- After successful payment → show confirmation message "The admin will contact you soon." (already implemented in Payment.tsx)

## Implementation Steps:

- [x] 1. Modify Landing.tsx - Update "Buy Now" buttons to check auth status and redirect appropriately
- [ ] 2. Modify Login.tsx - Update to check if user has paid and redirect to payment if not

## Status:

- Landing.tsx - ✅ Updated (Buy Now buttons now check auth status)
- Register.tsx - ✅ Already implemented (redirects to /payment after registration)
- Payment.tsx - ✅ Already implemented (shows "The admin will contact you soon." after payment)
- Login.tsx - ⏳ Needs update
