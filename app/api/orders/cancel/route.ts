// app/api/orders/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Try to update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ORDER_CANCEL_ERROR]", error);
    
    // Handle specific error cases
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Order not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to cancel order: " + error.message }, 
      { status: 500 }
    );
  }
}