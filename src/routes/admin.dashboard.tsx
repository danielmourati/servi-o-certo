import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList, TrendingUp, DollarSign, Users, Activity, ArrowUpRight, PlusCircle,
} from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore, formatBRL } from "@/lib/store";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ServiçosPRO Admin" }] }),
  beforeLoad: requireAdminBeforeLoad,
  component: Dashboard,
});

function Dashboard() {
  const { requests, providers, services, categories } = useStore();

  const total = requests.length;
  const novos = requests.filter(r => r.status === "Novo").length;
  const andamento = requests.filter(r => ["Em contato", "Orçado", "Atribuído", "Em execução"].includes(r.status)).length;
  const concluidos = requests.filter(r => r.status === "Concluído").length;
  const receita = requests.reduce((s, r) => s + (r.service_value || 0), 0);
  const pago = requests.reduce((s, r) => s + (r.provider_payment || 0), 0);
  const margem = receita - pago;
  const prestadoresAtivos = providers.filter(p => p.status === "Ativo").length;

  const byStatus = ["Novo", "Em contato", "Orçado", "Atribuído", "Em execução", "Concluído", "Cancelado"]
    .map(s => ({ s, n: requests.filter(r => r.status === s).length }));
  const maxByStatus = Math.max(1, ...byStatus.map(b => b.n));

  const serviceCount = services.map(s => ({
    name: s.name,
    n: requests.filter(r => r.service_id === s.id).length,
  })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5);

  const categoryCount = categories.map(c => ({
    name: c.name,
    n: requests.filter(r => r.category_id === c.id).length,
  })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5);

  const recent = [...requests].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);

  const kpis = [
    { label: "Total de pedidos", value: total, icon: ClipboardList, color: "text-info bg-info/10" },
    { label: "Novos pedidos", value: novos, icon: PlusCircle, color: "text-warning bg-warning/10" },
    { label: "Em andamento", value: andamento, icon: Activity, color: "text-accent bg-accent/10" },
    { label: "Concluídos", value: concluidos, icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Receita total", value: formatBRL(receita), icon: DollarSign, color: "text-primary bg-primary/10" },
    { label: "Pago a prestadores", value: formatBRL(pago), icon: DollarSign, color: "text-info bg-info/10" },
    { label: "Margem bruta", value: formatBRL(margem), icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Prestadores ativos", value: prestadoresAtivos, icon: Users, color: "text-accent bg-accent/10" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${k.color}`}><k.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Pedidos por status</h2>
          <div className="mt-4 space-y-3">
            {byStatus.map(b => (
              <div key={b.s}>
                <div className="flex justify-between text-sm">
                  <span>{b.s}</span><span className="font-semibold">{b.n}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${(b.n / maxByStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Top serviços solicitados</h2>
          <div className="mt-4 space-y-3">
            {serviceCount.length === 0 && <p className="text-sm text-muted-foreground">Sem dados ainda.</p>}
            {serviceCount.map(s => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-background p-3 text-sm">
                <span>{s.name}</span>
                <span className="font-semibold text-primary">{s.n}</span>
              </div>
            ))}
          </div>
          <h3 className="mt-6 font-display text-base font-semibold">Categorias mais procuradas</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryCount.map(c => (
              <span key={c.name} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
                {c.name} <span className="text-primary font-bold">{c.n}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Pedidos recentes</h2>
          <Link to="/admin/pedidos" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Ver todos <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="py-2">ID</th><th>Cliente</th><th>Serviço</th><th>Status</th><th className="text-right">Valor</th></tr>
            </thead>
            <tbody>
              {recent.map(r => {
                const srv = services.find(s => s.id === r.service_id);
                return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-3 font-mono text-xs">{r.id}</td>
                    <td>{r.client_name}</td>
                    <td className="text-muted-foreground">{srv?.name ?? "—"}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-right font-semibold">{r.service_value ? formatBRL(r.service_value) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
