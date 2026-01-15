import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import youtubesearchapi from "youtube-search-api";

const yt_regex = new RegExp("^https:\\/\\/www\\.youtube\\.com\\/watch\\?v=[\\w-]{11}");

const addStreamSchema = z.object({
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        // Get user from session
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find user in database
        const user = await prismaClient.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Parse and validate request body
        const data = addStreamSchema.parse(await req.json());
        const isYt = yt_regex.test(data.url);
        
        if (!isYt) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        // Extract video ID
        const urlParams = new URL(data.url).searchParams;
        const extractedId = urlParams.get("v");

        // Validate video ID
        if (!extractedId || extractedId.length !== 11) {
            return NextResponse.json({ error: "Invalid YouTube video ID" }, { status: 400 });
        }

        // Fetch video details from YouTube
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log("YouTube Video title:", res.title);
        console.log("YouTube Video thumbnail:", res.thumbnail.thumbnails);
        
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);

        // Create stream in database
        const stream = await prismaClient.stream.create({
            data: {
                userId: user.id,
                url: data.url,
                extractedId,
                type: "YouTube",
                title: res.title ?? "Untitled Stream",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA"
            }
        });

        return NextResponse.json({ 
            message: "Stream added successfully", 
            id: stream.id,
            stream: stream
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating stream:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid request data",
                details: error.issues
            }, { status: 400 });
        }
        
        return NextResponse.json({ 
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
