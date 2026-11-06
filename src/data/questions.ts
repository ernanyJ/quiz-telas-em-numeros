import type { Question } from '../types';

/**
 * As 10 perguntas do quiz, na ordem em que aparecem.
 * Para editar: mude os textos; `correctIndex` aponta para a alternativa certa (começa em 0).
 * As alternativas são embaralhadas automaticamente a cada partida.
 */
export const questions: Question[] = [
  {
    id: 1,
    prompt: 'O que são “telas”?',
    options: [
      'Telas de celulares, computadores, tablets e outros dispositivos',
      'Apenas televisores',
      'Apenas computadores',
    ],
    correctIndex: 0,
    fact: 'Celular, tablet, computador, TV e até relógio inteligente: tudo isso tem tela!',
  },
  {
    id: 2,
    prompt: 'Qual destes é um bom uso das telas?',
    options: [
      'Estudar e aprender coisas novas',
      'Ficar acordado até tarde da noite',
      'Usar o celular durante as refeições',
    ],
    correctIndex: 0,
    fact: 'Usadas com equilíbrio, as telas podem ser grandes aliadas no aprendizado.',
  },
  {
    id: 3,
    prompt: 'Quantas horas de tela por dia são recomendadas para crianças?',
    options: ['1 hora', '2 horas', '4 horas'],
    correctIndex: 1,
    fact: 'A Sociedade Brasileira de Pediatria recomenda de 1 a 2 horas por dia para crianças de 6 a 10 anos.',
  },
  {
    id: 4,
    prompt: 'Se você usa o celular 2 horas por dia, quantas horas usa em uma semana?',
    options: ['7 horas', '14 horas', '20 horas'],
    correctIndex: 1,
    fact: '2 horas × 7 dias = 14 horas. Em um ano, são 730 horas: mais de 30 dias inteiros de tela!',
  },
  {
    id: 5,
    prompt: 'Qual é o maior número?',
    options: ['9', '15', '20'],
    correctIndex: 2,
    fact: '20 é maior que 15, que é maior que 9. Comparar números ajuda a entender pesquisas!',
  },
  {
    id: 6,
    prompt: 'Marque a opção correta:',
    options: [
      'As telas podem ajudar no aprendizado',
      'As telas só servem para jogar',
      'As telas não são importantes',
    ],
    correctIndex: 0,
    fact: 'Vídeos, aplicativos educativos e pesquisas na internet ajudam muito a aprender.',
  },
  {
    id: 7,
    prompt: 'Segundo a pesquisa do estande, quantos jovens usam a internet todos os dias?',
    options: ['93%', '50%', '10%'],
    correctIndex: 0,
    fact: '93% dos jovens usam a internet diariamente: são cerca de 23,4 milhões de pessoas!',
  },
  {
    id: 8,
    prompt: 'Qual é o aplicativo mais usado pelos jovens?',
    options: ['WhatsApp', 'YouTube', 'Instagram', 'TikTok'],
    correctIndex: 0,
    fact: 'WhatsApp (70%), YouTube (66%), Instagram (60%) e TikTok (50%) são os mais usados.',
  },
  {
    id: 9,
    prompt: 'Na pesquisa, qual foi o tempo diário de uso do celular mais comum?',
    options: ['1 a 2 horas', '4 a 6 horas', '6 a 8 horas'],
    correctIndex: 2,
    fact: '40,6% dos jovens passam de 6 a 8 horas por dia no celular. É muito tempo!',
  },
  {
    id: 10,
    prompt: 'O uso excessivo de telas pode causar:',
    options: ['Problemas de visão e de sono', 'Mais horas de sono', 'Olhos mais fortes'],
    correctIndex: 0,
    fact: 'Exagerar nas telas pode trazer problemas de visão, de sono, ansiedade e sedentarismo.',
  },
];
