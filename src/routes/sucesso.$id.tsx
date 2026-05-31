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
      <div className="px-5 pt-4">
        <div className="rounded-3xl border border-blue-200/60 bg-card p-6 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-blue text-white shadow-blue">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold">Solicitação enviada!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Nossa equipe entrará em contato em breve.</p>
          <p className="mt-2 text-[11px] text-muted-foreground">Protocolo: <span className="font-mono">{req.id}</span></p>
        </div>

        <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-sm font-bold">Resumo</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <Row k="Categoria" v={category?.name} />
            <Row k="Serviço" v={service?.name} />
            <Row k="Nome" v={req.client_name} />
            <Row k="Telefone" v={req.client_phone} />
            <Row k="Endereço" v={req.client_address || "—"} />
            <Row k="Bairro / Cidade" v={`${req.client_neighborhood || "—"} / ${req.client_city || "—"}`} />
            <Row k="Data / horário" v={`${req.preferred_date || "—"} ${req.preferred_time || ""}`} />
            <Row k="Urgência" v={req.urgency} />
            <Row k="Descrição" v={req.description} />
          </dl>
        </div>

        <div className="mt-4 space-y-3">
          <a href={whatsLink} target="_blank" rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]">
            <MessageCircle className="h-5 w-5" /> Enviar pelo WhatsApp
          </a>
          <Link to="/" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold transition active:scale-[0.98]">
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
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{v || "—"}</dd>
    </div>
  );
}
