# Quiz — Telas em Números

PWA de quiz para o estande **"Telas em Números"** da Feira do Conhecimento.
10 perguntas com feedback imediato e "Você sabia?", pontuação no final e reinício automático.
Funciona 100% offline depois de instalado no tablet (Android ou iPad).

## Requisitos

- Node.js 24+
- pnpm (`npm i -g pnpm`)

## Comandos

| Comando          | O que faz                                                     |
| ---------------- | ------------------------------------------------------------- |
| `pnpm install`   | Instala as dependências                                       |
| `pnpm dev`       | Servidor de desenvolvimento (acessível na rede local)         |
| `pnpm build`     | Gera o PWA em `dist/`                                         |
| `pnpm preview`   | Serve o `dist/` (acessível na rede local, com service worker) |
| `pnpm test`      | Testes (Vitest)                                               |
| `pnpm lint`      | ESLint                                                        |
| `pnpm typecheck` | TypeScript                                                    |
| `pnpm format`    | Prettier                                                      |

Não há variáveis de ambiente obrigatórias. `BASE_PATH` (opcional) define o caminho base do build —
o workflow do GitHub Pages usa `/<nome-do-repo>/`.

## Editar as perguntas

Tudo fica em [`src/data/questions.ts`](src/data/questions.ts): enunciado, alternativas,
`correctIndex` (índice da certa, começando em 0) e a curiosidade "Você sabia?".
As alternativas são embaralhadas automaticamente a cada partida.

Tempos de volta automática ao início: [`src/config.ts`](src/config.ts)
(60s sem toque no meio do quiz, 20s na tela de resultado) e o avanço automático depois de responder (5s).

## QR code

A tela inicial mostra um QR code para `https://quiz.jogaro.com.br` ("Jogue no seu celular!").
Versões para imprimir ficam em `qrcode/quiz-qrcode.png` (1200 px) e `qrcode/quiz-qrcode.svg`.
Para gerar de novo (ex.: outro domínio): `pnpm qrcode https://outro.dominio`.

## Publicar (Coolify) — em uso

Publicado em **https://quiz.jogaro.com.br** pelo Coolify. O `Dockerfile` faz o build com pnpm e serve o
`dist/` com nginx (`nginx.conf`: cache longo para `/assets/`, `no-cache` para HTML, service worker e manifesto).

- **Coolify:** Application → Public Repository → este repo, branch `main`, **Build Pack: Dockerfile**,
  **Ports Exposes: 80**, domínio `https://quiz.jogaro.com.br` (HTTPS automático).
- **DNS:** registro `A` de `quiz.jogaro.com.br` apontando para o IP do servidor do Coolify.
- Novas versões: push na `main` + **Redeploy** no Coolify (ou ative o webhook/auto deploy).

## Publicar (GitHub Pages) — alternativa

1. Crie o repositório no GitHub e faça push da branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Source: GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` roda lint, testes e build e publica em
   `https://<usuario>.github.io/<repo>/`.

## Instalar no tablet

Abra o link publicado **uma vez com internet** e espere carregar (isso guarda tudo para uso offline).

- **Android (Chrome):** menu ⋮ → **Instalar app** (ou "Adicionar à tela inicial").
- **iPad (Safari):** botão Compartilhar → **Adicionar à Tela de Início**.

Abra pelo ícone criado: o app roda em tela cheia e funciona sem internet.
Teste uma vez com o modo avião ligado antes da feira.

## Modo estande (travar o tablet no app)

- **iPad — Acesso Guiado:** Ajustes → Acessibilidade → Acesso Guiado → ativar e definir um código.
  Abra o app e clique 3× no botão lateral/Home → **Iniciar**. Para sair: 3 cliques + código.
  Em Ajustes → Tela e Brilho, coloque **Bloqueio Automático: Nunca**.
- **Android — Fixar app:** Configurações → Segurança → **Fixar app** (ou "Fixação de tela") → ativar.
  Abra o app, vá em Recentes, toque no ícone do app → **Fixar**. Ajuste o tempo de tela para o máximo
  (ou ative "Permanecer ativo" se o tablet ficar na tomada).

Dicas: deixe o tablet carregando, brilho alto e volume médio (há um botão de mudo no canto superior direito).

## Estrutura

```
src/
  data/questions.ts   perguntas
  quiz.ts             lógica pura (embaralhar, pontuar, faixas) + quiz.test.ts
  idle.ts             temporizador de inatividade + idle.test.ts
  sound.ts            sons sintetizados (Web Audio) e mudo
  ui.ts               HTML das telas e confete
  main.ts             liga estado, telas, sons e timers
  style.css           identidade visual (azuis + amarelo, Baloo 2)
public/icon.svg       ícone base (os PNGs do PWA são gerados no build)
docs/SPEC.md          especificação do MVP
```

> Os números das perguntas 7–9 vêm dos painéis do estande — confira a fonte antes da feira.
