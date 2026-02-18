"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center">
        <div className="w-4 h-4 bg-white/10 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-foreground hover:text-white transition-all duration-200 cursor-pointer"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-[18px] h-[18px] text-amber-400/80" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-violet-600/80" />
      )}
    </button>
  );
}
