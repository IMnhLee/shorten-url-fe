import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createUrl, getUrls, getUrlDetail, getUrlStats, deleteUrl } from "./api";
import type { CreateUrlRequest } from "./types";

export function useUrls(page: number, size = 20) {
  return useQuery({
    queryKey: ["urls", page, size],
    queryFn: () => getUrls(page, size),
  });
}

export function useUrlDetail(shortCode: string) {
  return useQuery({
    queryKey: ["urls", shortCode],
    queryFn: () => getUrlDetail(shortCode),
    enabled: !!shortCode,
  });
}

export function useUrlStats(shortCode: string) {
  return useQuery({
    queryKey: ["urls", shortCode, "stats"],
    queryFn: () => getUrlStats(shortCode),
    enabled: !!shortCode,
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUrlRequest) => createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shortCode: string) => deleteUrl(shortCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
}
