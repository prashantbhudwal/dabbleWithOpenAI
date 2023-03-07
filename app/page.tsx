"use client";
import styles from "./page.module.css";
import { useState } from "react";
import useSWR from "swr";
import * as dotenv from "dotenv";

export default function Home() {
  const [fetchNow, setFetchNow] = useState(false);
  const [input, setInput] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const fetcher = function () {
    const body = {
      prompt: input,
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

  console.log(data);

  const loadingJSX = <h1>Loading</h1>;
  const errorJSX = <h1>Error</h1>;

  if (error) return errorJSX;
  if (isLoading) return loadingJSX;
  return (
    <div>
      <input
        type="text"
        onChange={handleChange}
        value={input}
        className="border-slate-700 rounded-md bg-slate-300 text-black p-3  w-96"
      />

      <button
        onClick={() => setFetchNow(!fetchNow)}
        className="bg-teal-400 w-20 rounded-sm p-2"
      >
        Send
      </button>
      <h2>{data}</h2>
    </div>
  );
}
