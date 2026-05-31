import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";

export function AuthRequiredModal({
  open,
  onOpenChange,
  redirectTo = "/solicitar",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  redirectTo?: string;
}) {
  const navigate = useNavigate();

  const go = (mode: "signin" | "signup") => {
    onOpenChange(false);
    navigate({ to: "/entrar", search: { mode, redirect: redirectTo } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Opss... você precisa estar logado para concluir sua solicitação.
          </DialogTitle>
          <DialogDescription className="pt-1">
            Entre na sua conta ou cadastre-se gratuitamente para finalizar o envio do seu pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => go("signup")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-blue text-sm font-semibold text-white shadow-blue transition active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" /> Criar conta
          </button>
          <button
            type="button"
            onClick={() => go("signin")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold transition active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" /> Entrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
