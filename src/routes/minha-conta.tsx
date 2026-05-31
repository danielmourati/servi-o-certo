import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, KeyRound, Save, UserCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { PasswordInput } from "@/components/ui/password-input";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { isoToBR, dateBRSchema, cpfSchema, phoneSchema } from "@/lib/validators";
import { toast } from "sonner";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({ meta: [{ title: "Minha conta — KebraGalho" }] }),
  component: MinhaContaPage,
});

type AuthState = "checking" | "anon" | "auth";

function MinhaContaPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [state, setState] = useState<AuthState>("checking");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data.user) { setEmail(data.user.email ?? ""); setState("auth"); }
      else setState("anon");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) { setEmail(s.user.email ?? ""); setState("auth"); }
      else setState("anon");
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  if (state === "checking") {
    return (
      <PublicLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }
  if (state === "anon") {
    return <Navigate to="/entrar" search={{ redirect: "/minha-conta" }} />;
  }

  return <MinhaContaContent email={email} onSignOut={async () => {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/" });
  }} />;
}

const fetchProfile = (() => null) as any; // placeholder for TS narrowing

function MinhaContaContent({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const getProfile = useServerFn(getMyProfile);
  const updateProfile = useServerFn(updateMyProfile);
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getProfile(),
  });

  const [form, setForm] = useState({
    full_name: "", phone: "", cpf: "", birth_date: "",
    city: "", neighborhood: "", address: "",
  });
  const [pwdOpen, setPwdOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    const p = profileQ.data as any;
    if (!p) return;
    setForm({
      full_name: p.full_name ?? "",
      phone: p.phone ?? "",
      cpf: p.cpf ?? "",
      birth_date: isoToBR(p.birth_date),
      city: p.city ?? "",
      neighborhood: p.neighborhood ?? "",
      address: p.address ?? "",
    });
  }, [profileQ.data]);

  const saveMut = useMutation({
    mutationFn: async () => {
      // Validações leves (mensagens amigáveis)
      if (form.phone.trim()) {
        const r = phoneSchema.safeParse(form.phone);
        if (!r.success) throw new Error(r.error.issues[0]?.message ?? "Telefone inválido");
      }
      if (form.cpf.trim()) {
        const r = cpfSchema.safeParse(form.cpf);
        if (!r.success) throw new Error(r.error.issues[0]?.message ?? "CPF inválido");
      }
      let birthIso = "";
      if (form.birth_date.trim()) {
        try {
          birthIso = dateBRSchema.parse(form.birth_date);
        } catch (e: any) {
          throw new Error(e?.message ?? "Data de nascimento inválida");
        }
      }
      return updateProfile({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          cpf: form.cpf,
          birth_date: birthIso,
          city: form.city,
          neighborhood: form.neighborhood,
          address: form.address,
          avatar_url: "",
        },
      });
    },
    onSuccess: () => {
      toast.success("Dados atualizados com sucesso!");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao salvar"),
  });

  const changePwd = async () => {
    if (newPwd.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    if (newPwd !== confirmPwd) { toast.error("As senhas não coincidem"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) { toast.error(error.message); return; }
    toast.success("Senha alterada com sucesso!");
    setPwdOpen(false); setNewPwd(""); setConfirmPwd("");
  };

  const firstName = form.full_name.trim().split(" ")[0] || "usuário";

  return (
    <PublicLayout>
      <div className="px-5 pt-2 md:px-0">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-blue text-white shadow-blue">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Olá, {firstName}</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais.</p>
          </div>
        </div>

        {profileQ.isLoading ? (
          <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <form
            className="mt-6 space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7"
            onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }}
          >
            <h2 className="font-display text-base font-bold">Dados pessoais</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nome completo">
                <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={150} />
              </Field>
              <Field label="E-mail">
                <input className="input bg-muted/40" value={email} readOnly disabled />
              </Field>
              <Field label="Telefone / WhatsApp">
                <MaskedInput mask="phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="(00) 00000-0000" />
              </Field>
              <Field label="CPF">
                <MaskedInput mask="cpf" value={form.cpf} onChange={(v) => setForm({ ...form, cpf: v })} placeholder="000.000.000-00" />
              </Field>
              <Field label="Data de nascimento">
                <MaskedInput mask="date" value={form.birth_date} onChange={(v) => setForm({ ...form, birth_date: v })} placeholder="DD/MM/AAAA" />
              </Field>
              <Field label="Cidade">
                <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} />
              </Field>
              <Field label="Bairro">
                <input className="input" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} maxLength={100} />
              </Field>
              <Field label="Endereço">
                <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={255} />
              </Field>
            </div>

            <div className="flex flex-col gap-3 pt-2 md:flex-row md:flex-wrap">
              <button
                type="submit"
                disabled={saveMut.isPending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-blue px-6 text-sm font-semibold text-white shadow-blue transition active:scale-[0.98] disabled:opacity-60"
              >
                {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Salvar alterações</>}
              </button>
              <button
                type="button"
                onClick={() => setPwdOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <KeyRound className="h-4 w-4" /> Alterar senha
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-destructive/40 bg-background px-6 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sair da conta
              </button>
            </div>
          </form>
        )}
      </div>

      <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>Defina sua nova senha. Mínimo de 6 caracteres.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Nova senha</span>
              <PasswordInput value={newPwd} onChange={(e) => setNewPwd(e.target.value)} minLength={6} autoComplete="new-password" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Confirmar nova senha</span>
              <PasswordInput value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} minLength={6} autoComplete="new-password" />
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setPwdOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
            >Cancelar</button>
            <button
              type="button"
              onClick={changePwd}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-blue px-4 text-sm font-semibold text-white shadow-blue"
            >Salvar nova senha</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`.input { width:100%; height:44px; border:1px solid var(--color-border); background:var(--color-background); padding:0 14px; border-radius:14px; font-size:14px; outline:none; transition: border-color .15s, box-shadow .15s; }
      .input:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }`}</style>
    </PublicLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
