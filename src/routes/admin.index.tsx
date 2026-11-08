import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({ component: AdminConfig });

type Cfg = { chave: string; valor: string; descricao: string | null };

function AdminConfig() {
  const [rows, setRows] = useState<Cfg[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("configuracoes").select("*").order("chave");
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const salvar = async (chave: string) => {
    const valor = edits[chave];
    if (valor === undefined) return;
    const { error } = await supabase.from("configuracoes").update({ valor }).eq("chave", chave);
    if (error) { toast.error("Não foi possível salvar"); return; }
    toast.success("Configuração salva");
    setEdits((e) => { const n = { ...e }; delete n[chave]; return n; });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Valores, mínimos e prazos usados em toda a plataforma.</p>
      </div>
      <div className="divide-y rounded-2xl border bg-card shadow-card">
        {rows.map((r) => (
          <div key={r.chave} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-medium">{r.descricao}</p>
              <p className="font-mono text-xs text-muted-foreground">{r.chave}</p>
            </div>
            <div className="flex gap-2">
              <Input className="w-36" value={edits[r.chave] ?? r.valor}
                onChange={(e) => setEdits({ ...edits, [r.chave]: e.target.value })} />
              <Button size="sm" disabled={edits[r.chave] === undefined} onClick={() => salvar(r.chave)}>Salvar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
