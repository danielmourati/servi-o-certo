import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LgpdModal } from "@/components/lgpd-modal";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="hidden md:block border-t border-border bg-card/60 backdrop-blur">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <BrandLogo size="md" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Conectamos pessoas que precisam de serviços com soluções rápidas, simples e confiáveis para o dia a dia.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Início</Link></li>
            <li><Link to="/categorias" className="hover:text-foreground">Categorias</Link></li>
            <li><Link to="/solicitar" className="hover:text-foreground">Solicitar orçamento</Link></li>
            <li><Link to="/como-funciona" className="hover:text-foreground">Sobre</Link></li>
            <li><Link to="/entrar" className="hover:text-foreground">Entrar</Link></li>
            <li><Link to="/entrar" search={{ mode: "signup" }} className="hover:text-foreground">Cadastro</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold">Contato</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> WhatsApp: (11) 99999-9999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contato@kebragalho.com.br</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> São Paulo e região</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold">Redes sociais</h3>
          <div className="mt-4 flex gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { Icon: MessageCircle, href: "https://wa.me/5511999999999", label: "WhatsApp" },
              { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-primary hover:bg-gradient-blue hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground md:flex-row">
          <span>© {year} KebraGalho. Todos os direitos reservados.</span>
          <span>Feito com cuidado para o seu dia a dia.</span>
        </div>
      </div>
    </footer>
  );
}
