import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
    
        const result = await streamText({
            model: groq("openai/gpt-oss-120b"),
            prompt,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log("Error generating text:", error);
        return new Response("Failed to generate text", { status: 500 });
    }
}