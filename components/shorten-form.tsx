"use client";

import { useState } from "react";
import { useCreateUrl } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const createUrl = useCreateUrl();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    createUrl.mutate(
      { url: url.trim() },
      {
        onSuccess: () => {
          setUrl("");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to shorten URL");
        },
      }
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Shorten your URL
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Paste a long URL and get a short, shareable link
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <Input
          type="url"
          placeholder="https://example.com/very-long-url..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="h-12 text-base flex-1"
        />
        <Button
          type="submit"
          disabled={createUrl.isPending}
          className="h-12 px-8 text-base"
        >
          {createUrl.isPending ? "Shortening..." : "Shorten"}
        </Button>
      </form>

      {createUrl.data && (
        <div className="flex items-center justify-between max-w-2xl mx-auto rounded-lg border border-green-200 bg-green-50 px-6 py-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <span className="font-semibold text-lg truncate">
            {createUrl.data.shortUrl}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(createUrl.data!.shortUrl)}
            className="shrink-0 text-green-800 hover:text-green-900 hover:bg-green-100 dark:text-green-200 dark:hover:bg-green-900"
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
}
