import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, ListChecks, Wallet, User } from "lucide-react";
import { BottomNavArea } from "@/components/role-area";

export const Route = createFileRoute("/validador")({
  head: () => ({ meta: [{ title: "Painel do Validador — Tarefa-Play" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <BottomNavArea
      role="validador"
      menu={[
        { label: "Início", icon: <Home className="size-5" />, to: "/validador" },
        { label: "Tarefas", icon: <ListChecks className="size-5" /> },
        { label: "Carteira", icon: <Wallet className="size-5" /> },
        { label: "Perfil", icon: <User className="size-5" /> },
      ]}
    >
      <Outlet />
    </BottomNavArea>
  ),
});
