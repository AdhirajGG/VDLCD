// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";
import { useUser } from "@clerk/nextjs";

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


// for future use if above fails
// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const orders = await prisma.order.findMany({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(orders);
//   } catch (error) {
//     console.error("[ORDERS_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   }
// }