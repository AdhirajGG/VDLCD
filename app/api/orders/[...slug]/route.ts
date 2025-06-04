// app/api/orders/[...slug]/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: { slug: string[] } }
) {
  const [id, action] = context.params.slug;

  if (action !== "cancel") {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ORDER_CANCEL_ERROR]", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
