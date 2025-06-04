// app/api/users/[userId]/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  // Extract userId from URL path
  const pathname = req.nextUrl.pathname;
  const userId = pathname.split('/')[4]; // Adjust index based on your path structure

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update activity" }, 
      { status: 500 }
    );
  }
}