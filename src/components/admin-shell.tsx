import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, ClipboardList, FolderTree, Hammer, Users,
  DollarSign, Settings, Wrench, Menu, X, LogOut, Bell,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { to: "/admin/servicos", label: "Serviços", icon: Hammer },
  { to: "/admin/prestadores", label: "Prestadores", icon: Users },
  { to: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <SidebarContent path={path} />
      </aside>

      {/* Sidebar mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative flex w-64 flex-col bg-sidebar text-sidebar-foreground">
            <SidebarContent path={path} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-display text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary" aria-label="Notificações">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-warning" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-brand text-xs font-bold text-white">A</div>
              <div className="hidden text-xs sm:block">
                <div className="font-semibold">Admin</div>
                <div className="text-muted-foreground">admin@servicospro.com</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="KebraGalho" className="h-8 w-8 object-contain" />
          <span className="font-display text-base font-bold text-white">Kebra<span className="text-primary">Galho</span></span>
        </Link>
        {onNavigate && <button onClick={onNavigate} className="md:hidden"><X className="h-5 w-5" /></button>}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(item => {
          const active = path.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Sair
        </Link>
      </div>
    </>
  );
}

export const statusColors: Record<string, string> = {
  "Novo": "bg-info/15 text-info border-info/30",
  "Em contato": "bg-warning/15 text-warning border-warning/30",
  "Orçado": "bg-accent/15 text-accent border-accent/30",
  "Atribuído": "bg-primary/15 text-primary border-primary/30",
  "Em execução": "bg-info/15 text-info border-info/30",
  "Concluído": "bg-success/15 text-success border-success/30",
  "Cancelado": "bg-destructive/15 text-destructive border-destructive/30",
  "Pendente": "bg-warning/15 text-warning border-warning/30",
  "Ativo": "bg-success/15 text-success border-success/30",
  "Inativo": "bg-muted text-muted-foreground border-border",
  "Recebido": "bg-info/15 text-info border-info/30",
  "Pago ao prestador": "bg-accent/15 text-accent border-accent/30",
  "Finalizado": "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status] ?? "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}
