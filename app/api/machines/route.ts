import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const machines = await prisma.machine.findMany();
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    console.error("Fetch machines error:", error);
    return NextResponse.json({ error: "Failed to fetch machines" }, { status: 500 });
  }
}




export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const data = await req.json();
      
      // Convert specs array to object
      if (Array.isArray(data.specs)) {
        data.specs = Object.fromEntries(data.specs);
      }

      const machine = await prisma.machine.create({
        data: {
          slug: data.slug,
          model: data.model,
          price: data.price,
          image: data.image,
          description: data.description,
          category: data.category,
          specs: data.specs
        }
      });

      return NextResponse.json(machine, { status: 201 });
    } catch (error: any) {
      console.error("Add machine error:", error);
      return NextResponse.json({ 
        error: error.message || "Failed to add machine",
        details: error
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
}