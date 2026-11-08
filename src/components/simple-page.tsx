import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

export function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center px-5 py-5"><Logo /></header>
      <main className="mx-auto max-w-3xl px-5 pb-20">
        <h1 className="mb-6 text-4xl font-bold">{title}</h1>
        <div className="space-y-4 text-muted-foreground">{children}</div>
      </main>
    </div>
  );
}
