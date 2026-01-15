import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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

export async function GET() {
    const session = await getServerSession(authOptions);
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const streams = await prismaClient.stream.findMany({
          where: {
            userId: user.id,
          },
          include: {
            _count: {
              select: { upvotes: true }
            },
            upvotes: {
              where: {
                userId: user.id
              }
            }
          }
        });
    
        return NextResponse.json({
            streams : streams.map(({_count, ...rest})=>({
                ...rest,
                upvotesCount: _count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false,
            }))
        });

}