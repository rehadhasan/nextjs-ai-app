import { UIMessage, streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await request.json();

        const result = await streamText({
            model: groq("openai/gpt-oss-120b"),
            messages: await convertToModelMessages(messages),
        })

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error streaming chat completion:", error);
        return new Response("Failed to stream chat completion", { status: 500 });
    }
}