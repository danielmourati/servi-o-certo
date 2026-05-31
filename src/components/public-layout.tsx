import { Link } from "@tanstack/react-router";
import { Menu, X, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold">Serviços<span className="text-primary">PRO</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Início</Link>
          <Link to="/categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>Serviços</Link>
          <Link to="/como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>Como funciona</Link>
          <Link to="/solicitar" className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>Solicitar orçamento</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/entrar" className="text-sm text-muted-foreground hover:text-foreground">Admin</Link>
          <Link to="/solicitar" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">Solicitar serviço</Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Início</Link>
            <Link to="/categorias" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Serviços</Link>
            <Link to="/como-funciona" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Como funciona</Link>
            <Link to="/solicitar" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Solicitar orçamento</Link>
            <Link to="/entrar" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Admin</Link>
            <Link to="/solicitar" onClick={() => setOpen(false)} className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Solicitar serviço</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white"><Wrench className="h-4 w-4" /></div>
              <span className="font-display text-base font-bold text-foreground">ServiçosPRO</span>
            </div>
            <p className="mt-2 max-w-sm">Conectamos você aos melhores profissionais para reformas, reparos e manutenção.</p>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} ServiçosPRO. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
