import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "validador" | "anunciante" | "admin";

// Admin wins over the others; each user has one primary area.
export function primaryRole(roles: AppRole[]): AppRole | null {
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
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r) => r.role as AppRole);
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async (s: Session | null) => {
      setSession(s);
      if (s) {
        const roles = await fetchRoles(s.user.id);
        if (active) setRole(primaryRole(roles));
      } else setRole(null);
      if (active) setLoading(false);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setTimeout(() => load(s), 0);
    });
    supabase.auth.getSession().then(({ data }) => load(data.session));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, role, loading };
}
