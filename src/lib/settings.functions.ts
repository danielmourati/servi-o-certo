import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

const settingsSchema = z.object({
  company_name: z.string().max(120).default("ServiçosPRO"),
  company_document: z.string().max(40).default(""),
  company_email: z.string().max(160).default(""),
  company_phone: z.string().max(40).default(""),
  support_whatsapp: z.string().max(40).default(""),
  company_address: z.string().max(240).default(""),
  company_city: z.string().max(120).default(""),
  business_hours: z.string().max(160).default(""),
  default_commission_pct: z.number().min(0).max(100).default(20),
  notify_email: z.string().max(160).default(""),
  notify_new_request: z.boolean().default(true),
  primary_color: z.string().max(20).default("#3B82F6"),
  logo_url: z.string().max(500).default(""),
  whatsapp_api_url: z.string().max(500).default(""),
  whatsapp_api_token: z.string().max(500).default(""),
});

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from("app_settings")
        .insert({ id: "default" })
        .select()
        .single();
      if (insErr) throw new Error(insErr.message);
      return inserted;
    }
    return data;
  });

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("app_settings")
      .update(data)
      .eq("id", "default")
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
