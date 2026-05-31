import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, LogIn, UserCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/" as const, label: "Início", exact: true },
  { to: "/categorias" as const, label: "Categorias" },
  { to: "/como-funciona" as const, label: "Como funciona" },
  { to: "/solicitar" as const, label: "Solicitar" },
];

export function DesktopHeader() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-30 hidden border-b border-border bg-card/85 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              activeProps={{ className: "bg-blue-50 text-primary" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
              className="rounded-xl px-3 py-2 text-sm font-medium transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {authed ? (
            <Link
              to="/minha-conta"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              <UserCircle2 className="h-4 w-4" /> Minha conta
            </Link>
          ) : (
            <Link
              to="/entrar"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </Link>
          )}
          <Link
            to="/solicitar"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-blue px-4 text-sm font-semibold text-white shadow-blue transition active:scale-[0.98]"
          >
            Solicitar orçamento <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
