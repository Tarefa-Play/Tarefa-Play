import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/simple-page";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [
    { title: "Contato — Tarefa-Play" },
    { name: "description", content: "Fale com a equipe do Tarefa-Play." },
    { property: "og:title", content: "Contato — Tarefa-Play" },
    { property: "og:description", content: "Fale com a equipe do Tarefa-Play." },
  ] }),
  component: () => (
    <SimplePage title="Contato">
      <p>Os canais de contato serão divulgados em breve.</p>
    </SimplePage>
  ),
});
