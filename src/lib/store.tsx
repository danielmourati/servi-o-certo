// Centralised data access backed by Supabase via TanStack Query.
// Exposes the same shape as the previous local store, but `categories`,
// `services`, `providers`, `requests` are fetched from the DB and the
// mutation helpers call server functions.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { listCategories, upsertCategory, deleteCategory } from "./categories.functions";
import { listServices, upsertService, deleteService } from "./services.functions";
import { listProviders, upsertProvider, deleteProvider } from "./providers.functions";
import { listRequests, createServiceRequest, updateRequest, deleteRequest } from "./requests.functions";

import type { Category, Service, Provider, ServiceRequest } from "./mock-data";

export function formatBRL(v: number) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function useStore() {
  const qc = useQueryClient();
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    return () => subscription.unsubscribe();
  }, []);


  const listCategoriesFn = useServerFn(listCategories);
  const listServicesFn = useServerFn(listServices);
  const listProvidersFn = useServerFn(listProviders);
  const listRequestsFn = useServerFn(listRequests);

  const upsertCategoryFn = useServerFn(upsertCategory);
  const deleteCategoryFn = useServerFn(deleteCategory);
  const upsertServiceFn = useServerFn(upsertService);
  const deleteServiceFn = useServerFn(deleteService);
  const upsertProviderFn = useServerFn(upsertProvider);
  const deleteProviderFn = useServerFn(deleteProvider);
  const createRequestFn = useServerFn(createServiceRequest);
  const updateRequestFn = useServerFn(updateRequest);
  const deleteRequestFn = useServerFn(deleteRequest);

  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => listCategoriesFn() });
  const servicesQ = useQuery({ queryKey: ["services"], queryFn: () => listServicesFn() });
  // Providers and requests are admin-only — these queries fail without an admin
  // session, but routes guarding them ensure that's only attempted from /admin.
  const providersQ = useQuery({ queryKey: ["providers"], queryFn: () => listProvidersFn(), retry: false, enabled: hasSession });
  const requestsQ = useQuery({ queryKey: ["requests"], queryFn: () => listRequestsFn(), retry: false, enabled: hasSession });

  const categories = (categoriesQ.data ?? []) as Category[];
  const services = (servicesQ.data ?? []) as Service[];
  const providers = (providersQ.data ?? []) as Provider[];
  const requests = (requestsQ.data ?? []) as ServiceRequest[];

  const invalidate = (key: string) => qc.invalidateQueries({ queryKey: [key] });

  const mutations = useMemo(() => ({
    async upsertCategory(input: Partial<Category> & { name: string; icon: string }) {
      const res = await upsertCategoryFn({
        data: {
          id: input.id ?? null,
          name: input.name,
          icon: input.icon,
          description: input.description ?? "",
          sort_order: input.sort_order ?? 1,
          is_active: input.is_active ?? true,
        },
      });
      invalidate("categories");
      return res;
    },
    async deleteCategory(id: string) {
      await deleteCategoryFn({ data: { id } });
      invalidate("categories");
    },
    async upsertService(input: Partial<Service> & { name: string; category_id: string }) {
      const res = await upsertServiceFn({
        data: {
          id: input.id ?? null,
          category_id: input.category_id,
          name: input.name,
          description: input.description ?? "",
          is_active: input.is_active ?? true,
        },
      });
      invalidate("services");
      return res;
    },
    async deleteService(id: string) {
      await deleteServiceFn({ data: { id } });
      invalidate("services");
    },
    async upsertProvider(input: Provider) {
      const res = await upsertProviderFn({
        data: {
          id: input.id?.startsWith("prov-") ? null : (input.id ?? null),
          name: input.name,
          document: input.document ?? "",
          phone: input.phone ?? "",
          whatsapp: input.whatsapp ?? "",
          email: input.email ?? "",
          bio: input.bio ?? "",
          photo_url: input.photo_url ?? "",
          status: input.status ?? "Pendente",
          city: input.city ?? "",
          neighborhood: input.neighborhood ?? "",
          availability: input.availability ?? "",
          team: input.team ?? "",
          portfolio: input.portfolio ?? [],
          internal_rating: input.internal_rating ?? 5,
          categories: input.categories ?? [],
          services: input.services ?? [],
        },
      });
      invalidate("providers");
      return res;
    },
    async deleteProvider(id: string) {
      await deleteProviderFn({ data: { id } });
      invalidate("providers");
    },
    async createRequest(input: {
      service_id: string; category_id: string;
      client_name: string; client_phone: string;
      client_address: string; client_neighborhood: string; client_city: string;
      preferred_date: string; preferred_time: string;
      urgency: "Normal" | "Urgente" | "Emergencial";
      description: string;
    }) {
      const row = await createRequestFn({ data: input });
      invalidate("requests");
      return row as ServiceRequest;
    },
    async updateRequest(id: string, patch: Partial<ServiceRequest>) {
      await updateRequestFn({
        data: {
          id,
          patch: {
            status: patch.status,
            payment_status: patch.payment_status,
            provider_id: patch.provider_id ?? undefined,
            service_value: patch.service_value,
            provider_payment: patch.provider_payment,
            admin_notes: patch.admin_notes,
          },
        },
      });
      invalidate("requests");
    },
    async deleteRequest(id: string) {
      await deleteRequestFn({ data: { id } });
      invalidate("requests");
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    categories, services, providers, requests,
    loading: {
      categories: categoriesQ.isLoading,
      services: servicesQ.isLoading,
      providers: providersQ.isLoading,
      requests: requestsQ.isLoading,
    },
    mutations,
  };
}
