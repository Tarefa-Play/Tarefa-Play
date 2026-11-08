import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/validador/")({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Olá, Validador</h1>
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Suas tarefas aparecerão aqui em breve.
      </div>
    </div>
  ),
});
