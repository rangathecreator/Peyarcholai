import React from "react";
import { filterTamilNames } from "@/lib/repository";
import NamingGuruDashboard from "@/components/NamingGuruDashboard";

export const revalidate = 3600;

const INITIAL_PAGE_SIZE = 24;

export default function HomePage() {
  // Only the first page is sent to the browser; the rest is fetched from /api/names.
  const all = filterTamilNames({});
  return (
    <NamingGuruDashboard
      initialNames={all.slice(0, INITIAL_PAGE_SIZE)}
      initialTotal={all.length}
      pageSize={INITIAL_PAGE_SIZE}
    />
  );
}
