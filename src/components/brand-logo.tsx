import logoUrl from "@/assets/logo.png";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { box: string; img: string; text: string }> = {
  sm: { box: "h-9 w-9", img: "h-7 w-7", text: "text-sm" },
  md: { box: "h-10 w-10", img: "h-8 w-8", text: "text-base" },
  lg: { box: "h-14 w-14", img: "h-11 w-11", text: "text-xl" },
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
      <span
        className={`${s.box} flex items-center justify-center rounded-xl bg-gradient-blue shadow-blue`}
      >
        <img src={logoUrl} alt="KebraGalho" className={`${s.img} object-contain`} />
      </span>
      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-gradient-blue ${s.text}`}>
          KebraGalho
        </span>
      )}
    </span>
  );
}
