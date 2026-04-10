import type {
  UrlRecord,
  UrlListResponse,
  UrlStats,
  CreateUrlRequest,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function createUrl(data: CreateUrlRequest): Promise<UrlRecord> {
  return request<UrlRecord>("/api/urls", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getUrls(page = 0, size = 20): Promise<UrlListResponse> {
  return request<UrlListResponse>(
    `/api/urls?page=${page}&size=${size}&sort=createdAt,desc`
  );
}

export function getUrlDetail(shortCode: string): Promise<UrlRecord> {
  return request<UrlRecord>(`/api/urls/${shortCode}`);
}

export function getUrlStats(shortCode: string): Promise<UrlStats> {
  return request<UrlStats>(`/api/urls/${shortCode}/stats`);
}

export function deleteUrl(shortCode: string): Promise<void> {
  return request<void>(`/api/urls/${shortCode}`, { method: "DELETE" });
}
