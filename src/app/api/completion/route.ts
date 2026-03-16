import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try{
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      prompt,
    });

    return Response.json({ text });
  }catch(error){
    console.log("Error generating text:", error);
    return Response.json({error: "Failed to generate text"}, {status:500});
  }
}