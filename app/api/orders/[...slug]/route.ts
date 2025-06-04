// app/api/orders/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } } // Correct parameter typing
) {
  const [id, action] = params.slug;

  if (action !== "cancel") {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" }, // Changed to more appropriate status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ORDER_CANCEL_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to cancel order" }, 
      { status: 500 }
    );
  }
}