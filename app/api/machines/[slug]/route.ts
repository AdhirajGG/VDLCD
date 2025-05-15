// DEEPSEEK CODE
//  import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(
//   _: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const machine = await prisma.machine.findUnique({
//       where: { slug: params.slug }
//     });

//     if (!machine) {
//       return NextResponse.json(
//         { error: "Machine not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(machine);
//   } catch (error) {
//     console.error("[MACHINE_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch machine" },
//       { status: 500 }
//     );
//   }
// }

// app/api/machines/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const machine = await prisma.machine.findUnique({
      where: { slug: params.slug },
    })

    if (!machine) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(machine, { status: 200 })
  } catch (error) {
    console.error("[MACHINE_GET]", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}