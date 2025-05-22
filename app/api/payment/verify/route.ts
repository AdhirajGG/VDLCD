import { NextRequest,NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import crypto from "crypto";

// export async function POST(req: NextRequest) {
//     try {


//         const { userId } = await getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//         const { 
//             razorpayPaymentId, 
//             razorpayOrderId, 
//             razorpaySignature,
//             orderId
//         } = await req.json();

//         // Verify payment signature
//         const generatedSignature = (razorpay as any).utils.generateSignature(
//             `${razorpayOrderId}|${razorpayPaymentId}`,
//             process.env.RAZORPAY_KEY_SECRET!
//         );

//         if (generatedSignature !== razorpaySignature) {
//             return NextResponse.json(
//                 { error: "Invalid payment signature" },
//                 { status: 400 }
//             );
//         }

//         // Update order status
//         const updatedOrder = await prisma.order.update({
//             where: { id: orderId },
//             data: {
//                 status: "COMPLETED",
//                 razorpayPaymentId,
//                 razorpaySignature
//             }
//         });

//         return NextResponse.json(updatedOrder);

//     } catch (error) {
//         console.error("PAYMENT_VERIFICATION_ERROR:", error);
//         return NextResponse.json(
//             { error: "Payment verification failed" },
//             { status: 500 }
//         );
//     }
// }

// above code is working but giving failure in payment after marking as success
// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       orderId,
//     } = await req.json();

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
//       return NextResponse.json({ error: "Missing orderId or payment fields" }, { status: 400 });
//     }

//     // verify signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
//     const generated = hmac
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generated !== razorpay_signature) {
//       // mark the order as failed
//       await prisma.order.update({
//         where: { id: orderId },
//         data: { status: "FAILED" },
//       });
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     // mark as completed
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: "COMPLETED" },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[PAYMENT_VERIFY_ERROR]", err);
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await req.json();

    if (!razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature ||
        !orderId
    ) {
      return NextResponse.json(
        { error: "Missing payment or orderId fields" },
        { status: 400 }
      );
    }

    // compute signature:
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    const digest = hmac
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (digest !== razorpaySignature) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PAYMENT_VERIFY_ERROR]", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}