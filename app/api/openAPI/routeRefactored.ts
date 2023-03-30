import { NextRequest, NextResponse } from "next/server";
import getCompletion from "@/app/openAI";
import { ChatCompletionRequestMessage } from "openai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teacher.`,
    },
    {
      role: "user",
      content: `I am a student in grade 6, give me an example of a ${body.prompt}.`,
    },
  ];
  const response = await getCompletion(messages);
  return NextResponse.json({ response });
}
