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
            messages: [
                {
                    role: "system",
                    content: `You are a friendly and helpful assistant for Kacchi Dine Restaurant. Your job is to talk like a real human customer support agent—warm, polite, and easy to understand. Always respond in a natural, conversational tone, not robotic or overly formal. Keep your answers short but friendly, and make sure the user feels comfortable. Help customers with menu details, pricing, orders, and general questions. Whenever appropriate, guide them to place an order from https://www.kacchidine.com. You can use a little enthusiasm or light emojis occasionally, but don’t overdo it. Avoid generic or AI-like responses, and try to make every reply feel personal and human. If needed, ask simple follow-up questions to better assist the user.`
                },
                ...await convertToModelMessages(messages)
            ]
        })

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error streaming chat completion:", error);
        return new Response("Failed to stream chat completion", { status: 500 });
    }
}