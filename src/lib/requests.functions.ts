import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const urgencyEnum = z.enum(["Normal", "Urgente", "Emergencial"]);
const statusEnum = z.enum(["Novo","Em contato","Orçado","Atribuído","Em execução","Concluído","Cancelado"]);
const paymentEnum = z.enum(["Pendente","Recebido","Pago ao prestador","Finalizado"]);

const createRequestSchema = z.object({
  service_id: z.string().uuid().nullable(),
  category_id: z.string().uuid().nullable(),
  client_name: z.string().min(1).max(200),
  client_phone: z.string().min(1).max(50),
  client_address: z.string().max(300).default(""),
  client_neighborhood: z.string().max(150).default(""),
  client_city: z.string().max(150).default(""),
  preferred_date: z.string().max(50).default(""),
  preferred_time: z.string().max: 50 = 50 as any, // placeholder removed below
}).passthrough();

// We'll redefine cleaner:
const createRequestInput = z.object({
  service_id: z.string().uuid().nullable(),
  category_id: z.string().uuid().nullable(),
  client_name: z.string().min(1).max(200),
  client_phone: z.string().min(1).max(50),
  client_address: z.string().max(300).default(""),
  client_neighborhood: z.string().max(150).default(""),
  client_city: z.string().max(150).default(""),
  preferred_date: z.string().max(50).default(""),
  preferred_time: z.string().max(50).default(""),
  urgency: urgencyEnum.default("Normal"),
  description: z.string().max(2000).default(""),
});

const updateRequestSchema = z.object({
  id: z.string().uuid(),
  patch: z.object({
    status: statusEnum.optional(),
    payment_status: paymentEnum.optional(),
    provider_id: z.string().uuid().nullable().optional(),
    service_value: z.number().min(0).optional(),
    provider_payment: z.number().min(0).optional(),
    admin_notes: z.string().max(5000).optional(),
  }),
});

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// Public: create a service request from the form
export const createServiceRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => createRequestInput.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("service_requests")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// Admin: list all requests
export const listRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateRequestSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("service_requests").update(data.patch).eq("id", data.id).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("service_requests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
