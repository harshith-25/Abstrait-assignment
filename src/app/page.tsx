import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Markly — Smart Bookmark Manager",
  description:
    "A minimal, real-time bookmark manager with a beautiful glassmorphic interface.",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-violet-500/30 overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[140px] animate-pulse-glow" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 dark:bg-fuchsia-600/10 blur-[120px] animate-pulse-glow" style={{ animationDuration: '5s' }} />
      </div>

      {/* Nav */}
      <header className="relative z-10 glass">
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-foreground tracking-tight">Markly</span>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex items-center justify-center px-6 -mt-16">
        <div className="max-w-2xl text-center space-y-10 animate-fade-up">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-glass-border text-[12px] font-medium text-violet-500 dark:text-violet-400 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 animate-ping opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Next-gen bookmarking
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight leading-[1.2] sm:leading-[1.1]">
              Capture your ideas.
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Sync instantly.
              </span>
            </h1>
            
            <p className="text-lg text-foreground/40 dark:text-white/40 max-w-lg mx-auto leading-relaxed font-medium">
              A minimalist, real-time bookmark manager with Apple-style glass interface. 
              Built for speed, privacy, and flawless sync.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <form action="/api/auth/google" method="GET">
              <button
                type="submit"
                className="group flex items-center gap-3 px-8 py-3.5 bg-foreground text-background font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/10 dark:shadow-white/5 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
            </form>
          </div>

          <div className="pt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 stagger">
              {[
                { label: "Glassmorphism", icon: "✨" },
                { label: "Real-time Ready", icon: "⚡" },
                { label: "Secured by RLS", icon: "🔒" },
              ].map((pill) => (
                <div key={pill.label} className="flex items-center gap-2 text-foreground/20 dark:text-white/20 text-sm font-medium">
                  <span className="text-lg opacity-50">{pill.icon}</span>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-glass-border">
        <p className="text-[12px] text-foreground/10 dark:text-white/10 font-medium">
          Powered by Next.js, Supabase & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
