import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, rolePath, type AppRole } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export type MenuItem = { label: string; icon: ReactNode; to?: "/validador" | "/anunciante" | "/admin" };

function useGuard(required: AppRole) {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/entrar" });
    else if (role !== required) navigate({ to: rolePath(role) });
  }, [loading, session, role, required, navigate]);
  return !loading && !!session && role === required;
}

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Carregando…</div>
  );
}

async function sair(navigate: ReturnType<typeof useNavigate>) {
  await supabase.auth.signOut();
  navigate({ to: "/" });
}

function MenuEntry({ item, dark }: { item: MenuItem; dark?: boolean }) {
  const base = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium";
  if (!item.to)
    return (
      <span className={cn(base, "cursor-not-allowed opacity-50")} title="Em breve">
        {item.icon}
        {item.label}
      </span>
    );
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: true }}
      className={cn(base, dark ? "hover:bg-sidebar-accent" : "hover:bg-muted")}
      activeProps={{ className: dark ? "bg-sidebar-accent text-sidebar-primary" : "text-primary" }}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

/** Mobile-first area with bottom navigation (Validador). */
export function BottomNavArea({ role, menu, children }: { role: AppRole; menu: MenuItem[]; children: ReactNode }) {
  const ok = useGuard(role);
  const navigate = useNavigate();
  if (!ok) return <Loading />;
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <header className="flex items-center justify-between px-5 py-4">
        <Logo />
        <button onClick={() => sair(navigate)} className="text-muted-foreground" aria-label="Sair">
          <LogOut className="size-5" />
        </button>
      </header>
      <main className="px-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-card">
        <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${menu.length}, 1fr)` }}>
          {menu.map((m) => (
            <div key={m.label} className="[&>*]:flex-col [&>*]:gap-1 [&>*]:px-1 [&>*]:py-3 [&>*]:text-xs [&>*]:justify-center">
              <MenuEntry item={m} />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

/** Desktop side menu area (Anunciante, Admin); bottom bar on mobile. */
export function SideNavArea({ role, title, menu, children }: { role: AppRole; title: string; menu: MenuItem[]; children: ReactNode }) {
  const ok = useGuard(role);
  const navigate = useNavigate();
  if (!ok) return <Loading />;
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="mb-2 px-2 py-2"><Logo inverted /></div>
        <p className="mb-6 px-3 text-xs uppercase tracking-widest opacity-60">{title}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {menu.map((m) => <MenuEntry key={m.label} item={m} dark />)}
        </nav>
        <button onClick={() => sair(navigate)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent">
          <LogOut className="size-4" /> Sair
        </button>
      </aside>
      <div className="flex-1 pb-24 md:pb-0">
        <header className="flex items-center justify-between border-b px-5 py-4 md:hidden">
          <Logo />
          <button onClick={() => sair(navigate)} aria-label="Sair"><LogOut className="size-5 text-muted-foreground" /></button>
        </header>
        <main className="mx-auto max-w-5xl p-5 md:p-10">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-card md:hidden">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${menu.length}, 1fr)` }}>
          {menu.map((m) => (
            <div key={m.label} className="[&>*]:flex-col [&>*]:gap-1 [&>*]:px-1 [&>*]:py-3 [&>*]:text-[11px] [&>*]:justify-center">
              <MenuEntry item={m} />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
