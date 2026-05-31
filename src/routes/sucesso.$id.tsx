import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/public-layout";
import { useStore } from "@/lib/store";
import { ADMIN_WHATSAPP, type ServiceRequest } from "@/lib/mock-data";

export const Route = createFileRoute("/sucesso/$id")({
  head: () => ({ meta: [{ title: "Solicitação enviada — ServiçosPRO" }] }),
  component: SucessoPage,
});

function SucessoPage() {
  const { id } = useParams({ from: "/sucesso/$id" });
  const { services, categories } = useStore();
  const [req, setReq] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`req:${id}`);
      if (raw) setReq(JSON.parse(raw));
    } catch {}
  }, [id]);

  if (!req) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold">Solicitação não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">Protocolo: <span className="font-mono">{id}</span></p>
          <Link to="/" className="mt-4 inline-flex text-primary">Voltar ao início</Link>
        </div>
      </PublicLayout>
    );
  }
  const service = services.find(s => s.id === req.service_id);
  const category = categories.find(c => c.id === req.category_id);

  const msg = `Olá! Tenho interesse no serviço de ${service?.name ?? ""}.

📋 Dados da solicitação:
• Nome: ${req.client_name}
• Telefone: ${req.client_phone}
• Endereço: ${req.client_address}
• Bairro: ${req.client_neighborhood}
• Cidade: ${req.client_city}
• Data preferida: ${req.preferred_date} às ${req.preferred_time}
• Urgência: ${req.urgency}
• Problema: ${req.description}

Aguardo retorno. Obrigado!`;

  const whatsLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-primary/30 bg-card p-8 text-center shadow-lg shadow-primary/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold md:text-3xl">Solicitação enviada com sucesso!</h1>
          <p className="mt-2 text-muted-foreground">Nossa equipe já recebeu seu pedido e entrará em contato em breve.</p>
          <p className="mt-1 text-xs text-muted-foreground">Protocolo: <span className="font-mono">{req.id}</span></p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Resumo da solicitação</h2>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Row k="Categoria" v={category?.name} />
            <Row k="Serviço" v={service?.name} />
            <Row k="Nome" v={req.client_name} />
            <Row k="Telefone" v={req.client_phone} />
            <Row k="Endereço" v={req.client_address || "—"} />
            <Row k="Bairro" v={req.client_neighborhood || "—"} />
            <Row k="Cidade" v={req.client_city || "—"} />
            <Row k="Data / horário" v={`${req.preferred_date || "—"} ${req.preferred_time || ""}`} />
            <Row k="Urgência" v={req.urgency} />
            <Row k="Descrição" v={req.description} className="md:col-span-2" />
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={whatsLink} target="_blank" rel="noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-white hover:opacity-90">
            <MessageCircle className="h-5 w-5" /> Enviar também pelo WhatsApp
          </a>
          <Link to="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold">
            <Home className="h-4 w-4" /> Voltar ao início
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

function Row({ k, v, className }: { k: string; v?: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 text-foreground">{v || "—"}</dd>
    </div>
  );
}
