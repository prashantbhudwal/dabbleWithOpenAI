import { OpenAIApi, Configuration } from "openai";
import { NextResponse, NextRequest } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function GET(request: Request) {
  const openai = new OpenAIApi(configuration);

  async function fetchCompletion() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "Hey GPT, I have just built an API to chat with you. What do you think?",
        },
      ],
    });
    return completion.data.choices[0].message;
  }

  const response = await fetchCompletion();

  return NextResponse.json({ response });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompt = body.prompt;

  const openai = new OpenAIApi(configuration);
  async function fetchCompletion() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return completion.data.choices[0].message;
  }

  const response = await fetchCompletion();

  return NextResponse.json({ response });
}
