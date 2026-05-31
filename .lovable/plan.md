## Visão geral

Evoluir o app KebraGalho para ter experiência completa em desktop preservando o estilo mobile-first, adicionar rodapé institucional, melhorias de autenticação (mostrar/ocultar senha, recuperar senha), máscaras e validações em formulários, e uma área do usuário autenticado em `/minha-conta`.

---

## 1. Responsividade desktop

**`src/components/public-layout.tsx`** — reescrever para detectar viewport e renderizar shells distintas:

- Mobile (`< md`): manter exatamente o layout atual (container `max-w-[440px]`, `AppTopBar` sticky, `MobileTabBar` fixa no rodapé, `pb-32`).
- Desktop (`≥ md`): novo `DesktopHeader` horizontal no topo (logo + menu: Início, Categorias, Como funciona, Solicitar, Entrar/Minha conta), conteúdo centralizado em `max-w-[1200px] mx-auto px-6`, sem `MobileTabBar`, com `Footer` ao final.
- Usar Tailwind responsive (sem JS de detecção) — `hidden md:flex` / `md:hidden` — para que SSR funcione sem flicker.
- `PublicLayout` passa a renderizar `<DesktopHeader />`, `<main>{children}</main>`, `<Footer />` no desktop e o shell mobile atual abaixo de `md`. Rotas existentes não precisam ser alteradas.

**Novos componentes:**
- `src/components/desktop-header.tsx` — header sticky com `BrandLogo`, links de navegação com `activeProps`, e botão CTA "Solicitar orçamento".
- `src/components/site-footer.tsx` — ver seção 2.

**Ajustes pontuais em páginas que hoje assumem largura 440px** (apenas adicionar variantes md): `index.tsx`, `categorias.index.tsx`, `categorias.$id.tsx`, `solicitar.tsx`, `como-funciona.tsx`, `sucesso.$id.tsx`. Mudança principal: trocar grids `grid-cols-2` por `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` em listas de categorias/serviços, dar `md:max-w-3xl mx-auto` em formulários, e remover `pb-32` em desktop (`pb-32 md:pb-12`).

---

## 2. Rodapé institucional

**`src/components/site-footer.tsx`** (novo):
- Visível em ambos os breakpoints; no mobile aparece acima do `MobileTabBar` (com padding extra) ou apenas no desktop — **decisão: mostrar apenas em `md:` desktop** para não conflitar com a tab bar fixa do mobile.
- Quatro colunas em desktop, empilhadas em tablet:
  1. **Marca**: `BrandLogo` + descrição ("Conectamos pessoas que precisam de serviços com soluções rápidas, simples e confiáveis para o dia a dia.")
  2. **Navegação**: Início, Categorias, Solicitar orçamento, Como funciona, Entrar, Cadastro
  3. **Contato**: WhatsApp, e-mail, cidade/região (dados mockados)
  4. **Redes sociais**: ícones Instagram, Facebook, WhatsApp, LinkedIn (lucide-react) com hover azul
- Rodapé inferior com `© {ano} KebraGalho`.

---

## 3. Campo de senha com olhinho

**`src/components/ui/password-input.tsx`** (novo): wrapper sobre `<Input>` do shadcn com botão `Eye`/`EyeOff` posicionado absolutamente à direita, `aria-label` "Mostrar/Ocultar senha", alterna `type` entre `password` e `text`.

Usar em:
- `src/routes/entrar.tsx` (login e cadastro)
- `src/routes/recuperar-senha.tsx` (nova) — não aplicável (apenas e-mail)
- `src/routes/redefinir-senha.tsx` (nova) — campo nova senha + confirmar
- `src/routes/minha-conta.tsx` (modal "Alterar senha")

---

## 4. Recuperação de senha

