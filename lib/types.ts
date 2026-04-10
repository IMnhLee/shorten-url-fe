export interface UrlRecord {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string;
  clickCount: number;
}

export interface UrlListResponse {
  content: UrlRecord[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UrlStats {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  topReferrers: { referrer: string; count: number }[];
  topUserAgents: { userAgent: string; count: number }[];
}

export interface CreateUrlRequest {
  url: string;
}
