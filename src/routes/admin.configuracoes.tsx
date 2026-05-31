import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminBeforeLoad } from "@/lib/admin-guard";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Admin" }] }),
  beforeLoad: requireAdminBeforeLoad,
  component: () => (
    <AdminShell title="Configurações">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Configurações da plataforma</h2>
        <p className="mt-2 text-sm text-muted-foreground">Em breve: dados da empresa, WhatsApp do atendimento, integrações e perfis de usuários.</p>
      </div>
    </AdminShell>
  ),
});
