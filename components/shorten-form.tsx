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
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Shorten your URL
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste a long URL and get a short, shareable link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto">
        <Input
          type="url"
          placeholder="https://example.com/very-long-url..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Button type="submit" disabled={createUrl.isPending}>
          {createUrl.isPending ? "Shortening..." : "Shorten"}
        </Button>
      </form>

      {createUrl.data && (
        <div className="flex items-center justify-between max-w-xl mx-auto rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <span className="font-medium">{createUrl.data.shortUrl}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(createUrl.data!.shortUrl)}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
}
