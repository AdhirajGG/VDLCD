// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
// import type { RazorpayOrder } from "razorpay/dist/types/orders";
// import Node’s crypto module
import { createHmac } from "node:crypto";

// Update the Razorpay initialization
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in your DB
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    // Ensure items is always an array
    const safeOrders = orders.map(order => ({
      ...order,
      items: Array.isArray(order.items)
        ? order.items
        : typeof order.items === "string"
          ? JSON.parse(order.items)
          : []
    }));

    return NextResponse.json(safeOrders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}





// export async function POST(req: NextRequest) {
//   try {
//     // 1) Authenticate
//     const { userId: clerkId } = await auth();
//     if (!clerkId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2) Ensure we have an internal User to point at
//     const user = await prisma.user.upsert({
//       where:  { clerkId },
//       create: { clerkId },
//       update: {},
//     });

//     // 3) Parse & validate payload
//     const { items, total } = await req.json();
//     if (!Array.isArray(items) || items.length === 0) {
//       return NextResponse.json({ error: "Empty cart" }, { status: 400 });
//     }

//     // 4) Create the Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount:   Math.round(total * 100), // paise
//       currency: "INR",
//       receipt:  `receipt_${Date.now()}`,
//     });

//     // 5) Persist in your DB
//     const order = await prisma.order.create({
//       data: {
//         total,
//         userId:           user.id,
//         items:            JSON.stringify(items),
//         razorpayOrderId:  razorpayOrder.id,
//         status:           "PENDING",
//         paymentMethod:    "Razorpay",
//       },
//     });

//     // 6) Return the basic Razorpay payload to your client
//     return NextResponse.json({
//       id:               order.id,
//       razorpayOrderId:  razorpayOrder.id,
//       amount:           razorpayOrder.amount,
//     });
//   } catch (err: any) {
//     console.error("[ORDER_CREATION_ERROR]", err);
//     return NextResponse.json(
//       { error: err.message || "Failed to create order" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    // 1) create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 2) store in your database
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        total,
        userId: user.id,
        items: JSON.stringify(items),
        razorpayOrderId: razorpayOrder.id,
        status: "PENDING",
        paymentMethod: "Razorpay",
      },
    });

    return NextResponse.json({
      id: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("[ORDER_CREATION_ERROR]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}