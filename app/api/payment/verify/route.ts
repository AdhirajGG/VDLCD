import { NextRequest,NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";


// export async function POST(req: NextRequest) {
//   try {
//     const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
//       await req.json();

//     if (!razorpayOrderId ||
//         !razorpayPaymentId ||
//         !razorpaySignature ||
//         !orderId
//     ) {
//       return NextResponse.json(
//         { error: "Missing payment or orderId fields" },
//         { status: 400 }
//       );
//     }

//     // compute signature:
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
//     const digest = hmac
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     if (digest !== razorpaySignature) {
//       await prisma.order.update({
//         where: { id: orderId },
//         data: { status: "FAILED" },
//       });
//       return NextResponse.json(
//         { error: "Invalid signature" },
//         { status: 400 }
//       );
//     }

//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: "COMPLETED" },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[PAYMENT_VERIFY_ERROR]", err);
//     return NextResponse.json(
//       { error: "Verification failed" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    // 1) Make sure the user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Pull the webhook payload from Razorpay checkout
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    // 3) Basic validation
    if (
      !orderId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing one or more required fields" },
        { status: 400 }
      );
    }

    // 4) Verify the signature matches
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark as failed if signatures don't match
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "FAILED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });
      return NextResponse.json(
        { error: "Signature mismatch, payment not verified" },
        { status: 400 }
      );
    }

    // 5) All good—mark the order as completed and store the IDs
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PAYMENT_VERIFY_ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}