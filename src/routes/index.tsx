import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, MessageCircle, Clock, Sparkles } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { CategoryIcon } from "@/components/category-icon";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ServiçosPRO — Profissionais para reformas, reparos e manutenção" },
      { name: "description", content: "Solicite pedreiro, eletricista, encanador, pintor, gesseiro e mais. Atendimento rápido pelo WhatsApp." },
    ],
  }),
  component: Index,
});

function Index() {
  const { categories, services } = useStore();
  const active = categories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const quickPick = active.slice(0, 8);
  const featured = active.slice(0, 4);

  return (
    <PublicLayout>
      {/* Hero card */}
      <section className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-blue p-6 text-white shadow-card">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Atendimento rápido
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight">
            Serviços de confiança<br />perto de você
          </h1>
          <p className="mt-2 max-w-[260px] text-sm text-white/90">
            Solicite reformas, reparos e manutenção em minutos pelo WhatsApp.
          </p>
          <Link
            to="/solicitar"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-blue-600 shadow-lg transition active:scale-[0.97]"
          >
            Solicitar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick categories grid */}
      <section className="px-5 pt-7">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-base font-bold">Selecione uma categoria</h2>
          <Link to="/categorias" className="text-xs font-semibold text-blue-600">Ver todas</Link>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {quickPick.map((c) => (
            <Link
              key={c.id}
              to="/categorias/$id"
              params={{ id: c.id }}
              className="group flex flex-col items-center gap-2 transition active:scale-95"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-soft transition group-hover:bg-gradient-blue group-hover:text-white">
                <CategoryIcon name={c.icon} className="h-6 w-6" />
              </div>
              <span className="text-center text-[11px] font-medium leading-tight text-foreground line-clamp-2">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured large cards */}
      <section className="px-5 pt-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-base font-bold">Categorias em destaque</h2>
          <Link to="/categorias" className="text-xs font-semibold text-blue-600">Ver todas</Link>
        </div>
        <div className="mt-4 space-y-4">
          {featured.map((c) => {
            const count = services.filter((s) => s.category_id === c.id && s.is_active).length;
            return (
              <Link
                key={c.id}
                to="/categorias/$id"
                params={{ id: c.id }}
                className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition active:scale-[0.98] hover:-translate-y-0.5"
              >
                <div className="flex items-stretch">
                  <div className="relative flex w-28 shrink-0 items-center justify-center bg-gradient-blue text-white">
                    <CategoryIcon name={c.icon} className="h-12 w-12 opacity-90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-display text-base font-bold">{c.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">{count} serviços</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                        Ver <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-5 pt-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { i: ShieldCheck, t: "Selecionados" },
            { i: Clock, t: "Rápido" },
            { i: MessageCircle, t: "WhatsApp" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 shadow-soft">
              <s.i className="h-5 w-5 text-blue-600" />
              <span className="mt-1.5 text-[11px] font-semibold">{s.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pt-8">
        <h2 className="font-display text-base font-bold">Como funciona</h2>
        <div className="mt-4 space-y-3">
          {[
            { n: "1", t: "Escolha o serviço", d: "Navegue pelas categorias." },
            { n: "2", t: "Envie sua solicitação", d: "Preencha um formulário rápido." },
            { n: "3", t: "Recebemos seu pedido", d: "Encaminhamos o profissional ideal." },
            { n: "4", t: "Atendimento confirmado", d: "Acompanhe tudo pelo WhatsApp." },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-blue text-sm font-bold text-white">{s.n}</div>
              <div>
                <h3 className="font-display text-sm font-semibold">{s.t}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-blue p-6 text-white shadow-card">
          <h2 className="font-display text-lg font-bold">Pronto para começar?</h2>
          <p className="mt-1 text-sm text-white/90">Receba retorno em minutos.</p>
          <Link
            to="/solicitar"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-blue-600 transition active:scale-[0.97]"
          >
            Solicitar serviço <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
