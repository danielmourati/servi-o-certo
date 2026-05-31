import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { X, Star, MessageCircle, MapPin, Briefcase, Plus, Pencil, Trash2, Calendar, Users as UsersIcon, AlertTriangle } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { ProviderFormModal } from "@/components/ProviderFormModal";
import { useStore, formatBRL } from "@/lib/store";
import { getProviders, upsertProvider, deleteProvider } from "@/lib/api/providers.functions";
import { toast } from "sonner";
import type { Category, Service } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/prestadores")({
  head: () => ({ meta: [{ title: "Prestadores — Admin" }] }),
  component: PrestadoresAdmin,
});

type AvailabilityItem = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

function PrestadoresAdmin() {
  const { categories, services, requests } = useStore();
  
  // React Query hooks for Supabase CRUD
  const fetchProvidersFn = useServerFn(getProviders);
  const upsertProviderFn = useServerFn(upsertProvider);
  const deleteProviderFn = useServerFn(deleteProvider);
  const queryClient = useQueryClient();

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: () => fetchProvidersFn(),
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => upsertProviderFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Prestador salvo com sucesso!");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Erro ao salvar prestador: " + err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProviderFn({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Prestador excluído com sucesso!");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Erro ao excluir prestador: " + err.message);
    },
  });

  const [statusF, setStatusF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [cityF, setCityF] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fallback to local store if Supabase fails/not configured
  const localStore = useStore();
  const isSupabaseError = providersQuery.isError;
  
  const providersData = useMemo(() => {
    if (providersQuery.data && providersQuery.data.length > 0) {
      return providersQuery.data;
    }
    // Fallback to mock data from localStorage store
    return localStore.providers.map(p => ({
      ...p,
      availability: p.availability ? [{ day_of_week: 1, start_time: "08:00", end_time: "18:00" }] : [],
      team: p.team ? [{ name: p.team, role: "Auxiliar" }] : [],
    }));
  }, [providersQuery.data, localStore.providers]);

  const cities = useMemo(() => Array.from(new Set(providersData.map((p: any) => p.city).filter(Boolean))), [providersData]);

  const filtered = useMemo(() => {
    return providersData.filter((p: any) => {
      const matchStatus = statusF === "all" || p.status === statusF;
      const matchCat = catF === "all" || p.categories?.includes(catF) || p.services?.some((sId: string) => {
        const svc = services.find(s => s.id === sId);
        return svc?.category_id === catF;
      });
      const matchCity = cityF === "all" || p.city === cityF;
      const matchSearch = !search || 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.document?.toLowerCase().includes(search.toLowerCase()) || 
        p.phone?.toLowerCase().includes(search.toLowerCase());
      
      return matchStatus && matchCat && matchCity && matchSearch;
    });
  }, [providersData, statusF, catF, cityF, search, services]);

  const current = providersData.find((p: any) => p.id === selected);

  const handleEditClick = (provider: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(provider);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Excluir prestador ${name}? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveProvider = async (formData: any) => {
    await upsertMutation.mutateAsync(formData);
  };

  return (
    <AdminShell title="Prestadores">
      {isSupabaseError && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold block">Aviso: Conectando usando Dados de Demonstração</span>
            Não foi possível carregar do Supabase (certifique-se de configurar VITE_SUPABASE_ANON_KEY no arquivo .env). 
            As alterações serão salvas temporariamente no navegador.
          </div>
        </div>
      )}

      {/* Action Bar & Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <input
            type="text"
            placeholder="Buscar prestador..."
            className="h-10 rounded-lg border border-border bg-card px-4 text-sm w-full md:w-64 outline-none focus:border-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">Todos os status</option>
            <option>Pendente</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
          <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none" value={catF} onChange={e => setCatF(e.target.value)}>
            <option value="all">Todas as categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none" value={cityF} onChange={e => setCityF(e.target.value)}>
            <option value="all">Todas as cidades</option>
            {cities.map((c: any) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={handleCreateClick} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary-hover transition shrink-0">
          <Plus className="h-4 w-4" /> Adicionar Prestador
        </button>
      </div>

      {/* Grid of Providers */}
      {providersQuery.isLoading && !isSupabaseError ? (
        <div className="py-12 text-center text-muted-foreground">Carregando prestadores...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-2xl border-dashed">Nenhum prestador encontrado com os filtros selecionados.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p: any) => {
            const catNames = p.categories 
              ? p.categories.map((id: string) => categories.find(c => c.id === id)?.name).filter(Boolean)
              : Array.from(new Set(p.services?.map((sId: string) => {
                  const svc = services.find(s => s.id === sId);
                  return categories.find(c => c.id === svc?.category_id)?.name;
                }).filter(Boolean) || []));

            return (
              <div key={p.id} onClick={() => setSelected(p.id)} className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary hover:shadow-md cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3">
                    <img src={p.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`} alt={p.name} className="h-12 w-12 rounded-full border border-border object-cover bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold truncate text-sm sm:text-base">{p.name}</h3>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> <span className="truncate">{p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city || "—"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-3 line-clamp-2 text-xs sm:text-sm text-muted-foreground">{p.bio || "Sem biografia cadastrada."}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {catNames.slice(0, 3).map((n: any) => (
                      <span key={n} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{n}</span>
                    ))}
                    {catNames.length > 3 && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{catNames.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="font-semibold text-foreground">{(p.internal_rating || 5.0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => handleEditClick(p, e)} className="rounded-lg p-2 hover:bg-secondary text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => handleDeleteClick(p.id, p.name, e)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {current && <ProviderDetailsModal provider={current} onClose={() => setSelected(null)} categories={categories} services={services} requests={requests} />}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <ProviderFormModal
          provider={editing}
          categories={categories}
          services={services}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveProvider}
        />
      )}
    </AdminShell>
  );
}

function ProviderDetailsModal({ provider, onClose, categories, services, requests }: { provider: any; onClose: () => void; categories: Category[]; services: Service[]; requests: any[] }) {
  const hist = requests.filter(r => r.provider_id === provider.id);
  const totalReceived = hist.reduce((s, r) => s + r.provider_payment, 0);

  // Format Availability String
  const formatAvailability = (items: AvailabilityItem[]) => {
    if (!items || items.length === 0) return "Não configurada";
    const daysName = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return items
      .map(item => `${daysName[item.day_of_week]}: ${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`)
      .join(", ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <img src={provider.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(provider.name)}`} alt={provider.name} className="h-14 w-14 rounded-full border border-border object-cover bg-secondary" />
            <div>
              <h2 className="font-display text-xl font-bold">{provider.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={provider.status} />
                <span>•</span>
                <span>{provider.document || "CPF/CNPJ não informado"}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contato</h3>
            <div className="mt-2 space-y-1.5 text-sm">
              <div>{provider.email || "Sem e-mail cadastrado"}</div>
              <div>{provider.phone || "Sem telefone cadastrado"}</div>
              {provider.whatsapp && (
                <a href={`https://wa.me/${provider.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md bg-[#25D366] px-2.5 text-xs font-semibold text-white hover:opacity-90 transition mt-1">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              )}
            </div>
          </section>
          
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Localização</h3>
            <div className="mt-2 text-sm">{provider.neighborhood ? `${provider.neighborhood}, ` : ""}{provider.city || "—"}</div>
            
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Disponibilidade
            </h3>
            <div className="mt-1.5 text-xs text-muted-foreground font-medium">
              {typeof provider.availability === "string" ? provider.availability : formatAvailability(provider.availability)}
            </div>
            
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <UsersIcon className="h-3.5 w-3.5" /> Equipe / Funcionários ({provider.team?.length || 0})
            </h3>
            <div className="mt-1.5 text-xs space-y-1">
              {Array.isArray(provider.team) ? (
                provider.team.map((member: any, i: number) => (
                  <div key={i} className="bg-secondary/50 rounded px-2 py-1 flex items-center justify-between">
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-muted-foreground">{member.role || "Auxiliar"}</span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground italic">{provider.team || "Individual"}</span>
              )}
            </div>
          </section>
          
          <section className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biografia</h3>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{provider.bio || "Sem biografia cadastrada."}</p>
          </section>
          
          <section className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Especialidades & Serviços Habilitados</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {provider.services?.map((id: string) => {
                const svc = services.find(s => s.id === id);
                return (
                  <span key={id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {svc?.name || id}
                  </span>
                );
              })}
              {(!provider.services || provider.services.length === 0) && (
                <span className="text-xs text-muted-foreground italic">Nenhuma especialidade vinculada.</span>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Histórico</h3>
            <div className="mt-2 text-sm">{hist.length} pedidos atribuídos</div>
          </section>
          
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total recebido</h3>
            <div className="mt-2 font-display text-lg font-bold text-success">{formatBRL(totalReceived)}</div>
          </section>
          
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avaliação interna</h3>
            <div className="mt-2 flex items-center gap-1 text-lg">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <b>{(provider.internal_rating || 5.0).toFixed(1)}</b>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
