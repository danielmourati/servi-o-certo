import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { emailSchema } from "@/lib/validators";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — KebraGalho" }] }),
  validateSearch: searchSchema,
  component: EntrarPage,
});

function EntrarPage() {
  const navigate = useNavigate();
  const { mode: initialMode, redirect } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const isReturning = Boolean(redirect);
  const [email, setEmail] = useState(isReturning ? "" : "admin@servicospro.com");
  const [password, setPassword] = useState(isReturning ? "" : "admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "E-mail inválido"); return; }
    if (password.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate({ to: redirect ?? "/minha-conta" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirect ?? "/"}` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada com sucesso!");
          navigate({ to: redirect ?? "/minha-conta" });
        } else {
          toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        }
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao autenticar.");
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
          <h1 className="font-display text-2xl font-bold">
            {mode === "signin" ? "Acessar conta" : "Criar conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Entre com seu e-mail e senha." : "Preencha os dados para criar sua conta."}
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">E-mail</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Senha</span>
              <PasswordInput
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {mode === "signin" && (
              <div className="flex justify-end">
                <Link to="/recuperar-senha" className="text-xs font-semibold text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-blue font-semibold text-white shadow-blue transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <>{mode === "signin" ? "Entrar" : "Criar conta"} <ArrowRight className="h-4 w-4" /></>
              }
            </button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 block w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
          <Link to="/" className="mt-2 block text-center text-sm text-muted-foreground hover:text-foreground">← Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
}
