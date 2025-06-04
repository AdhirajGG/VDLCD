// // app/categories/[categoryName]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // Update category name
// export async function PUT(req: NextRequest, { params }: { params: { categoryName: string } }) {
//   const { name } = await req.json();
//   const oldName = decodeURIComponent(params.categoryName);

//   if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

//   try {
//     const updated = await prisma.category.updateMany({
//       where: { name: oldName },
//       data: { name },
//     });
//     return NextResponse.json({ success: true, updated });
//   } catch (e) {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

// // Delete category and all machines in this category

// export async function DELETE(req: NextRequest, { params }: { params: { categoryName: string } }) {
//   const oldName = decodeURIComponent(params.categoryName);

//   try {
//     // Delete all machines in this category first
//     await prisma.machine.deleteMany({ 
//       where: { category: oldName } 
//     });
    
//     // Then delete the category
//     await prisma.category.deleteMany({ 
//       where: { name: oldName } 
//     });
    
//     return NextResponse.json({ success: true });
//   } catch (e) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }
// app/api/categories/[categoryName]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type ParamsPromise = Promise<{ categoryName: string }>;

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  // Because Next 15 wraps params in a Promise, you must `await` it:
  const { categoryName: encoded } = await params;
  const oldName = decodeURIComponent(encoded);

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  try {
    const updated = await prisma.category.updateMany({
      where: { name: oldName },
      data: { name },
    });
    return NextResponse.json({ success: true, updated });
  } catch (e) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  const { categoryName: encoded } = await params;
  const oldName = decodeURIComponent(encoded);

  try {
    // First delete all machines in this category
    await prisma.machine.deleteMany({
      where: { category: oldName },
    });
    // Then delete the category itself
    await prisma.category.deleteMany({
      where: { name: oldName },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
