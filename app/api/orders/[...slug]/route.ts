// app/api/orders/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    // Ensure we have at least 2 parameters (id and action)
    if (params.slug.length < 2) {
      return NextResponse.json(
        { error: "Invalid URL structure" },
        { status: 400 }
      );
    }

    const id = params.slug[0];
    const action = params.slug[1];

    if (action !== "cancel") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
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