"use client";

import { Suspense } from "react";
import { ShortenForm } from "@/components/shorten-form";
import { UrlTable } from "@/components/url-table";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <ShortenForm />
      <hr />
      <Suspense>
        <UrlTable />
      </Suspense>
    </div>
  );
}
