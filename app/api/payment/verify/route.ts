// app/api/payment/verify/route.ts

import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId, paymentId, signature } = await req.json();
  
  try {
    const generatedSignature = razorpay.utils.generateSignature(
      `${orderId}|${paymentId}`,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { razorpayOrderId: orderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: paymentId,
        razorpaySignature: signature
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PAYMENT_VERIFICATION_ERROR:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}