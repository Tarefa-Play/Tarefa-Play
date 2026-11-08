import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/simple-page";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [
    { title: "Termos de uso — Tarefa-Play" },
    { name: "description", content: "Termos de uso da plataforma Tarefa-Play." },
    { property: "og:title", content: "Termos de uso — Tarefa-Play" },
    { property: "og:description", content: "Termos de uso da plataforma Tarefa-Play." },
  ] }),
  component: () => (
    <SimplePage title="Termos de uso">
      <p>O texto oficial dos termos será publicado após revisão jurídica.</p>
    </SimplePage>
  ),
});
