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

export const initialCategories: Category[] = [
  { id: "cat-1", name: "Pedreiro", icon: "Hammer", description: "Alvenaria, reformas e pequenas construções.", sort_order: 1, is_active: true },
  { id: "cat-2", name: "Eletricista", icon: "Zap", description: "Instalações e manutenções elétricas.", sort_order: 2, is_active: true },
  { id: "cat-3", name: "Encanador", icon: "Wrench", description: "Reparos hidráulicos e desentupimento.", sort_order: 3, is_active: true },
  { id: "cat-4", name: "Gesseiro", icon: "Layers", description: "Forros, sancas e divisórias de gesso.", sort_order: 4, is_active: true },
  { id: "cat-5", name: "Pintor", icon: "Paintbrush", description: "Pintura residencial, comercial e fachadas.", sort_order: 5, is_active: true },
  { id: "cat-6", name: "Chaveiro", icon: "Key", description: "Cópias, fechaduras e atendimento 24h.", sort_order: 6, is_active: true },
  { id: "cat-7", name: "Arquiteto", icon: "Compass", description: "Projetos, consultoria e design de interiores.", sort_order: 7, is_active: true },
  { id: "cat-8", name: "Locação de Máquinas", icon: "Truck", description: "Aluguel de equipamentos e máquinas para obras.", sort_order: 8, is_active: true },
  { id: "cat-9", name: "ART/RRT", icon: "FileCheck", description: "Emissão de ART e RRT por profissionais habilitados.", sort_order: 9, is_active: true },
];

export const initialServices: Service[] = [
  // Pedreiro
  { id: "srv-1", category_id: "cat-1", name: "Construção de muro", description: "Levantamento de muros residenciais.", is_active: true },
  { id: "srv-2", category_id: "cat-1", name: "Reforma de banheiro", description: "Reforma completa de banheiros.", is_active: true },
  { id: "srv-3", category_id: "cat-1", name: "Assentamento de piso", description: "Assentamento de pisos e azulejos.", is_active: true },
  // Eletricista
  { id: "srv-4", category_id: "cat-2", name: "Instalação de tomada", description: "Instalação de tomadas novas.", is_active: true },
  { id: "srv-5", category_id: "cat-2", name: "Troca de disjuntor", description: "Substituição de disjuntores.", is_active: true },
  { id: "srv-6", category_id: "cat-2", name: "Instalação de luminária", description: "Instalação de lustres e luminárias.", is_active: true },
  { id: "srv-7", category_id: "cat-2", name: "Manutenção elétrica residencial", description: "Diagnóstico e reparo de problemas elétricos.", is_active: true },
  { id: "srv-8", category_id: "cat-2", name: "Instalação de chuveiro elétrico", description: "Troca e instalação de chuveiros.", is_active: true },
  // Encanador
  { id: "srv-9", category_id: "cat-3", name: "Conserto de vazamento", description: "Localização e reparo de vazamentos.", is_active: true },
  { id: "srv-10", category_id: "cat-3", name: "Desentupimento", description: "Desentupimento de pias, ralos e vasos.", is_active: true },
  { id: "srv-11", category_id: "cat-3", name: "Instalação de caixa d'água", description: "Instalação e troca de caixas d'água.", is_active: true },
  // Gesseiro
  { id: "srv-12", category_id: "cat-4", name: "Forro de gesso", description: "Instalação de forros lisos e rebaixados.", is_active: true },
  { id: "srv-13", category_id: "cat-4", name: "Sanca de gesso", description: "Sancas iluminadas e decorativas.", is_active: true },
  // Pintor
  { id: "srv-14", category_id: "cat-5", name: "Pintura residencial", description: "Pintura interna e externa de residências.", is_active: true },
  { id: "srv-15", category_id: "cat-5", name: "Pintura comercial", description: "Pintura de lojas e escritórios.", is_active: true },
  { id: "srv-16", category_id: "cat-5", name: "Textura", description: "Aplicação de texturas decorativas.", is_active: true },
  { id: "srv-17", category_id: "cat-5", name: "Massa corrida", description: "Aplicação de massa corrida em paredes.", is_active: true },
  { id: "srv-18", category_id: "cat-5", name: "Pintura de fachada", description: "Pintura externa de fachadas.", is_active: true },
  // Chaveiro
  { id: "srv-19", category_id: "cat-6", name: "Abertura de fechadura", description: "Atendimento de emergência 24h.", is_active: true },
  { id: "srv-20", category_id: "cat-6", name: "Cópia de chave", description: "Cópias de chaves simples e codificadas.", is_active: true },
  // Arquiteto
  { id: "srv-21", category_id: "cat-7", name: "Projeto arquitetônico", description: "Projetos completos de arquitetura.", is_active: true },
  { id: "srv-22", category_id: "cat-7", name: "Consultoria de interiores", description: "Design e consultoria de ambientes.", is_active: true },
  // Locação
  { id: "srv-23", category_id: "cat-8", name: "Locação de betoneira", description: "Aluguel de betoneira por diária.", is_active: true },
  { id: "srv-24", category_id: "cat-8", name: "Locação de andaime", description: "Andaimes para obras.", is_active: true },
  // ART/RRT
  { id: "srv-25", category_id: "cat-9", name: "Emissão de ART", description: "Anotação de Responsabilidade Técnica.", is_active: true },
  { id: "srv-26", category_id: "cat-9", name: "Emissão de RRT", description: "Registro de Responsabilidade Técnica.", is_active: true },
];

