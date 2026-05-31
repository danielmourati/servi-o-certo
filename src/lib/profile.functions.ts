import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileInput = z.object({
  full_name: z.string().trim().max(150).default(""),
  phone: z.string().trim().max(20).default(""),
  cpf: z.string().trim().max(20).default(""),
  birth_date: z.string().trim().max(10).default(""), // ISO "YYYY-MM-DD" or ""
  city: z.string().trim().max(100).default(""),
  neighborhood: z.string().trim().max(100).default(""),
  address: z.string().trim().max(255).default(""),
  avatar_url: z.string().trim().max(500).default(""),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return data;
    // Fallback: insert empty profile if trigger somehow didn't fire
    const { data: inserted, error: insErr } = await supabase
      .from("profiles")
      .insert({ id: userId })
      .select("*")
      .single();
    if (insErr) throw new Error(insErr.message);
    return inserted;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileInput.parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const patch = {
      ...data,
      birth_date: data.birth_date === "" ? null : data.birth_date,
    };
    const { data: updated, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });
