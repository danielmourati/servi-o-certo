import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema } from "@/lib/validators";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({ meta: [{ title: "Recuperar senha — KebraGalho" }] }),
  component: RecuperarSenhaPage,
});

function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "E-mail inválido"); return; }
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      setSent(true);
    } catch {
      // Sempre exibir mensagem genérica
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center">
          <BrandLogo size="md" />
        </Link>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold">Recuperar senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu e-mail para receber as instruções de redefinição de senha.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-sm text-foreground">
              Se o e-mail informado estiver cadastrado, enviaremos as instruções para redefinir sua senha.
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">E-mail</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-blue font-semibold text-white shadow-blue transition active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-4 w-4" /> Enviar instruções</>}
              </button>
            </form>
          )}

          <Link to="/entrar" className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
