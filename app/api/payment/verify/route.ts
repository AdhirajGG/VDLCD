import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { 
            razorpayPaymentId, 
            razorpayOrderId, 
            razorpaySignature,
            orderId
        } = await req.json();

        // Verify payment signature
        const generatedSignature = (razorpay as any).utils.generateSignature(
            `${razorpayOrderId}|${razorpayPaymentId}`,
            process.env.RAZORPAY_KEY_SECRET!
        );

        if (generatedSignature !== razorpaySignature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "COMPLETED",
                razorpayPaymentId,
                razorpaySignature
            }
        });

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error("PAYMENT_VERIFICATION_ERROR:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}