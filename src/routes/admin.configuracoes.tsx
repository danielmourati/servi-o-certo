import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Building2, Phone, Mail, MapPin, DollarSign, Bell, Palette, Plug, Save, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";
import { getSettings, updateSettings } from "@/lib/settings.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Admin" }] }),
  beforeLoad: requireAdminBeforeLoad,
  component: SettingsPage,
});

type SettingsForm = {
  company_name: string;
  company_document: string;
  company_email: string;
  company_phone: string;
  support_whatsapp: string;
  company_address: string;
  company_city: string;
  business_hours: string;
  default_commission_pct: number;
  notify_email: string;
  notify_new_request: boolean;
  primary_color: string;
  logo_url: string;
  whatsapp_api_url: string;
  whatsapp_api_token: string;
};

const empty: SettingsForm = {
  company_name: "",
  company_document: "",
  company_email: "",
  company_phone: "",
  support_whatsapp: "",
  company_address: "",
  company_city: "",
  business_hours: "",
  default_commission_pct: 20,
  notify_email: "",
  notify_new_request: true,
  primary_color: "#3B82F6",
  logo_url: "",
  whatsapp_api_url: "",
  whatsapp_api_token: "",
};

function SettingsPage() {
  const fetchSettings = useServerFn(getSettings);
  const saveSettings = useServerFn(updateSettings);
  const [form, setForm] = useState<SettingsForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((data: any) => {
        if (data) setForm({ ...empty, ...data });
      })
      .catch((e: any) => toast.error(e?.message ?? "Falha ao carregar configurações"))
      .finally(() => setLoading(false));
  }, [fetchSettings]);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings({
        data: {
          ...form,
          default_commission_pct: Number(form.default_commission_pct) || 0,
        },
      });
      toast.success("Configurações salvas com sucesso!");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Configurações">
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando...
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <Section icon={Building2} title="Dados da empresa" description="Informações exibidas em e-mails, recibos e na vitrine pública.">
            <Field label="Nome da empresa">
              <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
            </Field>
            <Field label="CNPJ / Documento">
              <Input value={form.company_document} onChange={(e) => update("company_document", e.target.value)} />
            </Field>
            <Field label="URL do logo">
              <Input placeholder="https://..." value={form.logo_url} onChange={(e) => update("logo_url", e.target.value)} />
            </Field>
            <Field label="Horário de atendimento">
              <Input value={form.business_hours} onChange={(e) => update("business_hours", e.target.value)} />
            </Field>
          </Section>

          <Section icon={Phone} title="Contato e WhatsApp" description="Canal de comunicação com clientes.">
            <Field label="Telefone fixo">
              <Input value={form.company_phone} onChange={(e) => update("company_phone", e.target.value)} />
            </Field>
            <Field label="WhatsApp de atendimento">
              <Input placeholder="(11) 99999-9999" value={form.support_whatsapp} onChange={(e) => update("support_whatsapp", e.target.value)} />
            </Field>
            <Field label="E-mail de contato">
              <Input type="email" value={form.company_email} onChange={(e) => update("company_email", e.target.value)} />
            </Field>
          </Section>

          <Section icon={MapPin} title="Endereço">
            <Field label="Endereço" className="md:col-span-2">
              <Textarea rows={2} value={form.company_address} onChange={(e) => update("company_address", e.target.value)} />
            </Field>
            <Field label="Cidade / Estado">
              <Input value={form.company_city} onChange={(e) => update("company_city", e.target.value)} />
            </Field>
          </Section>

          <Section icon={DollarSign} title="Financeiro" description="Configurações padrão para cálculos de comissão.">
            <Field label="Comissão padrão (%)">
              <Input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={form.default_commission_pct}
                onChange={(e) => update("default_commission_pct", Number(e.target.value))}
              />
            </Field>
          </Section>

          <Section icon={Bell} title="Notificações">
            <Field label="E-mail para receber notificações">
              <Input type="email" value={form.notify_email} onChange={(e) => update("notify_email", e.target.value)} />
            </Field>
            <Field label="Notificar novos pedidos">
              <div className="flex h-9 items-center gap-3">
                <Switch checked={form.notify_new_request} onCheckedChange={(v) => update("notify_new_request", v)} />
                <span className="text-sm text-muted-foreground">
                  {form.notify_new_request ? "Ativado" : "Desativado"}
                </span>
              </div>
            </Field>
          </Section>

          <Section icon={Palette} title="Aparência">
            <Field label="Cor primária">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => update("primary_color", e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-border bg-transparent"
                />
                <Input value={form.primary_color} onChange={(e) => update("primary_color", e.target.value)} className="flex-1" />
              </div>
            </Field>
          </Section>

          <Section icon={Plug} title="Integrações" description="Conexão com APIs externas (opcional).">
            <Field label="URL da API de WhatsApp" className="md:col-span-2">
              <Input placeholder="https://api.exemplo.com" value={form.whatsapp_api_url} onChange={(e) => update("whatsapp_api_url", e.target.value)} />
            </Field>
            <Field label="Token da API" className="md:col-span-2">
              <Input type="password" value={form.whatsapp_api_token} onChange={(e) => update("whatsapp_api_token", e.target.value)} />
            </Field>
          </Section>

          <div className="sticky bottom-4 z-10 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-gradient-brand text-white shadow-lg">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar configurações
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
