import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCPF, formatCNPJ, formatPhone, formatDateBR } from "@/lib/validators";

export type MaskType = "cpf" | "cnpj" | "phone" | "date";

const formatters: Record<MaskType, (d: string) => string> = {
  cpf: formatCPF,
  cnpj: formatCNPJ,
  phone: formatPhone,
  date: formatDateBR,
};

const maxDigits: Record<MaskType, number> = { cpf: 11, cnpj: 14, phone: 11, date: 8 };

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  mask: MaskType;
  value: string;
  onChange: (formatted: string) => void;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, ...props }, ref) => {
    const fmt = formatters[mask];
    const display = React.useMemo(() => fmt(value ?? ""), [fmt, value]);
    return (
      <input
        ref={ref}
        inputMode={mask === "date" || mask === "phone" || mask === "cpf" || mask === "cnpj" ? "numeric" : "text"}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, maxDigits[mask]);
          onChange(fmt(digits));
        }}
        {...props}
      />
    );
  },
);
MaskedInput.displayName = "MaskedInput";
