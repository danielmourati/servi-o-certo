## Objetivo

Exibir o mascote KebraGalho "solto" ao lado do texto, sem o fundo azul arredondado (card) que hoje o envolve.

## Mudanças

`**src/components/brand-logo.tsx**`

- Remover o wrapper `<span>` com `bg-gradient-blue`, `shadow-blue` e `rounded-xl` que cria o card atrás da imagem.
- Renderizar `<img>` diretamente ao lado do texto, mantendo os tamanhos atuais (sm/md/lg) ligeiramente maiores já que não há mais o padding do card.
- Manter `object-contain` e `alt="KebraGalho"`.

`**src/components/admin-shell.tsx**`

- Já usa `<img>` direto (sem card) — sem alteração necessária.

`**src/routes/entrar.tsx` e `src/components/public-layout.tsx**`

- Sem alteração: consomem `BrandLogo`, que passará a renderizar a imagem solta automaticamente.

## Resultado visual

O macaco com martelo aparece diretamente ao lado da palavra "KebraGalho" — sem fundo, sem sombra, sem borda arredondada — como em qualquer logotipo tradicional.  
o tamanho deverá ficar bem visível e proporcional.