**`src/routes/recuperar-senha.tsx`** (nova rota `/recuperar-senha`):
- Layout idêntico ao `/entrar` (card centralizado com logo).
- Campo e-mail com validação Zod.
- Botão "Enviar instruções" chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${origin}/redefinir-senha })`.
- Sempre exibe mensagem genérica de sucesso (não vaza existência de contas).
- Link "← Voltar ao login".

**`src/routes/redefinir-senha.tsx`** (nova rota `/redefinir-senha`): pública; detecta sessão de recovery e chama `supabase.auth.updateUser({ password })`. Dois campos (nova senha + confirmar) com `PasswordInput`.

**`src/routes/entrar.tsx`**: adicionar link "Esqueci minha senha" abaixo do botão de login.

---

## 5. Máscaras e validações

**`src/components/ui/masked-input.tsx`** (novo): wrapper sobre `<Input>` que aceita `mask: "cpf" | "cnpj" | "phone" | "date"` e formata `onChange` mantendo apenas dígitos no estado interno e exibindo formato visual.
- CPF: `000.000.000-00`
- CNPJ: `00.000.000/0000-00`
- Phone: `(00) 00000-0000`
- Date: `DD/MM/AAAA`

**Schemas Zod centralizados** em `src/lib/validators.ts`:
- `cpfSchema`, `cnpjSchema`, `phoneSchema`, `emailSchema`, `dateBRSchema` (valida formato + data real).

**Aplicar em**:
- `src/routes/solicitar.tsx` — telefone com máscara, validação e-mail (se adicionado), validação antes do submit com mensagens amigáveis via `toast.error`.
- `src/routes/minha-conta.tsx` — CPF, telefone, data de nascimento.

---

## 6. Área do usuário `/minha-conta`

**Tabela Supabase** via migration:
```
profiles (
  id uuid PK refs auth.users(id) on delete cascade,
  full_name text,
  phone text,
  cpf text,
  birth_date date,
  city text,
  neighborhood text,
  address text,
  avatar_url text,
  created_at, updated_at
)
```
- GRANT SELECT/INSERT/UPDATE on authenticated; service_role ALL.
- RLS: `auth.uid() = id` para SELECT/INSERT/UPDATE.
- Trigger `handle_new_user` em `auth.users` que insere linha vazia em `profiles` no signup.

**Server function** `src/lib/profile.functions.ts`:
- `getMyProfile()` — SELECT da própria linha via `requireSupabaseAuth`.
- `updateMyProfile(input)` — UPDATE validado com Zod.

**Rota `src/routes/minha-conta.tsx`** (`/minha-conta`):
- Guard: dentro do `component` usa `supabase.auth.getSession()` + `onAuthStateChange`; se não autenticado, `<Navigate to="/entrar?redirect=/minha-conta" />`. (Mantém padrão atual de guard em componente já usado em `solicitar.tsx`.)
- Layout: usa `PublicLayout`, cabeçalho "Olá, {nome}".
- Card "Dados pessoais" com formulário editável: nome completo, e-mail (read-only, do `auth.user.email`), telefone (`MaskedInput phone`), CPF (`MaskedInput cpf`), data de nascimento (`MaskedInput date`), cidade, bairro, endereço.
- Botão **Salvar alterações** → chama `updateMyProfile` + toast.
- Botão **Alterar senha** → abre Dialog com 2 `PasswordInput` e chama `supabase.auth.updateUser({ password })`.
- Botão **Sair da conta** → `supabase.auth.signOut()` + redireciona para `/`.

---

## 7. Ajustes no fluxo de auth

- Renomear referências de rota no menu: "Entrar" → vai para `/entrar`. Quando logado, item vira "Minha conta" → `/minha-conta`.
- Atualizar `MobileTabBar` e `DesktopHeader` para refletir esse estado (usar `useEffect` com `supabase.auth.onAuthStateChange`).
- `solicitar.tsx` já redireciona para login com `redirect` — manter; após login auto-submit já funciona.
- Adicionar link "Cadastro" no header desktop (`/entrar?mode=signup`).
- Adicionar rota `/sobre` e `/contato`? **Não** — fora do escopo desta solicitação (já existe `/como-funciona`); footer apontará para `/como-funciona` como "Sobre" e `mailto:` como contato para evitar criar páginas em branco.

---

## 8. Detalhes técnicos

- **Sem nova lib de máscara** — implementação manual leve em `masked-input.tsx` (evita bundle extra).
- Manter tokens semânticos de `src/styles.css` (azuis). Nenhuma cor hardcoded nova.
- Componentes shadcn (`Input`, `Button`, `Dialog`, `Label`) reutilizados.
- TanStack Query para `getMyProfile` (`useQuery` + `useServerFn`).
- Breakpoints Tailwind padrão: `md` (768px), `lg` (1024px), `xl` (1280px). Container principal `max-w-[1200px]`.

---

## Arquivos a criar

- `src/components/desktop-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/ui/password-input.tsx`
- `src/components/ui/masked-input.tsx`
- `src/lib/validators.ts`
- `src/lib/profile.functions.ts`
- `src/routes/recuperar-senha.tsx`
- `src/routes/redefinir-senha.tsx`
- `src/routes/minha-conta.tsx`
- migration: tabela `profiles` + RLS + trigger

## Arquivos a editar

- `src/components/public-layout.tsx` (shell responsivo)
- `src/routes/entrar.tsx` (PasswordInput + link recuperar senha)
- `src/routes/solicitar.tsx` (máscara telefone, validações)
- `src/routes/index.tsx`, `categorias.index.tsx`, `categorias.$id.tsx`, `como-funciona.tsx`, `sucesso.$id.tsx` (grids/larguras desktop)

---

## Resultado

Web app totalmente responsivo (mobile/tablet/desktop), com header desktop + footer institucional, autenticação completa (login, cadastro, recuperar/redefinir senha, mostrar senha), formulários com máscaras e validações, e área `/minha-conta` protegida com dados persistidos no backend.
