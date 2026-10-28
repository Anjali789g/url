"use client";

import { useEffect, useState } from "react";

type RecentLink = {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  shortUrl: string;
};

export default function DashboardPage() {
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [todayClicks, setTodayClicks] = useState(0);
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load dashboard data.");
        }

        setTotalLinks(data.totalLinks ?? 0);
        setTotalClicks(data.totalClicks ?? 0);
        setTodayClicks(data.todayClicks ?? 0);
        setRecentLinks(data.recentLinks ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-xl text-muted leading-7">
          Track your links, total clicks, and recent activity.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading analytics...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total links" value={String(totalLinks)} />
            <StatCard label="Total clicks" value={String(totalClicks)} />
            <StatCard label="Clicks today" value={String(todayClicks)} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Recent links</h2>
            <div className="mt-4 space-y-3">
              {recentLinks.length === 0 ? (
                <p className="text-sm text-muted">No links created yet.</p>
              ) : (
                recentLinks.map((link) => (
                  <div key={link.shortCode} className="rounded-xl border border-border p-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <a href={link.shortUrl} target="_blank" rel="noreferrer" className="font-medium text-accent underline break-all">
                        {link.shortUrl}
                      </a>
                      <span className="text-xs text-muted">{new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted break-all">{link.originalUrl}</p>
                    <p className="mt-2 text-xs text-muted">{link.clickCount} clicks</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
