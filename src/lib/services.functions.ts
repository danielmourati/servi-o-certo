import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const serviceSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().default(""),
  is_active: z.boolean().default(true),
});

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("services").select("*").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => serviceSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload = { ...data, id: data.id || undefined };
    const { data: row, error } = await supabaseAdmin
      .from("services").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
