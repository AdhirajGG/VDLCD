// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";




// for future use if above fails
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ items: [] });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { cart: true }
    });

    return NextResponse.json({ items: user?.cart?.items || [] });
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();
  
  // Update cart directly using nested update
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      cart: { create: { items } }
    },
    update: {
      cart: {
        upsert: {
          create: { items },
          update: { items }
        }
      }
    },
    include: { cart: true }
  });

  return NextResponse.json({ success: true, cart: user.cart });
}