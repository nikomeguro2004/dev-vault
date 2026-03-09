export default function GlobalLoading() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-zinc-900/50"
          />
        ))}
      </div>
    </div>
  );
}
