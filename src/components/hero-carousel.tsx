import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Sparkles } from "lucide-react";

type Slide = {
  kicker: string;
  title: string;
  copy: string;
  cta: string;
  to: string;
  image: string;
  accent: string;
};

const slides: Slide[] = [
  {
    kicker: "Reformas sem dor de cabeça",
    title: "Sua casa nova em mãos de especialistas",
    copy: "Pedreiros experientes prontos para começar nesta semana. Orçamento gratuito em minutos.",
    cta: "Quero meu orçamento",
    to: "/solicitar",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-700/85 via-blue-600/70 to-blue-500/40",
  },
  {
    kicker: "Elétrica segura",
    title: "Não arrisque sua família com fios à mostra",
    copy: "Eletricistas certificados resolvem hoje. Atendimento de urgência 24h pelo WhatsApp.",
    cta: "Chamar eletricista",
    to: "/solicitar",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80",
    accent: "from-sky-700/85 via-blue-600/70 to-cyan-500/40",
  },
  {
    kicker: "Vazamento? Resolvemos agora",
    title: "Cada minuto vira prejuízo. Aja antes da próxima conta",
    copy: "Encanadores especialistas em vazamentos, desentupimentos e instalações. Diagnóstico gratuito.",
    cta: "Resolver agora",
    to: "/solicitar",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-800/85 via-blue-600/70 to-blue-400/40",
  },
  {
    kicker: "Pintura profissional",
    title: "Transforme seu ambiente em um final de semana",
    copy: "Pintores com acabamento impecável, materiais de primeira e proteção total dos móveis.",
    cta: "Renovar minha casa",
    to: "/solicitar",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80",
    accent: "from-indigo-700/85 via-blue-600/70 to-sky-400/40",
  },
  {
    kicker: "Chaveiro 24h",
    title: "Ficou na rua? A gente chega em 30 minutos",
    copy: "Abertura sem quebrar a fechadura, cópia de chaves e troca de segredo no mesmo dia.",
    cta: "Pedir socorro",
    to: "/solicitar",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-900/85 via-blue-700/70 to-cyan-500/40",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden rounded-3xl shadow-card">
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[420px] w-full overflow-hidden md:h-[480px]">
                <img
                  src={s.image}
                  alt={s.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Dark scrim only for text legibility — no blue tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-10">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" /> {s.kicker}
                  </span>
                  <h2 className="mt-4 max-w-[640px] font-display text-3xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] md:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-3 max-w-[480px] text-base font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] md:text-lg">
                    {s.copy}
                  </p>
                  <Link
                    to={s.to}
                    className="mt-5 inline-flex h-12 w-fit items-center gap-2 rounded-2xl bg-white px-6 text-base font-bold text-blue-700 shadow-xl transition hover:bg-blue-50 active:scale-[0.97]"
                  >
                    {s.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === selected ? "w-6 bg-gradient-blue" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
