
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            console.error("Missing OPENROUTER_API_KEY");
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://rinova.ai", // Site URL for rankings on openrouter.ai
                "X-Title": "Rinova AI", // Site title for rankings on openrouter.ai
            },
            body: JSON.stringify({
                "model": "qwen/qwen2.5-vl-72b-instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an interior design expert. Analyze the room in this image and classify it into exactly one of these categories: [living_room, bedroom, kitchen, dining_room, bathroom, office, studio, outdoor]. Return ONLY the category key. If uncertain, return 'unknown'."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Identify this room type."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", errorText);
            throw new Error(`OpenRouter API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const roomType = data.choices?.[0]?.message?.content?.trim().toLowerCase() || 'unknown';

        return NextResponse.json({ roomType });

    } catch (error) {
        console.error('Error detecting room type:', error);
        return NextResponse.json(
            { error: 'Failed to detect room type' },
            { status: 500 }
        );
    }
}
