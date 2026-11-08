import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className={inverted ? "text-ink-foreground" : "text-foreground"}>
        Tarefa<span className="text-success">-</span>Play
      </span>
    </Link>
  );
}
