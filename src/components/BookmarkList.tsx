"use client";

import { Bookmark } from "@/types/bookmark";
import BookmarkCard from "./BookmarkCard";
import EmptyState from "./EmptyState";

interface BookmarkListProps {
  userId: string;
  bookmarks: Bookmark[];
}

export default function BookmarkList({ userId, bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
      {/* Section header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-medium text-white/40">Your Bookmarks</h2>
          <span className="text-[12px] text-white/20 px-2 py-0.5 rounded-md bg-white/[0.03]">
            {bookmarks.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/60">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-glow" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Live
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
