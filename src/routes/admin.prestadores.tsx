import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { X, Star, MessageCircle, MapPin, Briefcase } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore, formatBRL } from "@/lib/store";
import type { Provider } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/prestadores")({
  head: () => ({ meta: [{ title: "Prestadores — Admin" }] }),
  component: PrestadoresAdmin,
});

function PrestadoresAdmin() {
  const { providers, categories, requests } = useStore();
  const [statusF, setStatusF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [cityF, setCityF] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const cities = useMemo(() => Array.from(new Set(providers.map(p => p.city))), [providers]);

  const filtered = providers.filter(p =>
    (statusF === "all" || p.status === statusF) &&
    (catF === "all" || p.categories.includes(catF)) &&
    (cityF === "all" || p.city === cityF)
  );

  const current = providers.find(p => p.id === selected);

  return (
    <AdminShell title="Prestadores">
      <div className="mb-4 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">Todos os status</option>
          <option>Pendente</option><option>Ativo</option><option>Inativo</option>
        </select>
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={catF} onChange={e => setCatF(e.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={cityF} onChange={e => setCityF(e.target.value)}>
          <option value="all">Todas as cidades</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => {
          const catNames = p.categories.map(id => categories.find(c => c.id === id)?.name).filter(Boolean);
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary hover:shadow-md">
              <div className="flex items-start gap-3">
                <img src={p.photo_url} alt={p.name} className="h-12 w-12 rounded-full border border-border" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.neighborhood}, {p.city}
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {catNames.slice(0, 3).map(n => <span key={n} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{n}</span>)}
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{p.internal_rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">avaliação interna</span>
              </div>
            </button>
          );
        })}
      </div>

      {current && <ProviderModal provider={current} onClose={() => setSelected(null)} />}
    </AdminShell>
  );
}

function ProviderModal({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const { categories, services, requests } = useStore();
  const hist = requests.filter(r => r.provider_id === provider.id);
  const totalReceived = hist.reduce((s, r) => s + r.provider_payment, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <img src={provider.photo_url} alt={provider.name} className="h-14 w-14 rounded-full border border-border" />
            <div>
              <h2 className="font-display text-xl font-bold">{provider.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={provider.status} />
                <span>•</span>
                <span>{provider.document}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contato</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div>{provider.email}</div>
              <div>{provider.phone}</div>
              <a href={`https://wa.me/${provider.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md bg-[#25D366] px-2 text-xs font-semibold text-white">
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Localização</h3>
            <div className="mt-2 text-sm">{provider.neighborhood}, {provider.city}</div>
            <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponibilidade</h3>
            <div className="mt-2 text-sm">{provider.availability}</div>
            <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipe</h3>
            <div className="mt-2 text-sm">{provider.team}</div>
          </section>
          <section className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</h3>
            <p className="mt-2 text-sm">{provider.bio}</p>
          </section>
          <section className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Especialidades</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {provider.categories.map(id => <span key={id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{categories.find(c => c.id === id)?.name}</span>)}
              {provider.services.map(id => <span key={id} className="rounded-full bg-secondary px-3 py-1 text-xs">{services.find(s => s.id === id)?.name}</span>)}
            </div>
          </section>
          <section className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfólio</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(provider.portfolio.length ? provider.portfolio : Array(3).fill("")).map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-secondary">
                  {src ? <img src={src} className="h-full w-full object-cover" alt="" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Briefcase className="h-6 w-6" /></div>}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Histórico</h3>
            <div className="mt-2 text-sm">{hist.length} pedidos atribuídos</div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total recebido</h3>
            <div className="mt-2 font-display text-xl font-bold text-success">{formatBRL(totalReceived)}</div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avaliação interna</h3>
            <div className="mt-2 flex items-center gap-1 text-lg"><Star className="h-5 w-5 fill-warning text-warning" /><b>{provider.internal_rating.toFixed(1)}</b></div>
          </section>
        </div>
      </div>
    </div>
  );
}
