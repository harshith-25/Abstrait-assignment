"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
              <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-foreground tracking-tight">
              Markly
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2.5 pl-3 pr-1.5 py-1.5 rounded-full glass-card">
              <span className="text-[13px] font-medium text-foreground/70">{name}</span>
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-7 h-7 rounded-full ring-1 ring-foreground/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/50 to-fuchsia-500/50 flex items-center justify-center text-xs font-medium text-white">
                  {name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-[7px] text-[13px] font-medium text-foreground/50 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-all duration-200 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
