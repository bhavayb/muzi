import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const downvoteSchema = z.object({
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
        const data = downvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId: user.id,
                    streamId: data.streamId,
                }
            }
        })
        return new Response("Downvoted successfully", {status: 200});
    } catch (e) {
        console.error("Error processing downvote:", e);
        return new Response("Error processing downvote", {status: 500});
    }
}
