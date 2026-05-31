import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/public-layout";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({ meta: [{ title: "Como funciona — ServiçosPRO" }] }),
  component: () => (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold">Como funciona</h1>
        <p className="mt-3 text-muted-foreground">Resolvemos pelo WhatsApp. Sem filas, sem complicação.</p>
        <ol className="mt-10 space-y-6">
          {[
            ["Escolha o serviço", "Navegue pelas categorias e selecione o que precisa."],
            ["Envie sua solicitação", "Preencha um formulário curto com seus dados e o problema."],
            ["Nossa equipe entra em contato", "Avaliamos seu pedido e encaminhamos o profissional ideal."],
            ["O profissional realiza o atendimento", "Acompanhe tudo pelo WhatsApp do começo ao fim."],
          ].map(([t, d], i) => (
            <li key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand font-display font-bold text-white">{i + 1}</div>
              <div>
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PublicLayout>
  ),
});
