"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [fetchNow, setFetchNow] = useState(false);

  const fetcher = function () {
   const body = {
     prompt: "Can you write an essay on JayZ",
   };
    return fetch(`/api/openAPI`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => data.response.content);
  };

  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/openAPI" : null,
    fetcher
  );
  
  
  useEffect(() => {
    const body = {
      prompt: "Can you write an essay on JayZ",
    };
    const readStream = async () => {
      try {
        const response = await fetch(`/api/streamPost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.body) {
          console.error("Fetch response does not have a readable stream");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream has completed");
            break;
          }

          const chunk = decoder.decode(value);
          setMessages((prevMessages) => [...prevMessages, chunk]);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
      }
    };

    readStream();
  }, []);

  return (
    <div>
       <button
        onClick={() => setFetchNow(!fetchNow)}
        className="bg-teal-400 w-20 rounded-sm p-2"
      ></button>
      <h1>Chat Messages</h1>
      {messages.map((message, index) => (
        <span key={index}>{message}</span>
      ))}
    </div>
  );
}
