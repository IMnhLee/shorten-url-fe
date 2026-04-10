"use client";

import { Suspense } from "react";
import { ShortenForm } from "@/components/shorten-form";
import { UrlTable } from "@/components/url-table";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 space-y-16">
      <ShortenForm />
      <div className="border-t" />
      <Suspense>
        <UrlTable />
      </Suspense>
    </div>
  );
}
