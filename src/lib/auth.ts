import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "validador" | "anunciante" | "admin";

export function isAppRole(value: unknown): value is AppRole {
  return value === "validador" || value === "anunciante" || value === "admin";
}

export function parseAppRoles(values: readonly unknown[]): AppRole[] {
  return values.filter(isAppRole);
}

// Admin wins over the others; each user has one primary area.
export function primaryRole(roles: readonly AppRole[]): AppRole | null {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("anunciante")) return "anunciante";
  if (roles.includes("validador")) return "validador";
  return null;
}

export function rolePath(role: AppRole | null): "/validador" | "/anunciante" | "/admin" | "/entrar" {
  if (!role) return "/entrar";
  return `/${role}` as "/validador" | "/anunciante" | "/admin";
}

export async function fetchRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw error;
  return parseAppRoles((data ?? []).map((row) => row.role));
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const load = async (nextSession: Session | null) => {
      const requestId = ++latestRequest;
      if (!active) return;

      setSession(nextSession);
      if (!nextSession) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const roles = await fetchRoles(nextSession.user.id);
        if (active && requestId === latestRequest) setRole(primaryRole(roles));
      } catch (error) {
        console.error("[Auth] Não foi possível carregar os papéis do usuário.", error);
        if (active && requestId === latestRequest) setRole(null);
      } finally {
        if (active && requestId === latestRequest) setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Defer Supabase queries until after the auth callback has completed.
      setTimeout(() => void load(nextSession), 0);
    });

    supabase.auth.getSession().then(({ data }) => void load(data.session)).catch((error) => {
      console.error("[Auth] Não foi possível recuperar a sessão.", error);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, role, loading };
}
