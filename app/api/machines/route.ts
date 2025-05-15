// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const machines = await prisma.machine.findMany();
//     return NextResponse.json(machines, { status: 200 });
//   } catch (error) {
//     console.error("Fetch machines error:", error);
//     return NextResponse.json({ error: "Failed to fetch machines" }, { status: 500 });
//   }
// }




// export default async function handler(req: NextRequest) {
//   if (req.method === "POST") {
//     try {
//       const data = await req.json();
      
//       // Convert specs array to object
//       if (Array.isArray(data.specs)) {
//         data.specs = Object.fromEntries(data.specs);
//       }

//       const machine = await prisma.machine.create({
//         data: {
//           slug: data.slug,
//           model: data.model,
//           price: data.price,
//           image: data.image,
//           description: data.description,
//           category: data.category,
//           specs: data.specs
//         }
//       });

//       return NextResponse.json(machine, { status: 201 });
//     } catch (error: any) {
//       console.error("Add machine error:", error);
//       return NextResponse.json({ 
//         error: error.message || "Failed to add machine",
//         details: error
//       }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
// }

//above code was for the GET request to add a machine its was working POST was not working

//Below deepseek code is for the GET and POST request to add a machine
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // GET all machines
// export async function GET() {
//   try {
//     const machines = await prisma.machine.findMany();
//     return NextResponse.json(machines);
//   } catch (error) {
//     console.error("[MACHINES_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch machines" },
//       { status: 500 }
//     );
//   }
// }

// // POST new machine
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     // Validate required fields
//     if (!data.slug || !data.model || !data.price) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Convert specs array to object if needed
//     const specs = Array.isArray(data.specs)
//       ? Object.fromEntries(data.specs)
//       : data.specs;

//     const machine = await prisma.machine.create({
//       data: {
//         ...data,
//         specs
//       }
//     });

//     return NextResponse.json(machine, { status: 201 });
//   } catch (error) {
//     console.error("[MACHINES_POST]", error);
//     return NextResponse.json(
//       { error: "Failed to create machine" },
//       { status: 500 }
//     );
//   }
// }

// app/api/machines/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all machines (proper method handling)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Add validation
    if (category && typeof category !== "string") {
      return NextResponse.json(
        { error: "Invalid category parameter" },
        { status: 400 }
      );
    }

    const machines = await prisma.machine.findMany({
      where: category ? { 
        category: {
          equals: category.trim(), // Trim whitespace
          mode: 'insensitive'
        }
      } : undefined
    });

    console.log(`Fetched ${machines.length} machines for category: ${category}`); // Debug log
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    console.error("[MACHINES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch machines" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Enhanced validation
    const requiredFields = ["slug", "model", "price", "image", "description", "category", "specs"];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Convert specs safely
    let specsObject = {};
    if (Array.isArray(data.specs)) {
      try {
        specsObject = Object.fromEntries(
          data.specs.filter(([key, value]: [string, unknown]) => key && value) // Filter out empty entries
        );
      } catch (error) {
        console.error("Specs conversion error:", error);
        return NextResponse.json(
          { error: "Invalid specs format" },
          { status: 400 }
        );
      }
    } else {
      specsObject = data.specs;
    }

    // Check for existing slug
    const existingMachine = await prisma.machine.findUnique({
      where: { slug: data.slug },
    });

    if (existingMachine) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    // Create new machine with proper typing
    const newMachine = await prisma.machine.create({
      data: {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        model: data.model,
        price: data.price,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: specsObject,
      },
    });

    return NextResponse.json(newMachine, { status: 201 });
  } catch (error: any) {
    console.error("Full error details:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}