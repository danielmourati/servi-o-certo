import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole } from "@/lib/auth.functions";

export async function requireAdminBeforeLoad({ location }: { location: { href: string } }) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw redirect({ to: "/entrar", search: { redirect: location.href } });
  }
  try {
    const res = await getMyRole();
    if (!res?.isAdmin) {
      throw redirect({ to: "/entrar", search: { redirect: location.href, reason: "no_admin" } });
    }
  } catch (e: any) {
    // Re-throw redirects; otherwise treat as auth failure
    if (e?.options?.to) throw e;
    throw redirect({ to: "/entrar", search: { redirect: location.href, reason: "no_admin" } });
  }
}
