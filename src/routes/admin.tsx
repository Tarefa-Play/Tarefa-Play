import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SlidersHorizontal, Users, ShieldAlert, LifeBuoy } from "lucide-react";
import { SideNavArea } from "@/components/role-area";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tarefa-Play" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <SideNavArea
      role="admin"
      title="Administração"
      menu={[
        { label: "Configurações", icon: <SlidersHorizontal className="size-4" />, to: "/admin" },
        { label: "Usuários", icon: <Users className="size-4" /> },
        { label: "Restrições", icon: <ShieldAlert className="size-4" /> },
        { label: "Suporte", icon: <LifeBuoy className="size-4" /> },
      ]}
    >
      <Outlet />
    </SideNavArea>
  ),
});
