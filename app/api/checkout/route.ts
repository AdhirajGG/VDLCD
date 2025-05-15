// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil"
});

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    
    const lineItems = await Promise.all(items.map(async (item: any) => {
      const product = await prisma.machine.findUnique({
        where: { slug: item.slug }
      });

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product!.model,
          },
          unit_amount: Math.round(product!.price * 100),
        },
        quantity: item.quantity,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}