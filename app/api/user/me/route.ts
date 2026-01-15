import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
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
    
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: session.user.email
        }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        userId: user.id,
        email: user.email 
    });
}
