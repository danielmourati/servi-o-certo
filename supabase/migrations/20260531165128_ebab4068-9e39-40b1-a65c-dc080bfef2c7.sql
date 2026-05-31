
-- =====================
-- ENUMS
-- =====================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.provider_status AS ENUM ('Pendente', 'Ativo', 'Inativo');
CREATE TYPE public.request_status AS ENUM ('Novo','Em contato','Orçado','Atribuído','Em execução','Concluído','Cancelado');
CREATE TYPE public.payment_status AS ENUM ('Pendente','Recebido','Pago ao prestador','Finalizado');
CREATE TYPE public.urgency_level AS ENUM ('Normal','Urgente','Emergencial');

-- =====================
-- USER ROLES + has_role
-- =====================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================
-- CATEGORIES
-- =====================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Wrench',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================
-- SERVICES
-- =====================
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_category ON public.services(category_id);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads services" ON public.services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================
-- PROVIDERS (admin-only)
-- =====================
CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  document text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  status public.provider_status NOT NULL DEFAULT 'Pendente',
  city text NOT NULL DEFAULT '',
  neighborhood text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT '',
  team text NOT NULL DEFAULT '',
  portfolio jsonb NOT NULL DEFAULT '[]'::jsonb,
  internal_rating numeric(3,2) NOT NULL DEFAULT 5.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage providers" ON public.providers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================
-- PROVIDER <-> CATEGORIES / SERVICES (N:N)
-- =====================
CREATE TABLE public.provider_categories (
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, category_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_categories TO authenticated;
GRANT ALL ON public.provider_categories TO service_role;
ALTER TABLE public.provider_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage provider_categories" ON public.provider_categories
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.provider_services (
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, service_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_services TO authenticated;
GRANT ALL ON public.provider_services TO service_role;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage provider_services" ON public.provider_services
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================
-- SERVICE REQUESTS
-- =====================
CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_address text NOT NULL DEFAULT '',
  client_neighborhood text NOT NULL DEFAULT '',
  client_city text NOT NULL DEFAULT '',
  preferred_date text NOT NULL DEFAULT '',
  preferred_time text NOT NULL DEFAULT '',
  urgency public.urgency_level NOT NULL DEFAULT 'Normal',
  description text NOT NULL DEFAULT '',
  status public.request_status NOT NULL DEFAULT 'Novo',
  payment_status public.payment_status NOT NULL DEFAULT 'Pendente',
  provider_id uuid REFERENCES public.providers(id) ON DELETE SET NULL,
  service_value numeric(12,2) NOT NULL DEFAULT 0,
  provider_payment numeric(12,2) NOT NULL DEFAULT 0,
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_requests_created ON public.service_requests(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT INSERT ON public.service_requests TO anon;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can create a request
CREATE POLICY "Anyone can submit a request" ON public.service_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Only admins read/update/delete
CREATE POLICY "Admins read requests" ON public.service_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update requests" ON public.service_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete requests" ON public.service_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================
-- SEED: categorias e serviços iniciais
-- =====================
WITH cats AS (
  INSERT INTO public.categories (name, icon, description, sort_order) VALUES
    ('Pedreiro','Hammer','Alvenaria, reformas e pequenas construções.',1),
    ('Eletricista','Zap','Instalações e manutenções elétricas.',2),
    ('Encanador','Wrench','Reparos hidráulicos e desentupimento.',3),
    ('Gesseiro','Layers','Forros, sancas e divisórias de gesso.',4),
    ('Pintor','Paintbrush','Pintura residencial, comercial e fachadas.',5),
    ('Chaveiro','Key','Cópias, fechaduras e atendimento 24h.',6),
    ('Arquiteto','Compass','Projetos, consultoria e design de interiores.',7),
    ('Locação de Máquinas','Truck','Aluguel de equipamentos e máquinas para obras.',8),
    ('ART/RRT','FileCheck','Emissão de ART e RRT por profissionais habilitados.',9)
  RETURNING id, name
)
INSERT INTO public.services (category_id, name, description)
SELECT c.id, s.name, s.description FROM cats c JOIN (VALUES
  ('Pedreiro','Construção de muro','Levantamento de muros residenciais.'),
  ('Pedreiro','Reforma de banheiro','Reforma completa de banheiros.'),
  ('Pedreiro','Assentamento de piso','Assentamento de pisos e azulejos.'),
  ('Eletricista','Instalação de tomada','Instalação de tomadas novas.'),
  ('Eletricista','Troca de disjuntor','Substituição de disjuntores.'),
  ('Eletricista','Instalação de luminária','Instalação de lustres e luminárias.'),
  ('Eletricista','Manutenção elétrica residencial','Diagnóstico e reparo de problemas elétricos.'),
  ('Eletricista','Instalação de chuveiro elétrico','Troca e instalação de chuveiros.'),
  ('Encanador','Conserto de vazamento','Localização e reparo de vazamentos.'),
  ('Encanador','Desentupimento','Desentupimento de pias, ralos e vasos.'),
  ('Encanador','Instalação de caixa d''água','Instalação e troca de caixas d''água.'),
  ('Gesseiro','Forro de gesso','Instalação de forros lisos e rebaixados.'),
  ('Gesseiro','Sanca de gesso','Sancas iluminadas e decorativas.'),
  ('Pintor','Pintura residencial','Pintura interna e externa de residências.'),
  ('Pintor','Pintura comercial','Pintura de lojas e escritórios.'),
  ('Pintor','Textura','Aplicação de texturas decorativas.'),
  ('Pintor','Massa corrida','Aplicação de massa corrida em paredes.'),
  ('Pintor','Pintura de fachada','Pintura externa de fachadas.'),
  ('Chaveiro','Abertura de fechadura','Atendimento de emergência 24h.'),
  ('Chaveiro','Cópia de chave','Cópias de chaves simples e codificadas.'),
  ('Arquiteto','Projeto arquitetônico','Projetos completos de arquitetura.'),
  ('Arquiteto','Consultoria de interiores','Design e consultoria de ambientes.'),
  ('Locação de Máquinas','Locação de betoneira','Aluguel de betoneira por diária.'),
  ('Locação de Máquinas','Locação de andaime','Andaimes para obras.'),
  ('ART/RRT','Emissão de ART','Anotação de Responsabilidade Técnica.'),
  ('ART/RRT','Emissão de RRT','Registro de Responsabilidade Técnica.')
) s(cat_name, name, description) ON c.name = s.cat_name;
