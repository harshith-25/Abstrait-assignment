"use client";

import { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import { createClient } from "@/lib/supabase/client";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    const { error } = await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    if (error) {
      console.error("Delete failed:", error);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const domain = getDomain(bookmark.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <div
      className={`group relative glass-card rounded-2xl p-4 transition-all duration-300 ${
        deleting ? "opacity-30 scale-95 pointer-events-none" : "hover:scale-[1.01]"
      }`}
    >
      {/* Delete button (Top Right) */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed z-10 ${
          confirmDelete
            ? "bg-red-500/10 text-red-500 scale-110"
            : "text-foreground/10 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
        }`}
        title={confirmDelete ? "Click again to confirm" : "Delete bookmark"}
      >
        {deleting ? (
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        )}
      </button>

      {/* Confirm tag */}
      {confirmDelete && (
        <span className="absolute top-4 right-10 text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded pointer-events-none">
          Confirm
        </span>
      )}

      {/* Link content */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-foreground/5 transition-transform group-hover:rotate-6">
            <img
              src={faviconUrl}
              alt=""
              className="w-5 h-5 rounded"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<svg class="w-5 h-5 text-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                }
              }}
            />
          </div>
          <div className="min-w-0 flex-1 pr-6 pt-0.5">
            <h3 className="text-[15px] font-semibold text-foreground/90 truncate leading-snug transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {bookmark.title}
            </h3>
            <p className="text-[12px] text-foreground/30 font-medium truncate mt-0.5 tracking-tight group-hover:text-foreground/50">
              {domain}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-foreground/[0.03]">
          <span className="text-[11px] font-medium text-foreground/20">{getTimeAgo(bookmark.created_at)}</span>
          <span className="text-[11px] font-bold text-violet-600/60 dark:text-violet-400/50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 flex items-center gap-1.5 uppercase tracking-widest">
            Open
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  );
}
