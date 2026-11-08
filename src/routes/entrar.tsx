import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoles, primaryRole, rolePath } from "@/lib/auth";
import { AuthCard } from "@/components/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Tarefa-Play" },
      { name: "description", content: "Acesse sua conta Tarefa-Play como Validador ou Anunciante." },
      { property: "og:title", content: "Entrar — Tarefa-Play" },
      { property: "og:description", content: "Acesse sua conta Tarefa-Play." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("confirmed") ? "Confirme seu e-mail antes de entrar." : "E-mail ou senha incorretos.");
      return;
    }
    const roles = await fetchRoles(data.user.id);
    navigate({ to: rolePath(primaryRole(roles)) });
  };

  return (
    <AuthCard title="Entrar" subtitle="Bem-vindo de volta.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" search={{ perfil: "validador" }} className="font-semibold text-primary">Criar conta</Link>
      </p>
    </AuthCard>
  );
}
