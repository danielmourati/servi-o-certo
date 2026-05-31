## Objetivo

Transformar a vitrine pública (home, categorias, detalhe, solicitar, sucesso) em uma experiência **mobile-first estilo aplicativo**, inspirada na referência enviada. Em telas grandes, o conteúdo fica centralizado num "device frame" (max ~440px), com fundo neutro nas laterais.

A área administrativa (`/admin/*`) **não é alterada**.

## Mudanças visuais (design system)

Em `src/styles.css`:
- Novo gradiente azul principal `--gradient-blue` (ex.: `#3B82F6 → #06B6D4`) — usado em botões CTA, badges e card de banner.
- Tokens auxiliares: `--shadow-soft`, `--shadow-card`, `--radius` aumentado para `1.25rem` (cards bem arredondados).
- Tipografia limpa mantida (Plus Jakarta + Inter).
- Utilitários: `.bg-gradient-blue`, `.shadow-soft`, `.app-shell` (max-w-[440px] mx-auto bg-background min-h-screen com sombras laterais em telas grandes).

## Novo layout público

### `src/components/public-layout.tsx` (reescrito)
- Remove header desktop / nav horizontal.
- Wrapper `AppShell`: container centralizado `max-w-[440px]`, fundo cinza claro fora, fundo card dentro, sombra suave, padding-bottom para acomodar a tab bar.
- **Top bar mobile**: localização "Olá!" + ícones (busca, notificação) — apenas visual.
- **Bottom navigation fixa** (`MobileTabBar`) com 4 itens:
  - Início (`/`)
  - Categorias (`/categorias`)
  - Solicitar (`/solicitar`) — botão central destacado em gradiente azul
  - Entrar/Admin (`/entrar`)
  - Item ativo em gradiente azul, com animação suave (scale/opacity).

### `src/routes/index.tsx` (home reescrita)
Seguindo a referência:
1. **Hero card** com gradiente azul e ilustração: título "Serviços de confiança", subtítulo, CTA "Solicitar agora" (botão branco com texto gradiente).
2. **"Selecione uma categoria"** — grid 4 colunas de ícones circulares com label embaixo (todas as categorias ativas, scroll horizontal se passar de 8).
3. **"Categorias em destaque"** — lista vertical de cards grandes com:
   - Imagem ilustrativa (gradiente + ícone grande como placeholder).
   - Nome, descrição curta, quantidade de serviços.
   - Botão "Ver serviços" gradiente azul.
4. **"Como funciona"** — 4 passos compactos em cards arredondados.
5. **CTA final** em card gradiente azul.

**Nada de listagem de profissionais individuais** na home.

### `src/routes/categorias.index.tsx` (reescrita mobile-first)
- Header "Categorias" com voltar.
- Grid 2 colunas de cards arredondados grandes (ícone em círculo gradiente, nome, contagem de serviços), com tap animation (`active:scale-[0.97]`).

### `src/routes/categorias.$id.tsx` (revisada)
- Mantém a lógica; aplica visual app: card de categoria no topo, lista vertical de serviços com cards arredondados e botão "Solicitar".

### `src/routes/solicitar.tsx` e `src/routes/sucesso.$id.tsx`
- Apenas ajustes visuais: padding generoso, cards arredondados, botão CTA em gradiente azul, sem alteração de lógica/serverFns.

### `src/routes/entrar.tsx`
- Mantém lógica de login; apenas visual app-style (card centralizado, botão gradiente).

## Animações

- Tailwind `transition-transform active:scale-[0.97] hover:-translate-y-0.5` nos cards.
- Tab bar ativa com `transition-colors` e indicador gradiente.
- Hero pulse sutil opcional (sem dependências novas, só Tailwind).

## Comportamento responsivo

- `< 440px`: ocupa tela inteira.
- `≥ 440px`: container central com sombra lateral; o resto da viewport mostra fundo neutro (`bg-muted/40`).
- Tab bar segue presa ao fundo do container (`fixed` no mobile, `sticky bottom-0` dentro do shell em desktop) — sempre visível.

## Arquivos afetados

- `src/styles.css` — tokens de gradiente azul, sombras, raio.
- `src/components/public-layout.tsx` — reescrito (AppShell + TabBar + TopBar).
- `src/routes/index.tsx` — reescrito.
- `src/routes/categorias.index.tsx` — reescrito.
- `src/routes/categorias.$id.tsx` — refinado.
- `src/routes/solicitar.tsx` — refinado visual.
- `src/routes/sucesso.$id.tsx` — refinado visual.
- `src/routes/entrar.tsx` — refinado visual.

Nenhuma mudança em backend, server functions, schema ou rotas `/admin/*`.

## Validação

- Conferir preview a 390px (mobile) e 1280px (desktop centralizado).
- Tab bar visível em todas as páginas públicas; rotas admin não exibem tab bar.
- Categorias e contadores carregam do Supabase via `useStore()`.
