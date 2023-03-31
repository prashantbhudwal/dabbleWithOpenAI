"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stream");
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        const processStream: any = async (result: any) => {
          if (result.done) {
            return;
          }

          setMessage(decoder.decode(result.value));
          return reader?.read().then(processStream);
        };

        reader?.read().then(processStream);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Next.js Client</h1>
      <p>Message from server: {message}</p>
    </div>
  );
}
