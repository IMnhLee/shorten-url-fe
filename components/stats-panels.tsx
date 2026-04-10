"use client";

import type { UrlStats } from "@/lib/types";

function parseUserAgent(ua: string): string {
  if (ua.includes("curl")) return "curl";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return ua.length > 30 ? ua.slice(0, 30) + "..." : ua;
}

function BarChart({
  items,
}: {
  items: { label: string; count: number }[];
}) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-32 truncate text-muted-foreground">
            {item.label}
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right tabular-nums text-muted-foreground">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatsPanels({ stats }: { stats: UrlStats }) {
  const referrerItems = stats.topReferrers.map((r) => ({
    label: r.referrer,
    count: r.count,
  }));

  const userAgentItems = stats.topUserAgents.map((ua) => ({
    label: parseUserAgent(ua.userAgent),
    count: ua.count,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-md border p-4 space-y-3">
        <h3 className="font-semibold text-sm">Top Referrers</h3>
        {referrerItems.length > 0 ? (
          <BarChart items={referrerItems} />
        ) : (
          <p className="text-sm text-muted-foreground">No referrer data yet</p>
        )}
      </div>

      <div className="rounded-md border p-4 space-y-3">
        <h3 className="font-semibold text-sm">Top User Agents</h3>
        {userAgentItems.length > 0 ? (
          <BarChart items={userAgentItems} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No user agent data yet
          </p>
        )}
      </div>
    </div>
  );
}
