import * as fal from "@fal-ai/serverless-client";
import { NextRequest, NextResponse } from "next/server";
import { stylePrompts, negativePrompt } from "./prompt-utils";
import { createClient } from "@supabase/supabase-js";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
    // Ensure fal library finds the key if user used NEXT_PUBLIC_ prefix
    if (!process.env.FAL_KEY && process.env.NEXT_PUBLIC_FAL_KEY) {
        process.env.FAL_KEY = process.env.NEXT_PUBLIC_FAL_KEY;
    }

    try {
        const { image, style, imageSize, roomType } = await req.json();

        if (!image || !style) {
            return NextResponse.json(
                { error: "Missing image or style" },
                { status: 400 }
            );
        }

        // Configure fal
        // Note: In server context, it uses FAL_KEY env var automatically or we can set it via config if needed, 
        // but usually process.env.FAL_KEY is sufficient for server-side calls if configured.
        // However, the fal client is often used client-side. For server-side proxying:

        // We will use the 'fal.subscribe' method which handles the queueing.

        // Configure fal
        console.time('Total_Execution');

        const roomLabel = roomType ? roomType.replace(/_/g, ' ') : 'room';
        const styleDescription = stylePrompts[style] || style;

        let tvPrompt = "";
        if (roomType === 'living_room') {
            tvPrompt = "IMPORTANT: If a media console or TV stand is visible, place a large modern flat-screen TV on it. Replace any painting or artwork above the unit with the TV.";
        }

        const prompt = `Strictly preserve exact room structure, perspective, and original dimensions. Do NOT change the camera angle or field of view.
    Virtual staging of a ${roomLabel} in ${style} style. ${styleDescription}
    High quality, photorealistic, interior design, 8k resolution.
    Keep all walls, windows, floors, and ceiling exactly as they are. Only replace movable furniture and decor to match ${style}.
    ${tvPrompt}`;

        console.log(`Generating with dimensions: ${imageSize ? `${imageSize.width}x${imageSize.height}` : 'default'}`);

        // --- Start Parallel Processes ---

        // 1. Prepare Supabase (if configured)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const generationId = v4();
        let uploadOriginalPromise: Promise<any> = Promise.resolve(null);
        let finalOriginalUrl: string | null = null;
        let supabase: any = null;

        if (supabaseUrl && supabaseKey) {
            supabase = createClient(supabaseUrl, supabaseKey);

            // Start uploading Original Image immediately (don't wait for AI)
            const base64Data = image.split(',')[1];
            const contentType = image.substring(image.indexOf(':') + 1, image.indexOf(';')) || 'image/png';
            const fileExt = contentType.split('/')[1] || 'png';
            const originalPath = `${generationId}/original.${fileExt}`;

            uploadOriginalPromise = (async () => {
                console.time('Upload_Original');
                const { error: uploadError1 } = await supabase.storage
                    .from('real-estate-generations')
                    .upload(originalPath, Buffer.from(base64Data, 'base64'), {
                        contentType: contentType,
                        upsert: false
                    });
                console.timeEnd('Upload_Original');

                if (uploadError1) {
                    console.error("Upload Original Error:", uploadError1);
                    return null;
                }

                const { data } = supabase.storage.from('real-estate-generations').getPublicUrl(originalPath);
                return data.publicUrl;
            })();
        }

        // 2. Start AI Generation
        console.time('AI_Generation');
        const falPromise = fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: prompt,
                image_urls: [image],
                output_format: "png",
                image_size: imageSize || "square_hd",
                negative_prompt: negativePrompt,
                num_images: 4,
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    // console.log(update.logs.map((log) => log.message).join('\n'));
                }
            },
        });

        // 3. Wait for BOTH to complete (Parallel Execution)
        // Note: effectively we just await both. If AI fails, we might have uploaded image unnecessarily, which is fine.
        const [result, originalUrlResult] = await Promise.all([falPromise, uploadOriginalPromise]);
        console.timeEnd('AI_Generation');
        finalOriginalUrl = originalUrlResult;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = result as any;

        if (data.images && data.images.length > 0) {
            // 4. Upload Generated Images (Must happen after AI finishes)
            if (supabase && finalOriginalUrl) {
                console.time('Upload_Generated_Batch');
                const generatedUrls: string[] = [];

                // We use map to fire all uploads in parallel
                await Promise.all(data.images.map(async (img: any, index: number) => {
                    const generatedImageUrl = img.url;

                    const genRes = await fetch(generatedImageUrl);
                    const genBlob = await genRes.arrayBuffer();
                    const genPath = `${generationId}/generated_${index + 1}.jpeg`;

                    const { error: uploadError2 } = await supabase.storage
                        .from('real-estate-generations')
                        .upload(genPath, genBlob, {
                            contentType: 'image/jpeg',
                            upsert: false
                        });

                    if (uploadError2) console.error(`Upload Generated Error (${index}):`, uploadError2);

                    const { data: publicUrlData2 } = supabase.storage.from('real-estate-generations').getPublicUrl(genPath);
                    generatedUrls.push(publicUrlData2.publicUrl);
                }));
                console.timeEnd('Upload_Generated_Batch');

                // 5. Insert Database Record
                console.time('DB_Insert');
                const { error: dbError } = await supabase
                    .from('real-estate-generations')
                    .insert({
                        id: generationId,
                        original_image: finalOriginalUrl,
                        generated_image: JSON.stringify(generatedUrls),
                        style: style,
                        prompt: prompt
                    });
                console.timeEnd('DB_Insert');

                if (dbError) console.error("Database Insert Error:", dbError);
            }
            console.timeEnd('Total_Execution');

            return NextResponse.json({
                generatedImages: data.images.map((img: any) => img.url)
            });
        } else {
            throw new Error("No images generated");
        }
    } catch (error) {
        console.error("Error generating image with fal.ai:", error);
        return NextResponse.json(
            { error: "Failed to generate image", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
