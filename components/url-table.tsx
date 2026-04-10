"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUrls, useDeleteUrl } from "@/lib/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function UrlTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "20");

  const { data, isLoading, isError } = useUrls(page, size);
  const deleteMutation = useDeleteUrl();

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/?${params.toString()}`);
  }

  function handleDelete(shortCode: string) {
    deleteMutation.mutate(shortCode, {
      onSuccess: () => toast.success("URL deleted"),
      onError: (error) => toast.error(error.message || "Failed to delete"),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Failed to load URLs. Is the backend running?
      </p>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No URLs yet. Create your first short URL above!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My URLs</h2>
        <span className="text-sm text-muted-foreground">
          {data.totalElements} total
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead className="w-[80px]">Clicks</TableHead>
              <TableHead className="w-[100px]">Created</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((url) => (
              <TableRow key={url.shortCode}>
                <TableCell>
                  <Link
                    href={`/urls/${url.shortCode}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    /{url.shortCode}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {url.originalUrl}
                </TableCell>
                <TableCell>{url.clickCount}</TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete /{url.shortCode} and all
                          its click data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(url.shortCode)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= data.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
