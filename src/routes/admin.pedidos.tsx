import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, MessageCircle, Filter } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore, formatBRL } from "@/lib/store";
import type { RequestStatus, PaymentStatus, ServiceRequest } from "@/lib/mock-data";

const STATUSES: RequestStatus[] = ["Novo", "Em contato", "Orçado", "Atribuído", "Em execução", "Concluído", "Cancelado"];
const PAY_STATUSES: PaymentStatus[] = ["Pendente", "Recebido", "Pago ao prestador", "Finalizado"];

export const Route = createFileRoute("/admin/pedidos")({
  beforeLoad: (await import("@/lib/admin-guard")).requireAdminBeforeLoad,
  head: () => ({ meta: [{ title: "Pedidos — Admin" }] }),
  component: PedidosPage,
});

function PedidosPage() {
  const { requests, services, categories, providers, mutations } = useStore();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q) {
        const text = `${r.client_name} ${r.client_phone} ${r.id}`.toLowerCase();
        if (!text.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [requests, q, statusFilter]);

  const current = requests.find(r => r.id === selected);

  const update = (patch: Partial<ServiceRequest>) => {
    if (!current) return;
    mutations.updateRequest(current.id, patch);
  };

  return (
    <AdminShell title="Pedidos">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            placeholder="Buscar por cliente, telefone ou ID..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Todos os status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Status</th>
                <th>Prestador</th>
                <th className="text-right">Valor</th>
                <th className="text-right">Margem</th>
                <th className="px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const srv = services.find(s => s.id === r.service_id);
                const cat = categories.find(c => c.id === r.category_id);
                const prov = providers.find(p => p.id === r.provider_id);
                const margem = r.service_value - r.provider_payment;
                return (
                  <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td>
                      <div className="font-medium">{r.client_name}</div>
                      <div className="text-xs text-muted-foreground">{r.client_phone}</div>
                    </td>
                    <td className="text-muted-foreground">{srv?.name}</td>
                    <td className="text-muted-foreground">{cat?.name}</td>
                    <td className="text-muted-foreground">{r.preferred_date || "—"}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{prov?.name ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="text-right font-semibold">{r.service_value ? formatBRL(r.service_value) : "—"}</td>
                    <td className="text-right font-semibold text-success">{r.service_value ? formatBRL(margem) : "—"}</td>
                    <td className="px-4 text-right">
                      <button onClick={() => setSelected(r.id)} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary">Ver detalhes</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">Nenhum pedido encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
            <PedidoDetalhe req={current} update={update} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function PedidoDetalhe({ req, update, onClose }: { req: ServiceRequest; update: (p: Partial<ServiceRequest>) => void; onClose: () => void }) {
  const { services, categories, providers } = useStore();
  const srv = services.find(s => s.id === req.service_id);
  const cat = categories.find(c => c.id === req.category_id);
  const margem = req.service_value - req.provider_payment;
  const pct = req.service_value > 0 ? (margem / req.service_value) * 100 : 0;
  const whatsLink = `https://wa.me/${req.client_phone.replace(/\D/g, "")}`;
  const availableProviders = providers.filter(p => p.status === "Ativo" && (p.categories.includes(req.category_id) || p.services.includes(req.service_id)));

  return (
    <div>
      <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-5">
        <div>
          <div className="text-xs text-muted-foreground">Pedido</div>
          <h2 className="font-display text-xl font-bold">{req.id}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div><b>{req.client_name}</b></div>
            <div>{req.client_phone}</div>
            <div className="text-muted-foreground">{req.client_address}, {req.client_neighborhood} — {req.client_city}</div>
          </div>
          <a href={whatsLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-[#25D366] px-3 text-xs font-semibold text-white">
            <MessageCircle className="h-4 w-4" /> Abrir WhatsApp do cliente
          </a>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Serviço</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div><b>{srv?.name}</b></div>
            <div className="text-muted-foreground">{cat?.name}</div>
            <div className="text-muted-foreground">Preferência: {req.preferred_date} {req.preferred_time}</div>
            <div>Urgência: <StatusBadge status={req.urgency} /></div>
          </div>
        </section>

        <section className="md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição</h3>
          <p className="mt-2 rounded-lg border border-border bg-background p-3 text-sm">{req.description}</p>
        </section>

        <section>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
          <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={req.status} onChange={e => update({ status: e.target.value as RequestStatus })}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </section>
        <section>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prestador atribuído</label>
          <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={req.provider_id ?? ""} onChange={e => update({ provider_id: e.target.value || null })}>
            <option value="">— Nenhum —</option>
            {availableProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            {providers.filter(p => !availableProviders.includes(p)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </section>

        <section>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valor cobrado do cliente</label>
          <input type="number" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={req.service_value} onChange={e => update({ service_value: +e.target.value })} />
        </section>
        <section>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valor pago ao prestador</label>
          <input type="number" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={req.provider_payment} onChange={e => update({ provider_payment: +e.target.value })} />
        </section>
        <section>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status pagamento</label>
          <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={req.payment_status} onChange={e => update({ payment_status: e.target.value as PaymentStatus })}>
            {PAY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </section>
        <section>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margem bruta</div>
          <div className="mt-1 rounded-lg border border-border bg-background p-3">
            <div className="font-display text-xl font-bold text-success">{formatBRL(margem)}</div>
            <div className="text-xs text-muted-foreground">{pct.toFixed(1)}% de margem</div>
          </div>
        </section>

        <section className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Observações internas</label>
          <textarea rows={3} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm" value={req.admin_notes} onChange={e => update({ admin_notes: e.target.value })} />
        </section>
      </div>
    </div>
  );
}
