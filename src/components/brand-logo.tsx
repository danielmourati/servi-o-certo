import logoUrl from "@/assets/logo.png";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { img: string; text: string }> = {
  sm: { img: "h-10 w-10", text: "text-base" },
  md: { img: "h-14 w-14", text: "text-xl" },
  lg: { img: "h-20 w-20", text: "text-2xl" },
};

export function BrandLogo({
  size = "sm",
  showText = true,
  className = "",
}: {
  size?: Size;
  showText?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src={logoUrl} alt="KebraGalho" className={`${s.img} object-contain`} />
      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-gradient-blue ${s.text}`}>
          KebraGalho
        </span>
      )}
    </span>
  );
}
