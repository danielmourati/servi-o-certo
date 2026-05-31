import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { CategoryIcon } from "@/components/category-icon";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categorias/")({
  head: () => ({ meta: [{ title: "Categorias — ServiçosPRO" }, { name: "description", content: "Veja todas as categorias de serviços disponíveis." }] }),
  component: CategoriasPage,
});

function CategoriasPage() {
  const { categories, services } = useStore();
  const active = categories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  return (
    <PublicLayout>
      <div className="px-5 pt-2">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold">Categorias</h1>
        <p className="mt-1 text-sm text-muted-foreground">Escolha uma categoria e veja os serviços disponíveis.</p>
      </div>
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {active.map((c) => {
            const count = services.filter((s) => s.category_id === c.id && s.is_active).length;
            return (
              <Link
                key={c.id}
                to="/categorias/$id"
                params={{ id: c.id }}
                className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft transition active:scale-[0.97] hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-blue text-white shadow-blue">
                  <CategoryIcon name={c.icon} className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold leading-tight">{c.name}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">{count} serviços</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
