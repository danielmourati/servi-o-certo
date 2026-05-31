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
  const category = categories.find(c => c.id === id);
  if (!category) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold">Categoria não encontrada</h1>
          <Link to="/categorias" className="mt-4 inline-flex text-primary">Voltar para categorias</Link>
        </div>
      </PublicLayout>
    );
  }
  const list = services.filter(s => s.category_id === id && s.is_active);
  return (
    <PublicLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <Link to="/categorias" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar para categorias
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{category.name}</h1>
              <p className="mt-1 text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-xl font-semibold">Serviços disponíveis</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map(s => (
            <div key={s.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary transition">
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
              <Link to="/solicitar" search={{ service: s.id }}
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Solicitar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
          {list.length === 0 && <p className="text-muted-foreground">Nenhum serviço cadastrado nesta categoria.</p>}
        </div>
      </div>
    </PublicLayout>
  );
}
