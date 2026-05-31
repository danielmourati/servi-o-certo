import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const providerSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(200),
  document: z.string().max(50).default(""),
  phone: z.string().max(50).default(""),
  whatsapp: z.string().max(50).default(""),
  email: z.string().max(200).default(""),
  bio: z.string().max(5000).default(""),
  photo_url: z.string().max(2000).default(""),
  status: z.enum(["Pendente", "Ativo", "Inativo"]).default("Pendente"),
  city: z.string().max(150).default(""),
  neighborhood: z.string().max(150).default(""),
  availability: z.string().max(500).default(""),
  team: z.string().max(500).default(""),
  portfolio: z.array(z.string()).default([]),
  internal_rating: z.number().min(0).max(5).default(5),
  categories: z.array(z.string().uuid()).default([]),
  services: z.array(z.string().uuid()).default([]),
});

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listProviders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: providers, error } = await supabaseAdmin
      .from("providers")
      .select(`*, provider_categories(category_id), provider_services(service_id)`)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (providers ?? []).map((p: any) => ({
      ...p,
      categories: (p.provider_categories ?? []).map((x: any) => x.category_id),
      services: (p.provider_services ?? []).map((x: any) => x.service_id),
      portfolio: Array.isArray(p.portfolio) ? p.portfolio : [],
    }));
  });

export const upsertProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => providerSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { categories, services, id, ...rest } = data;
    const payload = { ...rest, id: id || undefined };
    const { data: row, error } = await supabaseAdmin
      .from("providers").upsert(payload).select().single();
    if (error) throw new Error(error.message);

    const providerId = row.id;

    // sync categories
    await supabaseAdmin.from("provider_categories").delete().eq("provider_id", providerId);
    if (categories.length) {
      const { error: e1 } = await supabaseAdmin
        .from("provider_categories")
        .insert(categories.map((c) => ({ provider_id: providerId, category_id: c })));
      if (e1) throw new Error(e1.message);
    }
    // sync services
    await supabaseAdmin.from("provider_services").delete().eq("provider_id", providerId);
    if (services.length) {
      const { error: e2 } = await supabaseAdmin
        .from("provider_services")
        .insert(services.map((s) => ({ provider_id: providerId, service_id: s })));
      if (e2) throw new Error(e2.message);
    }
    return { id: providerId };
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("providers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
