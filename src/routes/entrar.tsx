import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Wrench, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — ServiçosPRO" }] }),
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
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate({ to: redirect ?? "/admin/dashboard" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirect ?? "/"}` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada com sucesso!");
          navigate({ to: redirect ?? "/admin/dashboard" });
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-info/5 to-accent/10 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white"><Wrench className="h-5 w-5" /></div>
          <span className="font-display text-xl font-bold">Serviços<span className="text-primary">PRO</span></span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
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
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Senha</span>
              <input
                type="password"
                required
                minLength={6}
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
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
