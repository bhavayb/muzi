import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-for-build",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { creatorId } = await params;

    // Get the current logged-in user (if any)
    let currentUser = null;
    if (session?.user?.email) {
      currentUser = await prismaClient.user.findFirst({
        where: {
          email: session.user.email,
        },
      });
    }

    // Fetch streams for the creator
    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId,
      },
      include: {
        _count: {
          select: { upvotes: true },
        },
        upvotes: currentUser ? {
          where: {
            userId: currentUser.id,
          },
        } : false,
      },
    });

    return NextResponse.json({
      streams: streams.map(({ _count, upvotes, ...rest }) => ({
        ...rest,
        upvotesCount: _count.upvotes,
        haveUpvoted: currentUser && upvotes ? (upvotes.length ? true : false) : false,
      })),
      isCreator: currentUser ? currentUser.id === creatorId : false,
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
