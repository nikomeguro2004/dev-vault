import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950/50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Dev Vault · {year}</p>
        <div className="flex items-center gap-2">
          <span>Contact:</span>
          <Link
            href="mailto:adihere2000@gmail.com"
            className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
          >
            adihere2000@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
