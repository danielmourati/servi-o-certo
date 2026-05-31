## Objetivo
Adicionar uma camada de autenticação obrigatória no envio do formulário em `/solicitar`, com modal de alerta, preservação dos dados preenchidos e retomada automática do fluxo após login/cadastro.

## Mudanças

### 1. `src/routes/solicitar.tsx`
- Adicionar estado `session` via `supabase.auth.getSession()` + `onAuthStateChange`.
- No `submit`:
  1. Validar campos (igual hoje).
  2. Se **não houver sessão**:
     - Salvar o payload completo (categoryId, serviceId, form) em `sessionStorage` na chave `pending:request`.
     - Abrir modal de alerta (estado local `showAuthModal`).
  3. Se houver sessão: enviar normalmente.
- Ao montar a página, se existir `pending:request` **e** houver sessão:
  - Recuperar os dados, preencher o formulário, chamar `createRequest` automaticamente, limpar a chave e redirecionar para `/sucesso/$id`.
- Toast final permanece "Solicitação enviada com sucesso! Em breve entraremos em contato pelo WhatsApp." (também já mostrado na tela `/sucesso/$id`).

### 2. Novo componente `src/components/auth-required-modal.tsx`
Modal reutilizável usando `Dialog` do shadcn já presente no projeto:
- Título: "Opss... você precisa estar logado para concluir sua solicitação."
- Descrição: "Entre na sua conta ou cadastre-se gratuitamente para finalizar o envio do seu pedido."
- Dois botões:
  - **Entrar** → `navigate({ to: "/entrar", search: { mode: "signin", redirect: "/solicitar" } })`
  - **Criar conta** → `navigate({ to: "/entrar", search: { mode: "signup", redirect: "/solicitar" } })`
- Botão "Criar conta" estilizado com `bg-gradient-blue`.

### 3. `src/routes/entrar.tsx`
- Adicionar `validateSearch` para aceitar `mode` (`signin` | `signup`) e `redirect` (string opcional).
- Inicializar `mode` a partir da search param.
- Após login/cadastro bem-sucedido, se `search.redirect` existir, navegar para essa rota; caso contrário manter o comportamento atual (`/admin/dashboard`).
- Após signup com confirmação de email pendente, continuar exibindo o toast atual (sem auto-login).
- Pré-popular email/senha vazios quando vier do fluxo `/solicitar` (em vez do default admin).

### 4. Sem mudanças no backend
A função `createRequest` continua igual. A regra de autenticação é apenas no client (RLS já existente protege o backend).

## Detalhes técnicos
- Chave de persistência: `sessionStorage` (limpa ao fechar aba; suficiente para o fluxo).
- Estrutura salva:
  ```ts
  { categoryId, serviceId, form, savedAt: number }
  ```
- Expiração leve: ignorar se `savedAt` tiver mais de 1 hora.
- Limpar `sessionStorage.removeItem("pending:request")` após envio bem-sucedido **ou** quando o usuário editar e reenviar manualmente.
- A rota `/cadastro` solicitada não existe e seria um duplicado de `/entrar` (que já tem toggle signin/signup). Vou reutilizar `/entrar?mode=signup` em vez de criar `/cadastro`, mantendo uma única tela de auth.

## Fora de escopo
- Mudanças em outros fluxos admin.
- Criar uma rota separada `/cadastro` (reutilizamos `/entrar`).
- Alterar a tela `/sucesso/$id` (já mostra a mensagem desejada).