import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Perfil = "validador" | "anunciante";

export const Route = createFileRoute("/cadastro")({
  validateSearch: (s: Record<string, unknown>): { perfil: Perfil } => ({
    perfil: s["perfil"] === "anunciante" ? "anunciante" : "validador",
  }),
  head: () => ({
    meta: [
      { title: "Criar conta — Tarefa-Play" },
      { name: "description", content: "Crie sua conta como Validador ou Anunciante no Tarefa-Play." },
      { property: "og:title", content: "Criar conta — Tarefa-Play" },
      { property: "og:description", content: "Valide produtos ou receba avaliações honestas." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const { perfil: inicial } = Route.useSearch();
  const [perfil, setPerfil] = useState<Perfil>(inicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [maior, setMaior] = useState(false);
  const [busy, setBusy] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maior) { toast.error("É preciso ter 18 anos ou mais."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password: senha,
      options: { emailRedirectTo: `${window.location.origin}/entrar`, data: { nome, perfil } },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setEnviado(true);
  };

  if (enviado)
    return (
      <AuthCard title="Confirme seu e-mail" subtitle={`Enviamos um link para ${email}. Clique nele para ativar sua conta.`}>
        <Button asChild variant="soft" className="w-full"><Link to="/entrar">Ir para o login</Link></Button>
      </AuthCard>
    );

  return (
    <AuthCard title="Criar conta" subtitle="Escolha como você quer usar o Tarefa-Play.">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
        {(["validador", "anunciante"] as const).map((p) => (
          <button key={p} type="button" onClick={() => setPerfil(p)}
            className={cn("rounded-full py-2 text-sm font-semibold capitalize transition",
              perfil === p ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {p}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="nome">{perfil === "anunciante" ? "Nome ou empresa" : "Nome completo"}</Label>
          <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" minLength={8} required value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1 accent-primary" checked={maior} onChange={(e) => setMaior(e.target.checked)} />
          Declaro ter 18 anos ou mais.
        </label>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
          {busy ? "Criando…" : "Criar conta"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Já tem conta? <Link to="/entrar" className="font-semibold text-primary">Entrar</Link>
      </p>
    </AuthCard>
  );
}
