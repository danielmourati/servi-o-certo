import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, Loader2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category, Service } from "@/lib/mock-data";

type AvailabilityItem = {
  day_of_week: number; // 0=Dom, 1=Seg, etc.
  start_time: string;
  end_time: string;
};

type TeamMember = {
  id?: string;
  name: string;
  role?: string | null;
  phone?: string | null;
  email?: string | null;
};

type ProviderFormInput = {
  id?: string;
  name: string;
  document: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  photo_url: string;
  status: "Pendente" | "Ativo" | "Inativo";
  city: string;
  neighborhood: string;
  internal_rating: number;
  services: string[];
  availability: AvailabilityItem[];
  team: TeamMember[];
};

type ProviderFormModalProps = {
  provider?: any | null; // null for Create
  categories: Category[];
  services: Service[];
  onClose: () => void;
  onSave: (data: ProviderFormInput) => Promise<void>;
};

const DAYS_OF_WEEK = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export function ProviderFormModal({
  provider,
  categories,
  services,
  onClose,
  onSave,
}: ProviderFormModalProps) {
  const [formData, setFormData] = useState<ProviderFormInput>({
    name: "",
    document: "",
    phone: "",
    whatsapp: "",
    email: "",
    bio: "",
    photo_url: "",
    status: "Pendente",
    city: "",
    neighborhood: "",
    internal_rating: 5.0,
    services: [],
    availability: [],
    team: [],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"geral" | "especialidades" | "disponibilidade" | "equipe">("geral");

  // Load existing provider data if editing
  useEffect(() => {
    if (provider) {
      setFormData({
        id: provider.id,
        name: provider.name || "",
        document: provider.document || "",
        phone: provider.phone || "",
        whatsapp: provider.whatsapp || "",
        email: provider.email || "",
        bio: provider.bio || "",
        photo_url: provider.photo_url || "",
        status: provider.status || "Pendente",
        city: provider.city || "",
        neighborhood: provider.neighborhood || "",
        internal_rating: provider.internal_rating || 5.0,
        services: provider.services || [],
        availability: provider.availability || [],
        team: provider.team || [],
      });
    }
  }, [provider]);

  // Handle file upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `provider-${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // Upload file to Supabase Storage bucket 'provider-photos'
      const { error: uploadError } = await supabase.storage
        .from("provider-photos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("provider-photos")
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        photo_url: publicUrlData.publicUrl,
      }));
    } catch (err: any) {
      console.error("Error uploading photo:", err);
      // Fallback: use object URL locally for visual preview
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        photo_url: localUrl,
      }));
      alert("Nota: A imagem foi carregada localmente para pré-visualização. Para salvar permanentemente no Supabase, configure a chave de API.");
    } finally {
      setUploading(false);
    }
  };

  // Toggle service selection
  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      const newServices = exists
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  // Availability Grid handler
  const handleAvailabilityChange = (
    day: number,
    checked: boolean,
    startTime = "08:00",
    endTime = "18:00"
  ) => {
    setFormData((prev) => {
      let newAvail = [...prev.availability];
      if (!checked) {
        newAvail = newAvail.filter((a) => a.day_of_week !== day);
      } else {
        const index = newAvail.findIndex((a) => a.day_of_week === day);
        if (index > -1) {
          newAvail[index] = { day_of_week: day, start_time: startTime, end_time: endTime };
        } else {
          newAvail.push({ day_of_week: day, start_time: startTime, end_time: endTime });
        }
      }
      return { ...prev, availability: newAvail };
    });
  };

  // Team Member Management
  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { name: "", role: "", phone: "", email: "" }],
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setFormData((prev) => {
      const newTeam = [...prev.team];
      newTeam[index] = { ...newTeam[index], [field]: value };
      return { ...prev, team: newTeam };
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Por favor, preencha o nome do prestador.");
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar prestador: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-card shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border bg-card p-5 shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold">{formData.id ? "Editar" : "Novo"} Prestador</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Cadastre e gerencie as informações completas do prestador.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-border bg-secondary/20 px-5 py-2 gap-2 shrink-0">
          {(["geral", "especialidades", "disponibilidade", "equipe"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab === "geral" ? "Geral & Contato" : tab === "disponibilidade" ? "Disponibilidade" : tab}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6">
          {activeTab === "geral" && (
            <div className="space-y-4">
              {/* Photo Upload */}
              <div className="flex items-center gap-5 p-4 rounded-xl border border-border bg-secondary/10">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-secondary flex items-center justify-center">
                  {formData.photo_url ? (
                    <img src={formData.photo_url} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-foreground">Foto do Prestador</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Formatos suportados: JPG, PNG. Máx: 5MB.</p>
                  <label className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-secondary px-3 text-xs font-semibold hover:bg-secondary-hover transition">
                    <Upload className="h-3.5 w-3.5" /> Enviar Foto
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome Completo *</span>
                  <input
                    type="text"
                    required
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPF / CNPJ</span>
                  <input
                    type="text"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefone</span>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp (Link direto)</span>
                  <input
                    type="text"
                    placeholder="Ex: 5511999999999"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</span>
                  <input
                    type="email"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                  <select
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cidade</span>
                  <input
                    type="text"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bairro</span>
                  <input
                    type="text"
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biografia / Descrição do Prestador</span>
                <textarea
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </label>
            </div>
          )}

          {activeTab === "especialidades" && (
            <div className="space-y-6">
              <div className="flex gap-2 items-start text-xs text-muted-foreground p-3 rounded-lg border border-info/20 bg-info/5">
                <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                <span>Selecione quais serviços este prestador está habilitado a realizar. As especialidades são agrupadas pelas categorias existentes.</span>
              </div>
              {categories.map((category) => {
                const catServices = services.filter((s) => s.category_id === category.id);
                if (catServices.length === 0) return null;
                return (
                  <div key={category.id} className="rounded-xl border border-border p-4 bg-secondary/5">
                    <h3 className="font-display text-sm font-bold text-foreground border-b border-border pb-2 mb-3">
                      {category.name}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {catServices.map((service) => {
                        const isSelected = formData.services.includes(service.id);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => handleServiceToggle(service.id)}
                            className={`flex items-center justify-between rounded-lg border p-3 text-left text-xs transition ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <span>{service.name}</span>
                            {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "disponibilidade" && (
            <div className="space-y-4">
              <div className="flex gap-2 items-start text-xs text-muted-foreground p-3 rounded-lg border border-info/20 bg-info/5 mb-2">
                <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                <span>Defina os dias e horários de trabalho do prestador. Apenas os dias ativados serão considerados.</span>
              </div>
              <div className="divide-y divide-border border rounded-xl overflow-hidden bg-card">
                {DAYS_OF_WEEK.map((day) => {
                  const currentItem = formData.availability.find((a) => a.day_of_week === day.value);
                  const isChecked = !!currentItem;
                  const startTime = currentItem?.start_time ? currentItem.start_time.slice(0, 5) : "08:00";
                  const endTime = currentItem?.end_time ? currentItem.end_time.slice(0, 5) : "18:00";

                  return (
                    <div key={day.value} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 text-sm hover:bg-secondary/5 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`day-${day.value}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={isChecked}
                          onChange={(e) => handleAvailabilityChange(day.value, e.target.checked, startTime, endTime)}
                        />
                        <label htmlFor={`day-${day.value}`} className="font-semibold text-foreground cursor-pointer select-none">
                          {day.label}
                        </label>
                      </div>

                      {isChecked ? (
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <input
                            type="time"
                            className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={startTime}
                            onChange={(e) => handleAvailabilityChange(day.value, true, e.target.value, endTime)}
                          />
                          <span className="text-xs text-muted-foreground">até</span>
                          <input
                            type="time"
                            className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={endTime}
                            onChange={(e) => handleAvailabilityChange(day.value, true, startTime, e.target.value)}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground self-end sm:self-auto italic">Folga</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "equipe" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold">Membros da Equipe / Funcionários</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Cadastre as pessoas que trabalham com este prestador.</p>
                </div>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary-hover transition"
                >
                  <Plus className="h-4 w-4" /> Adicionar
                </button>
              </div>

              {formData.team.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-secondary/5 text-center">
                  <span className="text-sm font-medium text-muted-foreground">Nenhum funcionário cadastrado</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Clique no botão acima para adicionar membros à equipe.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.team.map((member, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 p-4 rounded-xl border border-border bg-card relative group shadow-sm">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 flex-1">
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome *</span>
                          <input
                            type="text"
                            required
                            className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cargo / Função</span>
                          <input
                            type="text"
                            className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={member.role || ""}
                            onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Telefone</span>
                          <input
                            type="text"
                            className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={member.phone || ""}
                            onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">E-mail</span>
                          <input
                            type="email"
                            className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2 text-xs outline-none"
                            value={member.email || ""}
                            onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="self-end md:self-center rounded-lg p-2 text-destructive hover:bg-destructive/10 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 border-t border-border pt-4 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary-hover transition disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar Prestador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
