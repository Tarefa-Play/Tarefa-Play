import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateConfigValue } from "@/lib/config";

export const Route = createFileRoute("/admin/")({ component: AdminConfig });

type Cfg = { chave: string; valor: string; descricao: string | null };

function AdminConfig() {
  const [rows, setRows] = useState<Cfg[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const { data, error } = await supabase
      .from("configuracoes")
      .select("chave, valor, descricao")
      .order("chave");
    if (error) {
      console.error("[Admin] Falha ao carregar configurações.", error);
      setLoadError(true);
      toast.error("Não foi possível carregar as configurações.");
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const salvar = async (chave: string) => {
    const valor = edits[chave];
    if (valor === undefined || saving) return;
    const validationError = validateConfigValue(valor);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(chave);
    const { data, error } = await supabase
      .from("configuracoes")
      .update({ valor: valor.trim() })
      .eq("chave", chave)
      .select("chave")
      .single();

    // PostgREST can return no error when RLS filters every updated row.
    // Requiring the updated key prevents a false-positive success message.
    if (error || !data) {
      console.error("[Admin] Falha ao confirmar persistência da configuração.", {
        chave,
        error: error ?? new Error("Nenhuma configuração foi atualizada."),
      });
      toast.error("Não foi possível confirmar a gravação. Verifique sua permissão e tente novamente.");
      setSaving(null);
      return;
    }

    toast.success("Configuração salva.");
    setEdits((current) => {
      const next = { ...current };
      delete next[chave];
      return next;
    });
    setSaving(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Valores, mínimos e prazos usados em toda a plataforma.</p>
      </div>
      {loading ? (
        <p role="status" className="text-sm text-muted-foreground">Carregando configurações…</p>
      ) : loadError ? (
        <div className="rounded-2xl border p-5">
          <p role="alert" className="text-sm">As configurações não puderam ser carregadas. Nenhum valor foi alterado.</p>
          <Button className="mt-3" variant="outline" onClick={() => void load()}>Tentar novamente</Button>
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border p-5 text-sm text-muted-foreground">Nenhuma configuração disponível.</p>
      ) : (
        <div className="divide-y rounded-2xl border bg-card shadow-card">
          {rows.map((r) => (
            <div key={r.chave} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-medium">{r.descricao ?? r.chave}</p>
                <p className="font-mono text-xs text-muted-foreground">{r.chave}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  aria-label={`Valor de ${r.chave}`}
                  className="w-36"
                  maxLength={500}
                  value={edits[r.chave] ?? r.valor}
                  onChange={(e) => setEdits((current) => ({ ...current, [r.chave]: e.target.value }))}
                />
                <Button size="sm" disabled={edits[r.chave] === undefined || saving !== null} onClick={() => void salvar(r.chave)}>
                  {saving === r.chave ? "Salvando…" : "Salvar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
