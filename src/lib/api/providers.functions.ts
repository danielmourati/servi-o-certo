import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "../supabase";

const providerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  document: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email("E-mail inválido").optional().nullable(),
  bio: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  status: z.enum(["Pendente", "Ativo", "Inativo"]).default("Pendente"),
  city: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  internal_rating: z.number().min(0).max(5).default(5.0),
});

const availabilityItemSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string(),
  end_time: z.string(),
});

const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome do funcionário é obrigatório"),
  role: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
});

export const getProviders = createServerFn({ method: "GET" }).handler(async () => {
  const { data: providers, error } = await supabase
    .from("providers")
    .select(`
      *,
      provider_services (service_id),
      provider_availability (*),
      provider_team_members (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching providers:", error);
    throw new Error(error.message);
  }

  return providers.map((p: any) => ({
    ...p,
    services: p.provider_services?.map((ps: any) => ps.service_id) || [],
    availability: p.provider_availability || [],
    team: p.provider_team_members || [],
  }));
});

export const getProviderById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data: { id } }) => {
    const { data: provider, error } = await supabase
      .from("providers")
      .select(`
        *,
        provider_services (service_id),
        provider_availability (*),
        provider_team_members (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching provider ${id}:`, error);
      throw new Error(error.message);
    }

    return {
      ...provider,
      services: provider.provider_services?.map((ps: any) => ps.service_id) || [],
      availability: provider.provider_availability || [],
      team: provider.provider_team_members || [],
    };
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data: { id } }) => {
    const { error } = await supabase.from("providers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting provider:", error);
      throw new Error(error.message);
    }
    return { success: true };
  });

export const upsertProvider = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      provider: providerSchema,
      services: z.array(z.string()),
      availability: z.array(availabilityItemSchema),
      team: z.array(teamMemberSchema),
    })
  )
  .handler(async ({ data: { provider, services, availability, team } }) => {
    // 1. Upsert provider basic details
    const isNew = !provider.id;
    const { data: savedProvider, error: providerError } = await supabase
      .from("providers")
      .upsert({
        ...provider,
        id: provider.id || undefined,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (providerError) {
      console.error("Error upserting provider:", providerError);
      throw new Error(providerError.message);
    }

    const providerId = savedProvider.id;

    // 2. Sync services/specialties (many-to-many)
    // First, delete existing services for this provider
    const { error: deleteServicesError } = await supabase
      .from("provider_services")
      .delete()
      .eq("provider_id", providerId);

    if (deleteServicesError) {
      console.error("Error clearing provider services:", deleteServicesError);
      throw new Error(deleteServicesError.message);
    }

    if (services.length > 0) {
      const { error: insertServicesError } = await supabase
        .from("provider_services")
        .insert(services.map((serviceId) => ({ provider_id: providerId, service_id: serviceId })));

      if (insertServicesError) {
        console.error("Error inserting provider services:", insertServicesError);
        throw new Error(insertServicesError.message);
      }
    }

    // 3. Sync availability
    const { error: deleteAvailError } = await supabase
      .from("provider_availability")
      .delete()
      .eq("provider_id", providerId);

    if (deleteAvailError) {
      console.error("Error clearing provider availability:", deleteAvailError);
      throw new Error(deleteAvailError.message);
    }

    if (availability.length > 0) {
      const { error: insertAvailError } = await supabase
        .from("provider_availability")
        .insert(
          availability.map((item) => ({
            provider_id: providerId,
            day_of_week: item.day_of_week,
            start_time: item.start_time,
            end_time: item.end_time,
          }))
        );

      if (insertAvailError) {
        console.error("Error inserting provider availability:", insertAvailError);
        throw new Error(insertAvailError.message);
      }
    }

    // 4. Sync team members
    // We can delete and recreate or do upsert. Since it's easier to sync, let's delete existing ones not present, or just delete and recreate if no long-term references exist.
    // Let's delete all and insert the new list to keep it simple and clean.
    const { error: deleteTeamError } = await supabase
      .from("provider_team_members")
      .delete()
      .eq("provider_id", providerId);

    if (deleteTeamError) {
      console.error("Error clearing provider team members:", deleteTeamError);
      throw new Error(deleteTeamError.message);
    }

    if (team.length > 0) {
      const { error: insertTeamError } = await supabase
        .from("provider_team_members")
        .insert(
          team.map((member) => ({
            provider_id: providerId,
            name: member.name,
            role: member.role || null,
            phone: member.phone || null,
            email: member.email || null,
          }))
        );

      if (insertTeamError) {
        console.error("Error inserting provider team members:", insertTeamError);
        throw new Error(insertTeamError.message);
      }
    }

    return { id: providerId };
  });
