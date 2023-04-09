// app/api/route.ts
import { Configuration, OpenAIApi } from "openai";

// export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

export const config = {
  runtime: "edge",
};

//For Fetch

//  async function generateChatCompletion() {
//    try {
//      const response = await fetch(apiEndpoint, requestConfig);
//      console.log(response);
//      const reader = response?.body.getReader();
//      while (true) {
//        const { done, value } = await reader.read();
//        if (done) break;
//        const chunk = new TextDecoder().decode(value);
//        console.log(chunk);
//      }
//    } catch (error) {
//      console.error(error);
//    }
//  }

const apiEndpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

const requestBody = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "A long essay..",
    },
  ],
  stream: true,
  max_tokens: 100,
};

const requestConfig = {
  method: "POST",
  headers: headers,
  body: JSON.stringify(requestBody),
  responseType: "stream",
};

// Post Route
export async function POST() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  try {
    const response = await fetch(apiEndpoint, requestConfig);
    console.log(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/event-stream")) {
      //@ts-ignore
      const reader = response.body.getReader();
      const encoder = new TextEncoder();

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);
        console.log(buffer);
        const lines = buffer
          .split("\n")
          .filter((line: string) => line.trim() !== "");
        console.log(lines);
        for (const line of lines) {
          const message = line.replace(/^data: /, "");
          console.log(message);
          if (message === "[DONE]") {
            console.log("Stream completed");
            writer.close();
            return;
          }
          console.log(message);

          try {
            const parsed = JSON.parse(message);
            console.log(parsed.choices[0]);
            console.log(parsed.choices[0].delta);
            if (parsed.choices[0].delta && parsed.choices[0].delta.content) {
              await writer.write(
                encoder.encode(`${parsed.choices[0].delta.content}`)
              );
            }
          } catch (error) {
            console.error(
              "Could not JSON parse stream message",
              message,
              error
            );
          }
        }
      }
    } else {
      console.error("Unexpected content-type, expected text/event-stream");
    }
  } catch (error) {
    console.error("An error occurred during the API request", error);
    writer.write(encoder.encode("An error occurred during the API request"));
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
