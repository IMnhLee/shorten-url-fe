"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUrlDetail, useUrlStats, useDeleteUrl } from "@/lib/queries";
import { StatsPanels } from "@/components/stats-panels";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function UrlDetailPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const router = useRouter();
  const { data: urlData, isLoading: urlLoading, isError: urlError } = useUrlDetail(shortCode);
  const { data: stats, isLoading: statsLoading } = useUrlStats(shortCode);
  const deleteMutation = useDeleteUrl();

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  function handleDelete() {
    deleteMutation.mutate(shortCode, {
      onSuccess: () => {
        toast.success("URL deleted");
        router.push("/");
      },
      onError: (error) => toast.error(error.message || "Failed to delete"),
    });
  }

  if (urlLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (urlError || !urlData) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center space-y-4">
        <p className="text-muted-foreground">URL not found.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          Back to URLs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to URLs
      </Link>

      {/* URL Info Card */}
      <div className="rounded-md border p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 min-w-0">
            <div>
              <p className="text-xs text-muted-foreground">Short URL</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {urlData.shortUrl}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(urlData.shortUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Original URL</p>
              <p className="text-sm break-all">{urlData.originalUrl}</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>
                Created:{" "}
                {new Date(urlData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>
                Expires:{" "}
                {new Date(urlData.expiresAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="text-center rounded-md bg-muted px-6 py-4 shrink-0">
            <p className="text-3xl font-bold">{urlData.clickCount}</p>
            <p className="text-xs text-muted-foreground">Total Clicks</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : stats ? (
        <StatsPanels stats={stats} />
      ) : null}

      {/* Delete */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
              >
                Delete URL
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete URL?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete /{shortCode} and all its click
                data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
