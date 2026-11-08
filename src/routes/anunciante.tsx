import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, FileText, BarChart3, Wallet, Settings } from "lucide-react";
import { SideNavArea } from "@/components/role-area";

export const Route = createFileRoute("/anunciante")({
  head: () => ({ meta: [{ title: "Painel do Anunciante — Tarefa-Play" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <SideNavArea
      role="anunciante"
      title="Anunciante"
      menu={[
        { label: "Início", icon: <Home className="size-4" />, to: "/anunciante" },
        { label: "Publicações", icon: <FileText className="size-4" /> },
        { label: "Validações", icon: <BarChart3 className="size-4" /> },
        { label: "Carteira", icon: <Wallet className="size-4" /> },
        { label: "Configurações", icon: <Settings className="size-4" /> },
      ]}
    >
      <Outlet />
    </SideNavArea>
  ),
});
