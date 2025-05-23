import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.order.update({
    where: { id: params.id },
    data: { status: "FAILED" },
  });
  return NextResponse.json({ success: true });
}
