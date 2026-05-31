import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/solicitar")({
  head: () => ({ meta: [{ title: "Solicitar serviço — ServiçosPRO" }] }),
  validateSearch: searchSchema,
  component: SolicitarPage,
});

function SolicitarPage() {
  const navigate = useNavigate();
  const { service: preselected } = Route.useSearch();
  const { categories, services, mutations } = useStore();

  const initialService = services.find(s => s.id === preselected);
  const [categoryId, setCategoryId] = useState(initialService?.category_id ?? "");
  const [serviceId, setServiceId] = useState(initialService?.id ?? "");
  const [form, setForm] = useState({
    client_name: "", client_phone: "", client_address: "",
    client_neighborhood: "", client_city: "",
    preferred_date: "", preferred_time: "",
    urgency: "Normal" as "Normal" | "Urgente" | "Emergencial",
    description: "",
  });

  const filteredServices = services.filter(s => s.category_id === categoryId && s.is_active);
  const activeCategories = categories.filter(c => c.is_active);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !serviceId) { toast.error("Selecione uma categoria e um serviço."); return; }
    if (!form.client_name || !form.client_phone) { toast.error("Preencha nome e telefone."); return; }
    try {
      const created = await mutations.createRequest({
        service_id: serviceId, category_id: categoryId, ...form,
      });
      try {
        sessionStorage.setItem(`req:${created.id}`, JSON.stringify(created));
      } catch {}
      navigate({ to: "/sucesso/$id", params: { id: created.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível enviar a solicitação.");
    }
  };

  return (
    <PublicLayout>
      <div className="px-5 pt-2">
        <Link to="/categorias" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold">Solicitar orçamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preencha os dados e entraremos em contato pelo WhatsApp.</p>

        <form onSubmit={submit} className="mt-5 space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Field label="Categoria *">
            <select className="input" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setServiceId(""); }} required>
              <option value="">Selecione...</option>
              {activeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Serviço desejado *">
            <select className="input" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required disabled={!categoryId}>
              <option value="">Selecione...</option>
              {filteredServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Nome completo *">
            <input className="input" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
          </Field>
          <Field label="Telefone / WhatsApp *">
            <input className="input" placeholder="(11) 99999-9999" value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} required />
          </Field>
          <Field label="Endereço">
            <input className="input" value={form.client_address} onChange={(e) => setForm({ ...form, client_address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bairro">
              <input className="input" value={form.client_neighborhood} onChange={(e) => setForm({ ...form, client_neighborhood: e.target.value })} />
            </Field>
            <Field label="Cidade">
              <input className="input" value={form.client_city} onChange={(e) => setForm({ ...form, client_city: e.target.value })} />
            </Field>
            <Field label="Data preferida">
              <input type="date" className="input" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
            </Field>
            <Field label="Horário">
              <input type="time" className="input" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} />
            </Field>
          </div>
          <Field label="Urgência">
            <div className="flex flex-wrap gap-2">
              {(["Normal", "Urgente", "Emergencial"] as const).map((u) => (
                <button type="button" key={u} onClick={() => setForm({ ...form, urgency: u })}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 ${form.urgency === u ? "border-transparent bg-gradient-blue text-white shadow-blue" : "border-border bg-card"}`}>
                  {u}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Descrição do problema *">
            <textarea rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </Field>
          <button type="submit" className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-blue text-sm font-semibold text-white shadow-blue transition active:scale-[0.98]">
            Enviar solicitação
          </button>
        </form>
      </div>
      <style>{`.input { width:100%; height:44px; border:1px solid var(--color-border); background:var(--color-background); padding:0 14px; border-radius:14px; font-size:14px; outline:none; transition: border-color .15s, box-shadow .15s; }
      .input:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
      textarea.input { height: auto; padding: 12px 14px; }`}</style>
    </PublicLayout>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
