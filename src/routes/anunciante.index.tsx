import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/anunciante/")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Painel do Anunciante</h1>
      <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        Suas publicações e validações aparecerão aqui em breve.
      </div>
    </div>
  ),
});
