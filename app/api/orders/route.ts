// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
// import type { RazorpayOrder } from "razorpay/dist/types/orders";

// Update the Razorpay initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
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
//     try {
//         const { userId } = getAuth(req);
//         if (!userId) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const { items, total } = await req.json();
        
//         const razorpay = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID as string,
//             key_secret: process.env.RAZORPAY_KEY_SECRET as string,
//         }) as Razorpay & { orders: any };

//         const razorpayOrder = await razorpay.orders.create({
//             amount: total * 100,
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         });

//         // Create database order
//         const order = await prisma.order.create({
//             data: {
//                 total,
//                 userId,
//                 items: JSON.stringify(items),
//                 razorpayOrderId: razorpayOrder.id,
//                 status: "PENDING",
//                 paymentMethod: "Razorpay"
//             }
//         });

//         return NextResponse.json({
//             id: order.id,
//             razorpayOrderId: razorpayOrder.id,
//             amount: razorpayOrder.amount
//         });

//     } catch (error) {
//         console.error("[ORDER_CREATION_ERROR]", error);
//         return NextResponse.json(
//             { error: "Failed to create order" },
//             { status: 500 }
//         );
//     }
// }


// above post method is for creating an order is working


// export async function POST(req: NextRequest) {
//     try {
//         const { userId } = getAuth(req);
//         if (!userId) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

        // const user = await prisma.user.upsert({
        //     where: { clerkId: userId },
        //     create: { clerkId: userId },
        //     update: {}
        // });

//         const { items, total } = await req.json();
        
        // const orderItems = items.map((item: any) => ({
        //     slug: item.slug,
        //     model: item.model,
        //     price: Number(item.price),
        //     quantity: item.quantity,
        //     image: item.image
        // }));

        // const razorpayOrder = await razorpay.orders.create({
        //     amount: Math.round(total * 100),
        //     currency: "INR",
        //     receipt: `receipt_${Date.now()}`,
        // });

        // // Fix: Stringify the order items
        // const order = await prisma.order.create({
        //     data: {
        //         total: Number(total.toFixed(2)),
        //         userId: user.id,
        //         items: JSON.stringify(orderItems), // Stringify here
        //         razorpayOrderId: razorpayOrder.id,
        //         status: "PENDING",
        //         paymentMethod: "Razorpay"
        //     }
        // });

        // return NextResponse.json({
        //     id: order.id,
        //     razorpayOrderId: razorpayOrder.id,
        //     amount: razorpayOrder.amount
        // });

//     } catch (error) {
//         console.error("[ORDER_CREATION_ERROR]", error);
//         return NextResponse.json(
//             { error: "Failed to create order" },
//             { status: 500 }
//         );
//     }
// }

// Ensure proper error handling
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, total } = await req.json();
    
    // Add validation
    if (!items || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

       const orderItems = items.map((item: any) => ({
            slug: item.slug,
            model: item.model,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image
        }));

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
const user = await prisma.user.upsert({
            where: { clerkId: userId },
            create: { clerkId: userId },
            update: {}
        });
        // Fix: Stringify the order items
        const order = await prisma.order.create({
            data: {
                total: Number(total.toFixed(2)),
                userId: user.id,
                items: JSON.stringify(orderItems), // Stringify here
                razorpayOrderId: razorpayOrder.id,
                status: "PENDING",
                paymentMethod: "Razorpay"
            }
        });

        return NextResponse.json({
            id: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount
        })
  } catch (error) {
    console.error("[ORDER_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
