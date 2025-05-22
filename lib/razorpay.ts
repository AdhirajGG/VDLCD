// lib/razorpay.ts
import Razorpay from "razorpay";
declare global {
    interface Window {
        Razorpay: typeof Razorpay;
    }
}
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (amount: number) => {
  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
};