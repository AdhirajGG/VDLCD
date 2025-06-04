import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  await prisma.order.update({
    where: { id },
    data: { status: "FAILED" },
  });

  return NextResponse.json({ success: true });
}
