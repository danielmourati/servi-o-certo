# Migração ServiçosPRO → Lovable Cloud (Supabase)

Hoje todos os dados (`categories`, `services`, `providers`, `requests`) vivem em `localStorage` via `src/lib/store.tsx`. Vamos trocar essa camada por um backend real (Postgres + Auth + Server Functions), mantendo a mesma UI.

## Etapas

### 1. Habilitar Lovable Cloud
Aciono o tool `supabase--enable`. Isso provisiona Postgres, Auth e Storage automaticamente — sem você criar conta nem colar chaves. Depois disso os env vars `SUPABASE_*` e `VITE_SUPABASE_*` já existem no projeto.

### 2. Modelagem do banco (migration SQL)
Criação das tabelas espelhando os tipos atuais em `src/lib/mock-data.ts`:

- `categories` (id, name, slug, icon, description, order, active)
- `services` (id, category_id FK, name, slug, description, base_price, active)
- `providers` (id, name, document, phone, whatsapp, email, bio, photo_url, status, city, neighborhood, internal_rating) — **interno, nunca exposto ao público**
- `provider_services` (provider_id, service_id) — N:N
- `service_requests` (id, service_id, customer_name, customer_phone, address, urgency, description, status, service_value, provider_payment, assigned_provider_id, created_at, updated_at)
- `user_roles` (user_id, role enum `admin`|`user`) + função `has_role()` SECURITY DEFINER (padrão obrigatório para evitar recursão de RLS e privilege escalation)

Cada tabela com `GRANT` explícito (`authenticated` + `service_role`; `anon` só onde for público) e `ENABLE ROW LEVEL SECURITY`.

### 3. Políticas RLS
- **Leitura pública (anon + authenticated)**: `categories`, `services` ativos.
- **Inserção pública**: `service_requests` (qualquer visitante pode solicitar).
- **Admin-only**: tudo em `providers`, `provider_services`, gestão de `service_requests`, edição de categorias/serviços — via `has_role(auth.uid(), 'admin')`.
- `user_roles`: leitura própria + admin.

### 4. Autenticação
Substituir o login mockado de `src/routes/entrar.tsx` por Supabase Auth (email/senha). Listener `onAuthStateChange` no root + cache invalidation. O painel `/admin/*` passa a viver sob um layout `_authenticated` que checa sessão + role `admin` em `beforeLoad` e redireciona para `/entrar`.

Você criará o primeiro usuário admin manualmente (te oriento a inserir a role pelo SQL Editor após o signup).

### 5. Camada de dados (server functions)
Criar arquivos em `src/lib/` (padrão `*.functions.ts`):
- `categories.functions.ts` — list (público), upsert/delete (admin)
- `services.functions.ts` — list por categoria (público), upsert/delete (admin)
- `providers.functions.ts` — CRUD admin (já existe esqueleto, vou alinhar)
- `requests.functions.ts` — create (público), list/update (admin, com cálculo de margem)

Reads públicos usam `supabaseAdmin` com WHERE escopado; reads/writes admin usam `requireSupabaseAuth` + checagem de role.

### 6. Refatorar o store
`src/lib/store.tsx` deixa de usar `localStorage`. Cada página passa a usar **TanStack Query** (`useSuspenseQuery` + loaders com `ensureQueryData`) chamando as server functions. Isso já é o padrão recomendado do template.

### 7. Wiring do bearer token
Confirmar `attachSupabaseAuth` no `src/start.ts` (necessário para server functions protegidas reconhecerem o usuário).

### 8. Seed inicial
Migrar `initialCategories` / `initialServices` de `mock-data.ts` para um INSERT no banco, para a Home não ficar vazia. Pedidos e prestadores começam vazios.

### 9. Limpeza
Remover `mock-data.ts` e o `StoreProvider` (ou deixar só os tipos compartilhados).

## O que você precisa fazer

1. **Aprovar este plano** (botão "Implement plan").
2. Após eu rodar a etapa 1, vou pedir sua confirmação antes de aplicar a migration SQL (etapa 2-3) — você revisa e clica "Apply".
3. Depois da migration, **criar sua conta admin**: signup em `/entrar` e me avise o email — eu te passo o SQL para promover seu usuário a `admin`.
4. Testar fluxo público (solicitar serviço) e painel admin.

## Fora de escopo desta migração
Upload de imagens (Storage), notificações, integração financeira real, autenticação social — ficam para fases seguintes conforme o plano original do MVP.
