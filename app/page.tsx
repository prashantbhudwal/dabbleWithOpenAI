"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { OpenAIApi, Configuration } from "openai";
import * as dotenv from "dotenv";

export default function Home() {
  const [test, setTest] = useState("test");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log(process.env.OPENAI_API_KEY);

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    async function fetchCompletion() {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello world" }],
      });
      console.log(completion.data.choices[0].message);
    }
    fetchCompletion();
  }, [test]);

  return <div></div>;
}
