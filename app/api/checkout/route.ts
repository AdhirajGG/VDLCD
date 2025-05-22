// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    
    const lineItems = await Promise.all(items.map(async (item: any) => {
      const product = await prisma.machine.findUnique({
        where: { slug: item.slug }
      });

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product!.model,
          },
          unit_amount: Math.round(Number(product!.price) * 100),
        },
        quantity: item.quantity,
      };
    }));

  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}