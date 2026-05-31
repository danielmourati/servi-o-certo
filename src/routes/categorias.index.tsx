import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { CategoryIcon } from "@/components/category-icon";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categorias/")({
  head: () => ({ meta: [{ title: "Categorias — ServiçosPRO" }, { name: "description", content: "Veja todas as categorias de serviços disponíveis." }] }),
  component: CategoriasPage,
});

function CategoriasPage() {
  const { categories, services } = useStore();
  const active = categories.filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  return (
    <PublicLayout>
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Categorias de serviços</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Escolha uma categoria e veja todos os serviços disponíveis. Você solicita, nossa equipe encaminha o profissional ideal.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active.map(c => {
            const count = services.filter(s => s.category_id === c.id && s.is_active).length;
            return (
              <div key={c.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
                    <CategoryIcon name={c.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{count} serviços disponíveis</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <Link to="/categorias/$id" params={{ id: c.id }}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-semibold text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  Ver serviços <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
