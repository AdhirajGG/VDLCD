// app/api/orders/[id]/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Optional: use nodejs runtime if needed, but not required to fix this type error
// export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    await prisma.order.update({
      where: { id },
      data: { status: "FAILED" },
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
