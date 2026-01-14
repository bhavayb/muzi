import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await req.json();
    const { streamId } = data;

    if (!streamId) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }

    // Get the current user
    const user = await prismaClient.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the stream to verify ownership
    const stream = await prismaClient.stream.findUnique({
      where: {
        id: streamId,
      },
    });

    if (!stream) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the stream
    if (stream.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only remove your own streams" },
        { status: 403 }
      );
    }

    // Delete the stream (this will cascade delete upvotes)
    await prismaClient.stream.delete({
      where: {
        id: streamId,
      },
    });

    return NextResponse.json(
      { message: "Stream removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing stream:", error);
    return NextResponse.json(
      { error: "Failed to remove stream" },
      { status: 500 }
    );
  }
}
