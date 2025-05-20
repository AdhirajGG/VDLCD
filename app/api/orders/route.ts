//
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function GET() {
//   const { userId } = await auth();
  
//   if (!userId) {
//     return NextResponse.json([], { status: 200 });
//   }

//   try {
//     const orders = await prisma.order.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' }
//     });
    
//     return NextResponse.json(orders);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   }
// }

// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in your database using Clerk's userId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        createdAt: true,
        items: true,
        paymentMethod: true
      }
    });

    return NextResponse.json(orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      // Ensure items are properly parsed
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items
    })));
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}