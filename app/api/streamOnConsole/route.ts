// app/api/route.ts
import { Configuration, OpenAIApi } from "openai";

export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

export async function GET() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  writer.write(encoder.encode("streaming")); // Send "streaming" message to the client

  try {
    const openaiRes = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
          {
            role: "user",
            content:
              "Hey GPT, I have just built an API to chat with you. What do you think?",
          },
        ],
      },
      { responseType: "stream" }
    );

    // @ts-ignore
    openaiRes.data.on("data", async (data: Buffer) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line: string) => line.trim() !== "");
      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          console.log("Stream completed");
          writer.close();
          return;
        }
        console.log(message); // Log the received message as it is
      }
    });
  } catch (error) {
    console.error("An error occurred during OpenAI request", error);
    writer.write(encoder.encode("An error occurred during OpenAI request"));
    writer.close();
  }

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
