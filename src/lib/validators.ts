import { z } from "zod";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export const emailSchema = z.string().trim().email("E-mail inválido").max(255);

export const phoneSchema = z
  .string()
  .transform(digitsOnly)
  .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido");

export const cpfSchema = z
  .string()
  .transform(digitsOnly)
  .refine((v) => v.length === 0 || v.length === 11, "CPF deve ter 11 dígitos");

export const cnpjSchema = z
  .string()
  .transform(digitsOnly)
  .refine((v) => v.length === 0 || v.length === 14, "CNPJ deve ter 14 dígitos");

// "DD/MM/AAAA" -> validates real date, returns ISO "YYYY-MM-DD" or "" if empty
export const dateBRSchema = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v === "" || /^\d{2}\/\d{2}\/\d{4}$/.test(v), "Data inválida (DD/MM/AAAA)")
  .transform((v) => {
    if (!v) return "";
    const [d, m, y] = v.split("/").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      throw new Error("Data inexistente");
    }
    return `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
  });

export function formatCPF(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCNPJ(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => {
      let out = "";
      if (a) out += `(${a}`;
      if (a && a.length === 2) out += ") ";
      if (b) out += b;
      if (c) out += `-${c}`;
      return out;
    });
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, (_, a, b, c) => `(${a}) ${b}${c ? `-${c}` : ""}`);
}

export function formatDateBR(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  return d
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

/** Convert ISO "YYYY-MM-DD" to BR "DD/MM/AAAA" for display in MaskedInput. */
export function isoToBR(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}
