import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Instagram, Facebook, Linkedin, MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LgpdModal } from "@/components/lgpd-modal";
import { getPublicSettings } from "@/lib/settings.functions";
import { formatPhone } from "@/lib/validators";

type PublicSettings = {
  company_name?: string | null;
  company_email?: string | null;
  company_phone?: string | null;
  support_whatsapp?: string | null;
  company_address?: string | null;
  company_city?: string | null;
  business_hours?: string | null;
  logo_url?: string | null;
};

function digitsOnly(v?: string | null) {
  return (v ?? "").replace(/\D/g, "");
}

export function SiteFooter() {
  const fetchSettings = useServerFn(getPublicSettings);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchSettings()
      .then((data) => setSettings(data as PublicSettings | null))
      .catch(() => setSettings(null));
  }, [fetchSettings]);

  const brand = settings?.company_name?.trim() || "KebraGalho";
  const phone = settings?.company_phone?.trim();
  const whatsapp = settings?.support_whatsapp?.trim();
  const email = settings?.company_email?.trim();
  const city = settings?.company_city?.trim();
  const address = settings?.company_address?.trim();
  const hours = settings?.business_hours?.trim();
  const waDigits = digitsOnly(whatsapp);

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
            {whatsapp && (
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                {waDigits ? (
                  <a href={`https://wa.me/55${waDigits}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    WhatsApp: {formatPhone(waDigits)}
                  </a>
                ) : (
                  <span>WhatsApp: {whatsapp}</span>
                )}
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:+55${digitsOnly(phone)}`} className="hover:text-foreground">
                  {formatPhone(digitsOnly(phone))}
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${email}`} className="hover:text-foreground">{email}</a>
              </li>
            )}
            {(city || address) && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{[address, city].filter(Boolean).join(" — ")}</span>
              </li>
            )}
            {hours && (
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {hours}
              </li>
            )}
            {!whatsapp && !phone && !email && (
              <li className="text-muted-foreground/70">Informações de contato em breve.</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold">Redes sociais</h3>
          <div className="mt-4 flex gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              ...(waDigits
                ? [{ Icon: MessageCircle, href: `https://wa.me/55${waDigits}`, label: "WhatsApp" }]
                : []),
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
          <span>© {year} {brand}. Todos os direitos reservados.</span>
          <div className="flex items-center gap-3">
            <LgpdModal />
            <span className="text-border">|</span>
            <span>Feito com cuidado para o seu dia a dia.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
