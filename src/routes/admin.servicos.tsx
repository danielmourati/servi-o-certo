import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore } from "@/lib/store";
import type { Service } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/servicos")({
  head: () => ({ meta: [{ title: "Serviços — Admin" }] }),
  component: ServicosAdmin,
});

const empty: Service = { id: "", category_id: "", name: "", description: "", is_active: true };

function ServicosAdmin() {
  const { services, categories, setServices } = useStore();
  const [editing, setEditing] = useState<Service | null>(null);
  const [filter, setFilter] = useState("all");

  const save = (s: Service) => {
    if (s.id) setServices(services.map(x => x.id === s.id ? s : x));
    else setServices([...services, { ...s, id: `srv-${Date.now()}` }]);
    setEditing(null);
  };
  const remove = (id: string) => { if (confirm("Excluir serviço?")) setServices(services.filter(s => s.id !== id)); };

  const filtered = services.filter(s => filter === "all" || s.category_id === filter);

  return (
    <AdminShell title="Serviços">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => setEditing(empty)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar serviço
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Nome</th><th>Categoria</th><th>Descrição</th><th>Status</th><th className="px-4 text-right">Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const cat = categories.find(c => c.id === s.category_id);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="text-muted-foreground">{cat?.name ?? "—"}</td>
                    <td className="text-muted-foreground">{s.description}</td>
                    <td><StatusBadge status={s.is_active ? "Ativo" : "Inativo"} /></td>
                    <td className="px-4 text-right">
                      <div className="inline-flex gap-1">
                        <button onClick={() => setEditing(s)} className="rounded-lg p-2 hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(s.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{editing.id ? "Editar" : "Novo"} serviço</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block"><span className="text-sm font-medium">Nome</span>
                <input className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label className="block"><span className="text-sm font-medium">Categoria</span>
                <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={editing.category_id} onChange={e => setEditing({ ...editing, category_id: e.target.value })}>
                  <option value="">Selecione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block"><span className="text-sm font-medium">Descrição</span>
                <textarea rows={3} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} /> Ativo</label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="h-10 rounded-lg border border-border px-4 text-sm">Cancelar</button>
              <button onClick={() => save(editing)} className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
