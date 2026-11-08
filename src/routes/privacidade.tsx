import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/simple-page";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Privacidade — Tarefa-Play" },
    { name: "description", content: "Política de privacidade do Tarefa-Play." },
    { property: "og:title", content: "Privacidade — Tarefa-Play" },
    { property: "og:description", content: "Política de privacidade do Tarefa-Play." },
  ] }),
  component: () => (
    <SimplePage title="Política de privacidade">
      <p>A política de privacidade oficial será publicada após revisão jurídica.</p>
    </SimplePage>
  ),
});
