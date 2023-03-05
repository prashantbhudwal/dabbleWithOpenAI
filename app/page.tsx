"use client";
import styles from "./page.module.css";
import { useState } from "react";
import useSWR from "swr";
import * as dotenv from "dotenv";

export default function Home() {
  const [fetchNow, setFetchNow] = useState(false);

  const fetcher = function () {
    return fetch("/api/openAPI")
      .then((res) => res.json())
      .then((data) => data.response.content);
  };

  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/openAPI" : null,
    fetcher
  );

  const handleClick = () => {
    setFetchNow(true);
  };

  const loadingJSX = <h1>Loading</h1>;
  const errorJSX = <h1>Error</h1>;

  if (error) return errorJSX;
  if (isLoading) return loadingJSX;
  return (
    <div>
      <button onClick={handleClick}>Fetch</button>
      <h1>{data}</h1>
    </div>
  );
}
