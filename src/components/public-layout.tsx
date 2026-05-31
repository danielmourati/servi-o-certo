import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, PlusCircle, UserCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function AppTopBar({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-card/80 px-5 pt-5 pb-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size="sm" showText={false} />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{subtitle ?? "Olá, bem-vindo"}</div>
            <div className="font-display text-sm font-bold text-gradient-blue">{title ?? "KebraGalho"}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}

function TabItem({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className="group flex flex-1 flex-col items-center justify-center gap-1 py-2 transition active:scale-95"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
          active ? "bg-gradient-blue text-white shadow-blue" : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </Link>
  );
}

export function MobileTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3">
      <div className="pointer-events-auto flex w-full max-w-[440px] items-center justify-around rounded-3xl border border-border/60 bg-card/95 px-2 py-1 shadow-soft backdrop-blur">
        <TabItem to="/" icon={Home} label="Início" active={isActive("/") && path === "/"} />
        <TabItem to="/categorias" icon={LayoutGrid} label="Categorias" active={isActive("/categorias")} />
        <TabItem to="/solicitar" icon={PlusCircle} label="Solicitar" active={isActive("/solicitar")} />
        <TabItem to="/entrar" icon={UserCircle2} label="Conta" active={isActive("/entrar")} />
      </div>
    </nav>
  );
}

export function PublicLayout({ children, topBar }: { children: ReactNode; topBar?: ReactNode }) {
  return (
    <div className="app-bg min-h-screen">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-background shadow-soft md:my-4 md:min-h-[calc(100vh-2rem)] md:rounded-[2rem] md:overflow-hidden">
        {topBar ?? <AppTopBar />}
        <main className="flex-1 pb-32">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
