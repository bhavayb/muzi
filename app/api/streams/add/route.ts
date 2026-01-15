import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";

const yt_regex = new RegExp("^https:\\/\\/www\\.youtube\\.com\\/watch\\?v=[\\w-]{11}");

const addStreamSchema = z.object({
    url: z.string()
});

async function getYouTubeVideoDetails(videoId: string) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
        throw new Error("YouTube API key not configured");
    }

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`,
        { 
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                'Accept': 'application/json',
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("YouTube API Error:", errorText);
        throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
        throw new Error("Video not found");
    }

    const video = data.items[0];
    return {
        title: video.snippet.title,
        thumbnails: video.snippet.thumbnails
    };
}

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
        const videoDetails = await getYouTubeVideoDetails(extractedId);
        
        console.log("YouTube Video title:", videoDetails.title);
        console.log("YouTube Video thumbnails:", videoDetails.thumbnails);

        // Get thumbnails (YouTube provides: default, medium, high, standard, maxres)
        const smallImg = videoDetails.thumbnails.medium?.url || 
                        videoDetails.thumbnails.default?.url ||
                        "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA";
        
        const bigImg = videoDetails.thumbnails.maxres?.url || 
                      videoDetails.thumbnails.high?.url ||
                      videoDetails.thumbnails.standard?.url ||
                      "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA";

        // Create stream in database
        const stream = await prismaClient.stream.create({
            data: {
                userId: user.id,
                url: data.url,
                extractedId,
                type: "YouTube",
                title: videoDetails.title ?? "Untitled Stream",
                smallImg,
                bigImg
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