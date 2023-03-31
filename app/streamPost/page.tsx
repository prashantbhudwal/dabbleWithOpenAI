"use client";
import useSWR from "swr";

type PromptBody = {
  prompt: string;
};

const fetcher = async (url: string, body: PromptBody): Promise<string[]> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data");
  }
  // @ts-ignore
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(decoder.decode(value));
  }

  return chunks;
};

export default function ChatComponent() {
  const body: PromptBody = {
    prompt: "Can you write a short piece on JayZ",
  };

  const { data: messages, error } = useSWR<string[], Error>(
    ["/api/streamPost", body],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat Messages</h1>
      {messages.map((message, index) => (
        <span key={index}>{message}</span>
      ))}
    </div>
  );
}
