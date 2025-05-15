// app/api/orders/route.ts
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) return NextResponse.json([], { status: 200 });

  const orders = await prisma.Order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json(orders);
}