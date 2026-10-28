"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setShortUrl("");

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while creating the short link.");
      }

      setShortUrl(data.shortUrl);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create a short URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <section className="max-w-2xl space-y-3">
        <p className="text-sm font-medium text-accent">Live URL shortener</p>
        <h1 className="text-4xl font-semibold tracking-tight">Shorten links. Track clicks.</h1>
        <p className="text-lg leading-8 text-muted">
          Turn long URLs into short links and track how many people click them.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="url" className="block text-sm font-medium">
            Long URL
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/very/long/link"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
              aria-label="URL to shorten"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {shortUrl ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">
              <p className="font-medium">Your short link:</p>
              <a href={shortUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all underline">
                {shortUrl}
              </a>
            </div>
          ) : null}
        </form>
      </section>
    </div>
  );
}
