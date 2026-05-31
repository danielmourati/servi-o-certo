import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore, formatBRL } from "@/lib/store";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";

export const Route = createFileRoute("/admin/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — Admin" }] }),
  beforeLoad: requireAdminBeforeLoad,
  component: FinanceiroAdmin,
});

function FinanceiroAdmin() {
  const { requests, services, providers, categories } = useStore();
  const [catF, setCatF] = useState("all");
  const [provF, setProvF] = useState("all");
  const [payF, setPayF] = useState("all");

  const relevant = requests.filter(r => r.service_value > 0 || r.status === "Orçado" || r.status === "Concluído");

  const filtered = useMemo(() => relevant.filter(r =>
    (catF === "all" || r.category_id === catF) &&
    (provF === "all" || r.provider_id === provF) &&
    (payF === "all" || r.payment_status === payF)
  ), [relevant, catF, provF, payF]);

  const receita = filtered.reduce((s, r) => s + r.service_value, 0);
  const pago = filtered.reduce((s, r) => s + r.provider_payment, 0);
  const margem = receita - pago;
  const concluidos = filtered.filter(r => r.status === "Concluído").length;
  const ticket = concluidos > 0 ? receita / concluidos : 0;

  const kpis = [
    { label: "Receita total", value: formatBRL(receita), icon: DollarSign, color: "text-info bg-info/10" },
    { label: "Pago a prestadores", value: formatBRL(pago), icon: Wallet, color: "text-warning bg-warning/10" },
    { label: "Margem bruta", value: formatBRL(margem), icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Ticket médio", value: formatBRL(ticket), icon: TrendingDown, color: "text-accent bg-accent/10" },
    { label: "Serviços concluídos", value: concluidos, icon: DollarSign, color: "text-primary bg-primary/10" },
  ];

  return (
    <AdminShell title="Financeiro">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${k.color}`}><k.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 font-display text-xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={catF} onChange={e => setCatF(e.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={provF} onChange={e => setProvF(e.target.value)}>
          <option value="all">Todos os prestadores</option>
          {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={payF} onChange={e => setPayF(e.target.value)}>
          <option value="all">Todos os status de pagamento</option>
          <option>Pendente</option><option>Recebido</option><option>Pago ao prestador</option><option>Finalizado</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Prestador</th>
                <th className="text-right">Cobrado</th>
                <th className="text-right">Pago</th>
                <th className="text-right">Margem</th>
                <th className="text-right">%</th>
                <th>Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const srv = services.find(s => s.id === r.service_id);
                const prov = providers.find(p => p.id === r.provider_id);
                const m = r.service_value - r.provider_payment;
                const pct = r.service_value > 0 ? (m / r.service_value) * 100 : 0;
                return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td>{r.client_name}</td>
                    <td className="text-muted-foreground">{srv?.name}</td>
                    <td className="text-muted-foreground">{prov?.name ?? "—"}</td>
                    <td className="text-right font-semibold">{formatBRL(r.service_value)}</td>
                    <td className="text-right text-muted-foreground">{formatBRL(r.provider_payment)}</td>
                    <td className="text-right font-semibold text-success">{formatBRL(m)}</td>
                    <td className="text-right text-xs">{pct.toFixed(0)}%</td>
                    <td><StatusBadge status={r.payment_status} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">Sem registros financeiros.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
