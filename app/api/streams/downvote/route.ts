import { prismaClient } from "@/app/lib/db";
import { request } from "https";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST(req: NextRequest){
    const session = await getServerSession();

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
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId: user.id,
                    streamId: data.streamId,
                }
            }
        })
    } catch (error) {
        return new Response("Error processing downvote", {status: 500});
    }
}

export async function GET(req: NextRequest){
    const creatorId =  req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where:{
            userId: creatorId ?? "",
        }
    });
    return NextResponse.json(streams);
}