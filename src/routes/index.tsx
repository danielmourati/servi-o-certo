import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, MessageCircle, Clock, Users } from "lucide-react";
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
  const { categories } = useStore();
  const featured = categories.filter(c => c.is_active).slice(0, 6);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-info/5 to-accent/10" />
        <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-info/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Atendimento local rápido
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Encontre profissionais para <span className="text-gradient-brand">reformas, reparos</span> e manutenção
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Solicite serviços de pedreiro, eletricista, encanador, pintor, gesseiro e muito mais. Nossa equipe recebe seu pedido, entende sua necessidade e encaminha o profissional ideal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/solicitar" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90">
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/categorias" className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-6 text-sm font-semibold hover:bg-secondary">
                Ver categorias
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Profissionais selecionados</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-info" /> Resposta rápida</span>
              <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-warning" /> Atendimento por WhatsApp</span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {featured.map((c, i) => (
                <Link key={c.id} to="/categorias/$id" params={{ id: c.id }}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ transform: `translateY(${i % 2 === 0 ? "0" : "20px"})` }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <CategoryIcon name={c.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorias destaque */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Categorias em destaque</h2>
            <p className="mt-2 text-muted-foreground">Encontre o profissional certo para o seu projeto.</p>
          </div>
          <Link to="/categorias" className="text-sm font-semibold text-primary hover:underline">Ver todas →</Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.filter(c => c.is_active).slice(0, 6).map(c => (
            <Link key={c.id} to="/categorias/$id" params={{ id: c.id }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white">
                <CategoryIcon name={c.icon} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Ver serviços <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Como funciona</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Em quatro passos simples até o seu serviço resolvido.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { n: "1", t: "Escolha o serviço", d: "Navegue pelas categorias e encontre o serviço que precisa." },
              { n: "2", t: "Envie sua solicitação", d: "Preencha um formulário rápido com os detalhes." },
              { n: "3", t: "Nossa equipe entra em contato", d: "Avaliamos seu pedido e encaminhamos o profissional ideal." },
              { n: "4", t: "O profissional realiza o atendimento", d: "Você acompanha tudo pelo WhatsApp." },
            ].map(s => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand font-display text-base font-bold text-white">{s.n}</div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confiança */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { i: ShieldCheck, t: "Profissionais selecionados", d: "Curadoria interna rigorosa." },
            { i: Users, t: "Atendimento local", d: "Equipes prontas na sua cidade." },
            { i: Clock, t: "Solicitação rápida", d: "Receba retorno em minutos." },
            { i: MessageCircle, t: "Acompanhamento por WhatsApp", d: "Comunicação direta e ágil." },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.i className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-14">
          <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Precisa de um reparo ou reforma?</h2>
              <p className="mt-2 text-white/90">Solicite agora e nossa equipe entra em contato pelo WhatsApp.</p>
            </div>
            <Link to="/solicitar" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-primary shadow-lg hover:bg-white/90">
              Solicitar serviço <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
