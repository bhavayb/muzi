import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import youtubesearchapi from "youtube-search-api";

const yt_regex = new RegExp("^https:\/\/www\.youtube\.com\/watch\\?v=[\\w-]{11}");

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const data = createStreamSchema.parse(await req.json());
        const isYt = yt_regex.test(data.url);
        
        if (!isYt) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 411 });
        }

        // ✅ FIX: Extract video ID properly - remove "?" from parameter name
        const urlParams = new URL(data.url).searchParams;
        const extractedId = urlParams.get("v"); // Changed from "?v=" to "v"

        // Validate video ID before making API call
        if (!extractedId || extractedId.length !== 11) {
            return NextResponse.json({ error: "Invalid YouTube video ID" }, { status: 411 });
        }

        // Now safe to fetch video details
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log("YouTube Video title:", res.title);
        console.log("YouTube Video thumbnail:", res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a : {width: number}, b : {width: number}) => a.width < b.width ? -1 : 1);

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "YouTube",
                title: res.title ?? "Untitled Stream",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://imgs.search.brave.com/vryedy2GcFbB-YIPTMN6NkKSxdqGyMuUPM8ctnPsHwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MjE0L3RodW1iLTM1/MC0yMTQ3MTIud2Vi/cA"
            }
        });

        return NextResponse.json({ 
            message: "Stream created successfully", 
            id: stream.id 
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating stream:", error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json(
        { error: "creatorId is required" },
        { status: 400 }
      );
    }

    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId,
      },
    });

    return NextResponse.json({ streams }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