export const initialProviders: Provider[] = [
  {
    id: "prov-1", name: "Carlos Silva", document: "123.456.789-00", phone: "(11) 98765-4321", whatsapp: "5511987654321",
    email: "carlos@email.com", bio: "Eletricista há 15 anos. Atendimento rápido e seguro.",
    photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=Carlos%20Silva",
    status: "Ativo", city: "São Paulo", neighborhood: "Vila Mariana",
    categories: ["cat-2"], services: ["srv-4", "srv-5", "srv-6", "srv-7", "srv-8"],
    availability: "Seg a Sáb, 8h–18h", team: "Individual",
    portfolio: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400"],
    internal_rating: 4.8,
  },
  {
    id: "prov-2", name: "João Pereira", document: "987.654.321-00", phone: "(11) 91234-5678", whatsapp: "5511912345678",
    email: "joao@email.com", bio: "Pedreiro com mais de 20 anos de experiência em reformas.",
    photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=Joao%20Pereira",
    status: "Ativo", city: "São Paulo", neighborhood: "Mooca",
    categories: ["cat-1"], services: ["srv-1", "srv-2", "srv-3"],
    availability: "Seg a Sex, 7h–17h", team: "Equipe de 3 pessoas",
    portfolio: [], internal_rating: 4.6,
  },
  {
    id: "prov-3", name: "Marcos Tintas", document: "12.345.678/0001-99", phone: "(11) 99876-1122", whatsapp: "5511998761122",
    email: "marcos@tintas.com", bio: "Empresa especializada em pintura residencial e comercial.",
    photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=Marcos%20Tintas",
    status: "Ativo", city: "São Paulo", neighborhood: "Tatuapé",
    categories: ["cat-5"], services: ["srv-14", "srv-15", "srv-16", "srv-17", "srv-18"],
    availability: "Seg a Sáb", team: "Equipe de 5 pintores",
    portfolio: [], internal_rating: 4.9,
  },
  {
    id: "prov-4", name: "Ana Hidráulica", document: "111.222.333-44", phone: "(11) 95555-2233", whatsapp: "5511955552233",
    email: "ana@email.com", bio: "Encanadora especialista em vazamentos e instalações.",
    photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Hidraulica",
    status: "Pendente", city: "São Paulo", neighborhood: "Pinheiros",
    categories: ["cat-3"], services: ["srv-9", "srv-10", "srv-11"],
    availability: "24h emergencial", team: "Individual",
    portfolio: [], internal_rating: 4.7,
  },
];

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

