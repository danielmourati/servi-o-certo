import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin-shell";
import { useStore } from "@/lib/store";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";
import { CategoryIcon, categoryIconNames } from "@/components/category-icon";
import { toast } from "sonner";
import type { Category } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/categorias")({
  beforeLoad: requireAdminBeforeLoad,
  head: () => ({ meta: [{ title: "Categorias — Admin" }] }),
  component: CategoriasAdmin,
});

const empty: Category = { id: "", name: "", icon: "Wrench", description: "", sort_order: 1, is_active: true };

function CategoriasAdmin() {
  const { categories, mutations } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);

  const save = async (c: Category) => {
    try { await mutations.upsertCategory(c); setEditing(null); toast.success("Categoria salva."); }
    catch (e: any) { toast.error(e.message); }
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir categoria?")) return;
    try { await mutations.deleteCategory(id); } catch (e: any) { toast.error(e.message); }
  };
  const toggle = async (c: Category) => {
    try { await mutations.upsertCategory({ ...c, is_active: !c.is_active }); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <AdminShell title="Categorias">
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({ ...empty, sort_order: categories.length + 1 })}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar categoria
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.sort((a, b) => a.sort_order - b.sort_order).map(c => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white"><CategoryIcon name={c.icon} className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-display font-semibold">{c.name}</h3>
                  <StatusBadge status={c.is_active ? "Ativo" : "Inativo"} />
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(c)} className="rounded-lg p-2 hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Ordem: {c.sort_order}</span>
              <button onClick={() => toggle(c.id)} className="text-primary hover:underline">{c.is_active ? "Inativar" : "Ativar"}</button>
            </div>
          </div>
        ))}
      </div>

      {editing && <CategoryModal category={editing} onClose={() => setEditing(null)} onSave={save} />}
    </AdminShell>
  );
}

function CategoryModal({ category, onClose, onSave }: { category: Category; onClose: () => void; onSave: (c: Category) => void }) {
  const [c, setC] = useState(category);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{category.id ? "Editar" : "Nova"} categoria</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block"><span className="text-sm font-medium">Nome</span>
            <input className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={c.name} onChange={e => setC({ ...c, name: e.target.value })} />
          </label>
          <label className="block"><span className="text-sm font-medium">Ícone</span>
            <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={c.icon} onChange={e => setC({ ...c, icon: e.target.value })}>
              {categoryIconNames.map(n => <option key={n}>{n}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-sm font-medium">Descrição</span>
            <textarea rows={3} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm" value={c.description} onChange={e => setC({ ...c, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-sm font-medium">Ordem</span>
              <input type="number" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={c.sort_order} onChange={e => setC({ ...c, sort_order: +e.target.value })} />
            </label>
            <label className="flex items-center gap-2 self-end pb-1"><input type="checkbox" checked={c.is_active} onChange={e => setC({ ...c, is_active: e.target.checked })} /> Ativa</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="h-10 rounded-lg border border-border px-4 text-sm">Cancelar</button>
          <button onClick={() => onSave(c)} className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Salvar</button>
        </div>
      </div>
    </div>
  );
}
