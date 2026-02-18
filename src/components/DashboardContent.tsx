"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark } from "@/types/bookmark";
import { createClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkList from "./BookmarkList";
import { User } from "@supabase/supabase-js";

interface DashboardContentProps {
  user: User;
  initialBookmarks: Bookmark[];
}

export default function DashboardContent({ user, initialBookmarks }: DashboardContentProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const supabase = createClient();

  const sortByDate = useCallback((items: Bookmark[]) => {
    return [...items].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, []);

  const handleBookmarkAdded = useCallback((newBookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === newBookmark.id)) return prev;
      return sortByDate([newBookmark, ...prev]);
    });
  }, [sortByDate]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return sortByDate([newBookmark, ...prev]);
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id, sortByDate]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-violet-500/30">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[8%] left-[12%] w-[450px] h-[450px] rounded-full bg-violet-500/10 dark:bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-[18%] right-[8%] w-[400px] h-[400px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/10 blur-[110px]" />
      </div>

      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10 space-y-12">
        <section>
          <AddBookmarkForm userId={user.id} onBookmarkAdded={handleBookmarkAdded} />
        </section>

        <section>
          <BookmarkList 
            userId={user.id} 
            bookmarks={bookmarks} 
          />
        </section>
      </main>
    </div>
  );
}