export const initialRequests: ServiceRequest[] = [
  {
    id: "req-1001", service_id: "srv-4", category_id: "cat-2",
    client_name: "Maria Souza", client_phone: "(11) 98888-7777",
    client_address: "Rua das Flores, 123", client_neighborhood: "Vila Mariana", client_city: "São Paulo",
    preferred_date: "2026-06-05", preferred_time: "14:00", urgency: "Normal",
    description: "Preciso instalar 3 tomadas novas na sala.",
    status: "Concluído", payment_status: "Finalizado", provider_id: "prov-1",
    service_value: 350, provider_payment: 220, admin_notes: "Cliente recorrente.",
    created_at: daysAgo(10),
  },
  {
    id: "req-1002", service_id: "srv-14", category_id: "cat-5",
    client_name: "Pedro Lima", client_phone: "(11) 97777-6666",
    client_address: "Av. Brasil, 500", client_neighborhood: "Tatuapé", client_city: "São Paulo",
    preferred_date: "2026-06-08", preferred_time: "09:00", urgency: "Normal",
    description: "Pintura completa de 2 quartos.",
    status: "Em execução", payment_status: "Recebido", provider_id: "prov-3",
    service_value: 2800, provider_payment: 1900, admin_notes: "",
    created_at: daysAgo(4),
  },
  {
    id: "req-1003", service_id: "srv-9", category_id: "cat-3",
    client_name: "Luana Castro", client_phone: "(11) 96666-5555",
    client_address: "Rua Aurora, 88", client_neighborhood: "Pinheiros", client_city: "São Paulo",
    preferred_date: "2026-06-01", preferred_time: "08:00", urgency: "Emergencial",
    description: "Vazamento embaixo da pia da cozinha.",
    status: "Novo", payment_status: "Pendente", provider_id: null,
    service_value: 0, provider_payment: 0, admin_notes: "",
    created_at: daysAgo(0),
  },
  {
    id: "req-1004", service_id: "srv-2", category_id: "cat-1",
    client_name: "Ricardo Alves", client_phone: "(11) 95555-4444",
    client_address: "Rua das Acácias, 45", client_neighborhood: "Mooca", client_city: "São Paulo",
    preferred_date: "2026-06-12", preferred_time: "10:00", urgency: "Urgente",
    description: "Reforma do banheiro social.",
    status: "Orçado", payment_status: "Pendente", provider_id: "prov-2",
    service_value: 5500, provider_payment: 3800, admin_notes: "Aguardando aprovação do cliente.",
    created_at: daysAgo(2),
  },
  {
    id: "req-1005", service_id: "srv-19", category_id: "cat-6",
    client_name: "Beatriz Nunes", client_phone: "(11) 94444-3333",
    client_address: "Rua Verde, 12", client_neighborhood: "Vila Mariana", client_city: "São Paulo",
    preferred_date: "2026-05-30", preferred_time: "22:00", urgency: "Emergencial",
    description: "Fechado para fora de casa.",
    status: "Concluído", payment_status: "Finalizado", provider_id: null,
    service_value: 180, provider_payment: 100, admin_notes: "",
    created_at: daysAgo(7),
  },
  {
    id: "req-1006", service_id: "srv-12", category_id: "cat-4",
    client_name: "Felipe Costa", client_phone: "(11) 93333-2222",
    client_address: "Rua dos Pinheiros, 700", client_neighborhood: "Pinheiros", client_city: "São Paulo",
    preferred_date: "2026-06-15", preferred_time: "13:00", urgency: "Normal",
    description: "Forro de gesso para sala 30m².",
    status: "Em contato", payment_status: "Pendente", provider_id: null,
    service_value: 0, provider_payment: 0, admin_notes: "",
    created_at: daysAgo(1),
  },
];
