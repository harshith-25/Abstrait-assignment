"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/bookmark";

interface AddBookmarkFormProps {
  userId: string;
  onBookmarkAdded: (bookmark: Bookmark) => void;
}

export default function AddBookmarkForm({ userId, onBookmarkAdded }: AddBookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const isValidUrl = (str: string) => {
    try {
      new URL(str.startsWith("http") ? str : `https://${str}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("Give your bookmark a title.");
      return;
    }

    if (!trimmedUrl) {
      setError("Paste in a URL.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("That doesn't look like a valid URL.");
      return;
    }

    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;

    setLoading(true);

    const { data, error: insertError } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        title: trimmedTitle,
        url: finalUrl,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError || !data) {
      setError("Couldn't save that. Try again?");
      console.error(insertError);
      return;
    }

    onBookmarkAdded(data as Bookmark);

    setTitle("");
    setUrl("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
    titleRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="glass rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-[15px] font-semibold text-foreground/90">New Bookmark</h2>
        </div>

        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bm-title" className="block text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-0.5">
              Title
            </label>
            <input
              ref={titleRef}
              id="bm-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Harshith's GitHub Link"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-input-bg border-input-border outline-none glass-input"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="bm-url" className="block text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-0.5">
              URL
            </label>
            <input
              id="bm-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://github.com/harshith-25"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-input-bg border-input-border outline-none glass-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[13px] text-red-500 font-medium flex items-center gap-1.5 px-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="group px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Save Bookmark
              </>
            )}
          </button>

          {success && (
            <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Success!
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
