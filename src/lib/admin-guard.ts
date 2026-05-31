import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireAdminBeforeLoad({ location }: { location: { href: string } }) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw redirect({ to: "/entrar", search: { redirect: location.href } });
  }
  const { data: row } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!row) {
    throw redirect({ to: "/entrar", search: { redirect: location.href, reason: "no_admin" } });
  }
}
