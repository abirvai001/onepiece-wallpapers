import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const wallpaper = await prisma.wallpaper.update({
    where: { id },
    data: {
      ...(body.isTrending !== undefined && { isTrending: body.isTrending }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.title && { title: body.title }),
    },
  });

  return NextResponse.json(wallpaper);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.wallpaper.delete({ where: { id } });

  return NextResponse.json({ success: true });
}