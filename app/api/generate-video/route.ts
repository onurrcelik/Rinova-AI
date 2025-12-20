import * as fal from "@fal-ai/serverless-client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createClient } from '@supabase/supabase-js';
import { v4 } from 'uuid';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure fal library finds the key
    if (!process.env.FAL_KEY && process.env.NEXT_PUBLIC_FAL_KEY) {
        process.env.FAL_KEY = process.env.NEXT_PUBLIC_FAL_KEY;
    }

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = (supabaseUrl && supabaseServiceKey)
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

    try {
        const { startImageUrl, endImageUrl } = await req.json();

        if (!startImageUrl || !endImageUrl) {
            return NextResponse.json(
                { error: "Both start and end image URLs are required" },
                { status: 400 }
            );
        }

        // Prompt for Kling 1.6 Elements - focus on smooth camera movement
        const prompt = `Smooth continuous camera movement through an interior room. Professional real estate walkthrough video. The camera glides slowly and smoothly from one viewpoint to another. Cinematic, steady dolly shot, elegant room tour. High quality, consistent lighting.`;

        // Negative prompt for quality
        const negativePrompt = `blur, distort, low quality, shaky camera, sudden movements, flickering, artifacts, glitches, jerky motion, cuts, transitions, morphing`;

        console.log("Generating video with Kling 1.6 Elements");
        console.log("Images:", [startImageUrl, endImageUrl]);
        console.time('Video_Generation');

        // Use Kling 1.6 Elements - takes multiple image URLs
        const result = await fal.subscribe("fal-ai/kling-video/v1.6/standard/elements", {
            input: {
                prompt: prompt,
                input_image_urls: [startImageUrl, endImageUrl],
                duration: "5",
                aspect_ratio: "16:9",
                negative_prompt: negativePrompt
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    console.log("Video generation in progress...");
                }
            },
        });

        console.timeEnd('Video_Generation');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = result as any;

        if (data.video && data.video.url) {
            const videoUrl = data.video.url;

            // Save to database
            if (supabase) {
                const recordId = v4();
                await supabase.from('real-estate-generations').insert({
                    id: recordId,
                    user: session.user.id,
                    original_image: startImageUrl,
                    generated_image: JSON.stringify({
                        type: 'video',
                        videoUrl: videoUrl,
                        sourceImages: [startImageUrl, endImageUrl]
                    }),
                    style: 'Video Tour',
                    room_type: 'video'
                });
                console.log("Video saved to database:", recordId);
            }

            return NextResponse.json({
                videoUrl: videoUrl,
                fileName: data.video.file_name || 'room-tour.mp4',
                fileSize: data.video.file_size
            });
        } else {
            throw new Error("No video generated");
        }

    } catch (error) {
        console.error("Error generating video:", error);
        return NextResponse.json(
            { error: "Failed to generate video", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

