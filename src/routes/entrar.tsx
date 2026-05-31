import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Wrench, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — ServiçosPRO" }] }),
  component: EntrarPage,
});

function EntrarPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@servicospro.com");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-info/5 to-accent/10 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white"><Wrench className="h-5 w-5" /></div>
          <span className="font-display text-xl font-bold">Serviços<span className="text-primary">PRO</span></span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h1 className="font-display text-2xl font-bold">Acessar painel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Login visual de demonstração.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">E-mail</span>
              <input className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Senha</span>
              <input type="password" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground hover:opacity-90">
              Entrar no painel <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">← Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
}
