export default function EmptyState() {
  return (
    <div className="text-center py-20 px-4 animate-fade-up">
      <div className="w-[80px] h-[80px] mx-auto mb-6 rounded-2xl glass flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-none transition-transform hover:scale-105 duration-300">
        <svg className="w-9 h-9 text-foreground/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
      </div>
      <h3 className="text-[18px] font-semibold text-foreground/60 mb-2">Ready to save?</h3>
      <p className="text-[14px] text-foreground/30 max-w-[300px] mx-auto leading-relaxed font-medium">
        Your first bookmark will sync instantly across all your open tabs. Private, fast, and secure.
      </p>
    </div>
  );
}
