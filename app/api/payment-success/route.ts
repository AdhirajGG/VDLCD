// app/api/payment-success/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId, paymentId, razorpayOrderId } = await req.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId:paymentId,
        razorpayOrderId: razorpayOrderId
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}