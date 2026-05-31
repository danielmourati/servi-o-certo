// Tipos compartilhados da aplicação. Os dados agora vêm do banco.

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

export type Service = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type ProviderStatus = "Pendente" | "Ativo" | "Inativo";

export type Provider = {
  id: string;
  name: string;
  document: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  photo_url: string;
  status: ProviderStatus;
  city: string;
  neighborhood: string;
  categories: string[];
  services: string[];
  availability: string;
  team: string;
  portfolio: string[];
  internal_rating: number;
};

export type RequestStatus =
  | "Novo"
  | "Em contato"
  | "Orçado"
  | "Atribuído"
  | "Em execução"
  | "Concluído"
  | "Cancelado";

export type PaymentStatus = "Pendente" | "Recebido" | "Pago ao prestador" | "Finalizado";
export type Urgency = "Normal" | "Urgente" | "Emergencial";

export type ServiceRequest = {
  id: string;
  service_id: string;
  category_id: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  client_neighborhood: string;
  client_city: string;
  preferred_date: string;
  preferred_time: string;
  urgency: Urgency;
  description: string;
  status: RequestStatus;
  payment_status: PaymentStatus;
  provider_id: string | null;
  service_value: number;
  provider_payment: number;
  admin_notes: string;
  created_at: string;
};

export const ADMIN_WHATSAPP = "5599999999999";
