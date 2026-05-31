import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { CategoryIcon } from "@/components/category-icon";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categorias/$id")({
  component: CategoriaDetalhePage,
});

function CategoriaDetalhePage() {
  const { id } = useParams({ from: "/categorias/$id" });
  const { categories, services } = useStore();
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return (
      <PublicLayout>
        <div className="px-5 py-12 text-center">
          <h1 className="font-display text-xl font-semibold">Categoria não encontrada</h1>
          <Link to="/categorias" className="mt-4 inline-flex text-sm text-blue-600">Voltar</Link>
        </div>
      </PublicLayout>
    );
  }
  const list = services.filter((s) => s.category_id === id && s.is_active);
  return (
    <PublicLayout>
      <div className="px-5 pt-2">
        <Link to="/categorias" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-blue p-5 text-white shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">{category.name}</h1>
              <p className="mt-0.5 text-xs text-white/85 line-clamp-2">{category.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pt-6">
        <h2 className="font-display text-base font-bold">Serviços disponíveis</h2>
        <div className="mt-4 space-y-3">
          {list.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition active:scale-[0.98]">
              <div className="flex-1">
                <h3 className="font-display text-sm font-semibold">{s.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              </div>
              <Link
                to="/solicitar"
                search={{ service: s.id }}
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-gradient-blue px-3 text-xs font-semibold text-white shadow-blue transition active:scale-95"
              >
                Solicitar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado nesta categoria.</p>}
        </div>
      </div>
    </PublicLayout>
  );
}
