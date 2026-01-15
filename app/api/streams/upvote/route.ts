import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { z } from "zod";
import GoogleProvider from "next-auth/providers/google";

const upvoteSchema = z.object({
    streamId: z.string(),
})

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-for-build",
};

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    const user = await prismaClient.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })

    if(!user){
        return new Response("Unauthorized", {status: 403});
    }

    try {
        const data = upvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data:{
                userId: user.id,
                streamId: data.streamId,   
            }
        })
        return new Response("Upvoted successfully", {status: 201});
    } catch (e) {
        console.error("Error processing upvote:", e);
        return new Response("Error processing upvote", {status: 500});
    }

    
}