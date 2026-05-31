import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Star, MessageCircle, MapPin, Plus, Pencil, Trash2, X } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore, formatBRL } from "@/lib/store";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";
import { toast } from "sonner";
import type { Provider, ProviderStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/prestadores")({
  head: () => ({ meta: [{ title: "Prestadores — Admin" }] }),
  beforeLoad: requireAdminBeforeLoad,
  component: PrestadoresAdmin,
});

const emptyProvider = (): Provider => ({
  id: "", name: "", document: "", phone: "", whatsapp: "", email: "",
  bio: "", photo_url: "", status: "Pendente", city: "", neighborhood: "",
  categories: [], services: [], availability: "", team: "",
  portfolio: [], internal_rating: 5,
});

function PrestadoresAdmin() {
  const { providers, categories, services, requests, mutations, loading } = useStore();
  const [statusF, setStatusF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Provider | null>(null);
  const [selected, setSelected] = useState<Provider | null>(null);

  const filtered = useMemo(() => providers.filter(p => {
    const ms = statusF === "all" || p.status === statusF;
    const mc = catF === "all" || p.categories.includes(catF);
    const mq = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.document ?? "").toLowerCase().includes(search.toLowerCase());
    return ms && mc && mq;
  }), [providers, statusF, catF, search]);

  const onSave = async (p: Provider) => {
    try {
      await mutations.upsertProvider(p);
      toast.success("Prestador salvo!");
      setEditing(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao salvar.");
    }
  };

  const onDelete = async (p: Provider) => {
    if (!confirm(`Excluir prestador ${p.name}?`)) return;
    try {
      await mutations.deleteProvider(p.id);
      toast.success("Prestador excluído.");
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao excluir.");
    }
  };

  return (
    <AdminShell title="Prestadores">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2 flex-1">
          <input
            placeholder="Buscar prestador..."
            className="h-10 rounded-lg border border-border bg-card px-4 text-sm w-full md:w-64 outline-none focus:border-primary"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">Todos os status</option>
            <option>Pendente</option><option>Ativo</option><option>Inativo</option>
          </select>
          <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm" value={catF} onChange={e => setCatF(e.target.value)}>
            <option value="all">Todas as categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={() => setEditing(emptyProvider())} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {loading.providers ? (
        <div className="py-12 text-center text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-2xl border-dashed">Nenhum prestador encontrado.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5 cursor-pointer hover:border-primary transition" onClick={() => setSelected(p)}>
              <div className="flex items-start gap-3">
                <img src={p.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`} alt={p.name} className="h-12 w-12 rounded-full border border-border object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold truncate text-sm">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city || "—"}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.bio || "Sem biografia."}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.categories.slice(0, 3).map(cid => {
                  const c = categories.find(x => x.id === cid);
                  return c && <span key={cid} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{c.name}</span>;
                })}
              </div>
              <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="font-semibold text-foreground">{(p.internal_rating ?? 5).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setEditing(p); }} className="rounded-lg p-2 hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(p); }} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <DetailsModal provider={selected} onClose={() => setSelected(null)}
          categories={categories} services={services} requests={requests} />
      )}
      {editing && (
        <ProviderForm provider={editing} categories={categories} services={services}
          onCancel={() => setEditing(null)} onSave={onSave} />
      )}
    </AdminShell>
  );
}

function ProviderForm({ provider, categories, services, onCancel, onSave }: {
  provider: Provider; categories: any[]; services: any[];
  onCancel: () => void; onSave: (p: Provider) => Promise<void>;
}) {
  const [p, setP] = useState<Provider>(provider);
  const [saving, setSaving] = useState(false);

  const filteredServices = services.filter(s => p.categories.includes(s.category_id));

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(p);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">{p.id ? "Editar" : "Novo"} prestador</h2>
          <button type="button" onClick={onCancel} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Nome *"><input required className="input" value={p.name} onChange={e => setP({ ...p, name: e.target.value })} /></Field>
          <Field label="Status"><select className="input" value={p.status} onChange={e => setP({ ...p, status: e.target.value as ProviderStatus })}>
            <option>Pendente</option><option>Ativo</option><option>Inativo</option>
          </select></Field>
          <Field label="CPF/CNPJ"><input className="input" value={p.document} onChange={e => setP({ ...p, document: e.target.value })} /></Field>
          <Field label="E-mail"><input type="email" className="input" value={p.email} onChange={e => setP({ ...p, email: e.target.value })} /></Field>
          <Field label="Telefone"><input className="input" value={p.phone} onChange={e => setP({ ...p, phone: e.target.value })} /></Field>
          <Field label="WhatsApp"><input className="input" value={p.whatsapp} onChange={e => setP({ ...p, whatsapp: e.target.value })} /></Field>
          <Field label="Cidade"><input className="input" value={p.city} onChange={e => setP({ ...p, city: e.target.value })} /></Field>
          <Field label="Bairro"><input className="input" value={p.neighborhood} onChange={e => setP({ ...p, neighborhood: e.target.value })} /></Field>
          <Field label="Disponibilidade" className="md:col-span-2"><input className="input" placeholder="Ex.: Seg a Sex, 8h às 18h" value={p.availability} onChange={e => setP({ ...p, availability: e.target.value })} /></Field>
          <Field label="Equipe" className="md:col-span-2"><input className="input" placeholder="Ex.: 2 auxiliares" value={p.team} onChange={e => setP({ ...p, team: e.target.value })} /></Field>
          <Field label="Biografia" className="md:col-span-2"><textarea rows={3} className="input" value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} /></Field>

          <div className="md:col-span-2">
            <span className="text-sm font-medium">Categorias</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map(c => (
                <button type="button" key={c.id}
                  onClick={() => setP({ ...p, categories: toggle(p.categories, c.id), services: p.services.filter(sid => services.find(s => s.id === sid)?.category_id !== c.id || toggle(p.categories, c.id).includes(c.id)) })}
                  className={`rounded-full px-3 py-1 text-xs font-medium border ${p.categories.includes(c.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <span className="text-sm font-medium">Serviços ({filteredServices.length})</span>
            {filteredServices.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">Selecione categorias para liberar serviços.</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {filteredServices.map(s => (
                  <button type="button" key={s.id}
                    onClick={() => setP({ ...p, services: toggle(p.services, s.id) })}
                    className={`rounded-full px-3 py-1 text-xs border ${p.services.includes(s.id) ? "bg-primary/10 text-primary border-primary" : "bg-card border-border"}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-card p-5">
          <button type="button" onClick={onCancel} className="h-10 rounded-lg border border-border px-4 text-sm">Cancelar</button>
          <button disabled={saving} className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Salvando..." : "Salvar"}</button>
        </div>
        <style>{`.input { width:100%; height:40px; border:1px solid var(--color-border); background:var(--color-background); padding:0 12px; border-radius:8px; font-size:14px; outline:none; }
          textarea.input { height:auto; padding:10px 12px; }`}</style>
      </form>
    </div>
  );
}

function DetailsModal({ provider, onClose, categories, services, requests }: any) {
  const hist = requests.filter((r: any) => r.provider_id === provider.id);
  const totalReceived = hist.reduce((s: number, r: any) => s + (r.provider_payment ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <img src={provider.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(provider.name)}`} alt={provider.name} className="h-14 w-14 rounded-full border border-border object-cover bg-secondary" />
            <div>
              <h2 className="font-display text-xl font-bold">{provider.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={provider.status} /> <span>•</span> <span>{provider.document || "—"}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-2">
          <Section label="Contato">
            <div className="text-sm">{provider.email || "—"}</div>
            <div className="text-sm">{provider.phone || "—"}</div>
            {provider.whatsapp && (
              <a href={`https://wa.me/${provider.whatsapp}`} target="_blank" rel="noreferrer"
                className="mt-1 inline-flex h-8 items-center gap-1 rounded-md bg-[#25D366] px-2.5 text-xs font-semibold text-white">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
          </Section>
          <Section label="Localização">
            <div className="text-sm">{provider.neighborhood ? `${provider.neighborhood}, ` : ""}{provider.city || "—"}</div>
            <div className="mt-3 text-xs text-muted-foreground">Disponibilidade: {provider.availability || "—"}</div>
            <div className="text-xs text-muted-foreground">Equipe: {provider.team || "—"}</div>
          </Section>
          <Section label="Biografia" className="md:col-span-2">
            <p className="text-sm text-muted-foreground whitespace-pre-line">{provider.bio || "—"}</p>
          </Section>
          <Section label="Serviços habilitados" className="md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {provider.services?.map((id: string) => {
                const svc = services.find((s: any) => s.id === id);
                return <span key={id} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{svc?.name ?? id}</span>;
              })}
              {(!provider.services || provider.services.length === 0) && <span className="text-xs text-muted-foreground italic">Nenhum.</span>}
            </div>
          </Section>
          <Section label="Histórico"><div className="text-sm">{hist.length} pedidos</div></Section>
          <Section label="Total recebido"><div className="font-display text-lg font-bold text-success">{formatBRL(totalReceived)}</div></Section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`flex flex-col gap-1.5 ${className ?? ""}`}><span className="text-sm font-medium">{label}</span>{children}</label>;
}
function Section({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <section className={className}><h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3><div className="mt-2">{children}</div></section>;
}
