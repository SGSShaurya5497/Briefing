import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/generations — fetch the current user's generation history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 100);
  const cursor = url.searchParams.get("cursor");

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    select: {
      id: true,
      originalRoomUrl: true,
      tileUrl: true,
      generatedImageUrl: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  });

  const nextCursor =
    generations.length === limit
      ? generations[generations.length - 1].id
      : null;

  return NextResponse.json({
    generations,
    nextCursor,
    total: generations.length,
  });
}
