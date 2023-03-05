import { OpenAIApi, Configuration } from "openai";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  async function fetchCompletion() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello world" }],
    });
    return completion.data.choices[0].message;
  }

  const response = await fetchCompletion();

  return NextResponse.json({ response });
}
