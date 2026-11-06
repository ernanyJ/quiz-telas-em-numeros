# Especificação do MVP — quiz-telas-em-numeros

**Visão:** PWA offline para o tablet do estande "Telas em Números" da Feira do Conhecimento
(ensino fundamental). O visitante toca em "Começar", responde 10 perguntas com feedback
imediato, vê a pontuação e o app volta sozinho ao início para o próximo da fila.

## Jornada principal

1. Tela inicial com a marca da feira + botão "Começar".
2. Pergunta X/10 → toca numa alternativa → ✅/❌ + resposta certa + "Você sabia?" → "Próxima".
3. Tela final: "7 de 10", estrelas, mensagem por faixa (0–4, 5–7, 8–10), confete em 8+,
   "Obrigada por participar!".
4. "Jogar de novo" ou retorno automático ao início após 20s.

## Funcionalidades (MVP)

- 3 telas (início, pergunta, resultado); barra de progresso.
- Perguntas em ordem fixa; alternativas embaralhadas a cada partida.
- Sons curtos de acerto/erro gerados via Web Audio, com botão de mudo (preferência no `localStorage`).
- Inatividade de 60s no meio do quiz → volta ao início.
- Layout responsivo: foco em retrato, funciona em paisagem. Alvos de toque grandes.
- 100% offline depois de instalado (Android/Chrome e iPad/Safari).

## Pós-MVP

Ranking/nome · estatísticas por pergunta · editor de perguntas · múltiplos idiomas.

## Perguntas

1. O que são "telas"? → **Telas de celulares, computadores, tablets e outros dispositivos** / Apenas televisores / Apenas computadores
2. Qual destes é um bom uso das telas? → **Estudar e aprender coisas novas** / Ficar acordado até tarde da noite / Usar o celular durante as refeições
3. Quantas horas de tela por dia são recomendadas para crianças? → 1 hora / **2 horas** / 4 horas
4. Se você usa o celular 2 horas por dia, quantas horas usa em uma semana? → 7 horas / **14 horas** / 20 horas
5. Qual é o maior número? → 9 / 15 / **20**
6. Marque a opção correta → **As telas podem ajudar no aprendizado** / As telas só servem para jogar / As telas não são importantes
7. Quantos jovens usam a internet todos os dias? → **93%** / 50% / 10%
8. Qual é o aplicativo mais usado pelos jovens? → **WhatsApp** / YouTube / Instagram / TikTok
9. Tempo diário de uso de smartphone mais comum na pesquisa → 1 a 2 horas / 4 a 6 horas / **6 a 8 horas**
10. O uso excessivo de telas pode causar: → **Problemas de visão e de sono** / Mais horas de sono / Olhos mais fortes

Fonte editável: `src/data/questions.ts`.

## Modelo de dados

- `Question { id, prompt, options: string[], correctIndex, fact }`
- Estado da partida (memória): `{ screen, index, score, options embaralhadas, answered }`.

## Stack

TypeScript estrito · Vite · vite-plugin-pwa (Workbox) · CSS puro com tokens da identidade ·
Baloo 2 (@fontsource, offline) · Vitest · ESLint + Prettier · GitHub Actions → GitHub Pages · pnpm.

## Premissas

- Números dos painéis do estande (93%, 23,4 mi, apps, 40,6%) copiados das imagens — conferir a fonte.
- Ícone do PWA: SVG próprio (lâmpada + tela) nas cores da marca.
- Código em inglês; textos e docs em PT-BR.
- Bloqueio do tablet: recursos nativos (Acesso Guiado no iPad, Fixar tela no Android), documentado no README.

## Definição de pronto

- [ ] `pnpm install && pnpm dev` sobe o app; `pnpm build` gera o PWA
- [ ] Jornada principal ponta a ponta (incluindo timeouts e offline)
- [ ] `pnpm lint`, `pnpm typecheck` e `pnpm test` passam
- [ ] README com setup, deploy, instalação no tablet e modo quiosque

## Plano

| ID  | Tarefa                                   | Depende de | Complexidade | Executor |
| --- | ---------------------------------------- | ---------- | ------------ | -------- |
| t01 | Scaffold + tooling                       | —          | média        | main     |
| t02 | Dados: tipos + 10 perguntas              | t01        | simples      | main     |
| t03 | Lógica do quiz + testes                  | t02        | média        | sonnet   |
| t04 | UI das 3 telas + identidade + responsivo | t03        | complexa     | main     |
| t05 | Timers de inatividade + testes           | t04        | média        | sonnet   |
| t06 | Sons Web Audio + mudo                    | t04        | simples      | haiku    |
| t07 | PWA: manifesto, ícones, offline, iOS     | t01        | média        | main     |
| t08 | Workflow GitHub Pages                    | t01        | simples      | haiku    |
| t09 | README + verificação ponta a ponta       | todas      | média        | main     |
