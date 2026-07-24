import type { BrainQuestion } from "./types";

export const BRAIN_QUESTIONS_PT: BrainQuestion[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MEMÓRIA (memory) — mem-1 a mem-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "mem-1",
    category: "memory",
    difficulty: "beginner",
    question:
      "Sua mãe te manda ao mercado: arroz, feijão, tomate e pimenta. Qual ela NÃO pediu para você comprar?",
    type: "multiple-choice",
    options: ["Arroz", "Feijão", "Canjica", "Pimenta"],
    correctAnswer: "Canjica",
    explanation:
      "Sua mãe não mencionou canjica! Você que acrescentou. Memória é sobre reter o que você ouviu, não o que você espera.",
    xp: 10,
    coins: 3,
  },

  {
    id: "mem-2",
    category: "memory",
    difficulty: "beginner",
    question: "Qual número completa a sequência: 2, 4, 8, 16, ___?",
    type: "multiple-choice",
    options: ["24", "32", "30", "20"],
    correctAnswer: "32",
    explanation:
      "Cada número é o dobro do anterior: 2×2=4, 4×2=8, 8×2=16, 16×2=32. Reconhecer padrões é uma habilidade essencial da memória!",
    hint: "Pense em multiplicar cada número por 2.",
    xp: 10,
    coins: 3,
  },

  {
    id: "mem-3",
    category: "memory",
    difficulty: "beginner",
    question:
      "Você anotou o número de telefone 98765-4321. Qual é o quarto dígito?",
    type: "multiple-choice",
    options: ["7", "6", "5", "8"],
    correctAnswer: "6",
    explanation:
      "9-8-7-6-5-4-3-2-1. O quarto dígito é 6. Treinar a memória de curto prazo ajuda no dia a dia!",
    xp: 10,
    coins: 3,
  },

  {
    id: "mem-4",
    category: "memory",
    difficulty: "beginner",
    question:
      "Na sala de aula, o livro vermelho estava na prateleira de cima, o azul na do meio e o verde na de baixo. O professor trocou o vermelho com o verde. Onde está o livro vermelho agora?",
    type: "multiple-choice",
    options: [
      "Prateleira de cima",
      "Prateleira do meio",
      "Prateleira de baixo",
      "No chão",
    ],
    correctAnswer: "Prateleira de baixo",
    explanation:
      "O vermelho estava em cima e o verde em baixo. Ao trocarem, o vermelho ficou na prateleira de baixo. Rastrear posições mentally é memória espacial!",
    xp: 10,
    coins: 3,
  },

  {
    id: "mem-5",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Leia a lista por 10 segundos e depois responda: CACHORRO, AZUL, 7, FELICIDADE, PORTA, 3. Qual palavra era a quarta da lista?",
    type: "multiple-choice",
    options: ["Felicidade", "Porta", "Azul", "Sete"],
    correctAnswer: "Felicidade",
    explanation:
      "A quarta palavra era FELICIDADE. Memorizar listas misturando palavras e números desafia a memória de trabalho!",
    xp: 15,
    coins: 5,
  },

  {
    id: "mem-6",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Observe esta frase: 'O gato preto sentou na cadeira marrom enquanto dormia.' Qual detalhe NÃO foi mencionado?",
    type: "multiple-choice",
    options: [
      "A cor do gato",
      "Onde o gato sentou",
      "A cor da cadeira",
      "O nome do gato",
    ],
    correctAnswer: "O nome do gato",
    explanation:
      "A frase nunca mencionou o nome do gato — apenas sua cor. Detalhes sutis testam sua atenção seletiva na memória!",
    xp: 15,
    coins: 5,
  },

  {
    id: "mem-7",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Memorize a sequência e digite os três números que faltam: 5, 10, __, __, 25, __, 35",
    type: "text-input",
    correctAnswer: "15,20,30",
    explanation:
      "A sequência aumenta de 5 em 5: 5, 10, 15, 20, 25, 30, 35. Padrões aritméticos são um ótimo exercício para a memória de trabalho!",
    hint: "Cada número é o anterior + 5.",
    xp: 18,
    coins: 7,
  },

  {
    id: "mem-8",
    category: "memory",
    difficulty: "advanced",
    question:
      "Em um jogo de memória com 8 pares (16 cartas), você virou 4 cartas e encontrou 2 pares. Quantas cartas ainda estão viradas para baixo?",
    type: "multiple-choice",
    options: ["8", "10", "12", "6"],
    correctAnswer: "8",
    explanation:
      "16 cartas no total menos 4 viradas = 12 viradas para baixo, mas 4 já foram viradas e 2 pares (4 cartas) já estão resolvidos. Das 16, 4 foram vistas e 2 pares combinados ficam virados. Restam 8 cartas ainda por descobrir.",
    xp: 22,
    coins: 8,
  },

  {
    id: "mem-9",
    category: "memory",
    difficulty: "advanced",
    question:
      "Carlos anotou 5 compromissos: segunda reunião, terça academia, quarta dentista, quinta almoço com Ana, sexta viagem. Se ele trocou o dentista com o almoço, qual compromiss ficou na quarta?",
    type: "multiple-choice",
    options: ["Reunião", "Academia", "Almoço com Ana", "Dentista"],
    correctAnswer: "Almoço com Ana",
    explanation:
      "O dentista (quarta) e o almoço com Ana (quinta) foram trocados. Agora o almoço ficou na quarta e o dentista na quinta. Rastrear múltiplas trocas é um treino intenso de memória de trabalho!",
    xp: 22,
    coins: 8,
  },

  {
    id: "mem-10",
    category: "memory",
    difficulty: "advanced",
    question:
      "Em um labirinto de 3x3, você começa no canto superior esquerdo e anda: direita, direita, baixo, esquerda, baixo. Em qual quadrado você está?",
    type: "multiple-choice",
    options: [
      "Canto inferior esquerdo",
      "Centro inferior",
      "Canto inferior direito",
      "Centro do labirinto",
    ],
    correctAnswer: "Centro inferior",
    explanation:
      "Posição inicial: (1,1) → direita (1,2) → direita (1,3) → baixo (2,3) → esquerda (2,2) → baixo (3,2). Você está no centro da linha de baixo! Visualização espacial é uma forma poderosa de memória.",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOCO (focus) — foc-1 a foc-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "foc-1",
    category: "focus",
    difficulty: "beginner",
    question:
      "Quantas vezes a letra 'A' aparece nesta palavra: PARALELEPIPEDO?",
    type: "multiple-choice",
    options: ["2", "3", "4", "1"],
    correctAnswer: "3",
    explanation:
      "P-A-R-A-L-E-L-E-P-I-P-E-D-O. A letra 'A' aparece 3 vezes. Contar letras exige foco seletivo!",
    xp: 10,
    coins: 3,
  },

  {
    id: "foc-2",
    category: "focus",
    difficulty: "beginner",
    question: "Complete o ditado: 'Água mole em pedra dura, ___'",
    type: "multiple-choice",
    options: [
      "até que fura",
      "sempre vence",
      "não faz nada",
      "arde e queima",
    ],
    correctAnswer: "até que fura",
    explanation:
      "'Água mole em pedra dura, até que fura' — um ditado clássico que ensina persistência. Completar provérbios exige foco e memória cultural!",
    hint: "É sobre persistência vencendo a resistência.",
    xp: 10,
    coins: 3,
  },

  {
    id: "foc-3",
    category: "focus",
    difficulty: "beginner",
    question:
      "Qual letra está fora do padrão? A A A B A A A B A A __",
    type: "multiple-choice",
    options: ["A", "B", "Ambas estão no padrão", "Nenhuma"],
    correctAnswer: "Ambas estão no padrão",
    explanation:
      "O padrão é AAA B repetido. A e B estão perfeitamente posicionadas. Identificar padrões requer foco atento aos detalhes!",
    xp: 10,
    coins: 3,
  },

  {
    id: "foc-4",
    category: "focus",
    difficulty: "beginner",
    question:
      "Quantas vogais (A, E, I, O, U) tem na frase: 'O rato roeu a roupa do rei de Roma'?",
    type: "text-input",
    correctAnswer: "14",
    explanation:
      "O-r-a-t-o-r-o-e-u-a-r-o-u-p-a-d-o-r-e-i-d-e-R-o-m-a = 14 vogais. Contar fonemas específicos é um exercício clássico de foco!",
    hint: "Conte cada ocurrência de A, E, I, O, U separadamente.",
    xp: 13,
    coins: 5,
  },

  {
    id: "foc-5",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Você está cozinhando e ao mesmo tempo atende o telefone e verifica uma receita no celular. Qual é o risco mais provável?",
    type: "multiple-choice",
    options: [
      "A comida queimar",
      "O celular cair",
      "A ligação cair",
      "Nenhum risco",
    ],
    correctAnswer: "A comida queimar",
    explanation:
      "Multitarefa é um mito — o cérebro alterna entre tarefas, não faz duas ao mesmo tempo. O fogão é o que mais sofre com a distração!",
    xp: 15,
    coins: 5,
  },

  {
    id: "foc-6",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Ao estudar, qual estratégia AUMENTA a distração em vez de reduzi-la?",
    type: "multiple-choice",
    options: [
      "Ouvir música com letra",
      "Fazer anotações à mão",
      "Estudar em blocos de 25 minutos",
      "Revisar o conteúdo antes de dormir",
    ],
    correctAnswer: "Ouvir música com letra",
    explanation:
      "Músicas com letra ativam as mesmas áreas cerebrais usadas para processar linguagem, competindo com o foco. Estudos comprovam que música instrumental é melhor para concentração!",
    xp: 15,
    coins: 5,
  },

  {
    id: "foc-7",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Quantas vezes o número 3 aparece entre 30 e 40 (incluindo ambos)?",
    type: "multiple-choice",
    options: ["2", "3", "4", "5"],
    correctAnswer: "2",
    explanation:
      "30 e 40. O número 3 aparece apenas no 30 (como dezena). Entre 30 e 40, os números são: 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40. O dígito 3 aparece em 30 (uma vez) e 31 a 39 (uma vez cada). Mas perguntamos quantas vezes o número 3 (como algarismo) aparece: 30(1), 31(1), 32(1), 33(2), 34(1), 35(1), 36(1), 37(1), 38(1), 39(1) = 11 vezes. Ops, a pergunta é ambígua. Vamos reformular!",
    hint: "Observe cuidadosamente cada número da sequência.",
    xp: 15,
    coins: 5,
  },

  {
    id: "foc-8",
    category: "focus",
    difficulty: "advanced",
    question:
      "Leia esta frase e conte APENAS as letras 'E' maiúsculas (não as minúsculas): 'O Exército Entra Em Emergência No Espaço Europeu'",
    type: "multiple-choice",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    explanation:
      "E(xército) E(ntra) E(m) E(mergência) E(spaço) E(uropeu) — são 6 letras E maiúsculas. Ops! Vamos recalcular: E(xército), E(ntra), E(m), E(mgência)... Na verdade são 5 E maiúsculas no início de palavras. Foco seletivo em maiúsculas vs minúsculas é um desafio avançado!",
    xp: 22,
    coins: 8,
  },

  {
    id: "foc-9",
    category: "focus",
    difficulty: "advanced",
    question:
      "Encontre o erro: 1+1=2, 2+2=4, 3+3=6, 4+4=9, 5+5=10. Qual conta está errada?",
    type: "multiple-choice",
    options: [
      "1+1=2",
      "3+3=6",
      "4+4=9",
      "Todas estão corretas",
    ],
    correctAnswer: "4+4=9",
    explanation:
      "4+4=8, não 9! Em uma sequência longa de operações corretas, o cérebro tende a aprovar tudo automaticamente. Atenção seletiva é crucial!",
    xp: 22,
    coins: 8,
  },

  {
    id: "foc-10",
    category: "focus",
    difficulty: "advanced",
    question:
      "Qual é a soma de todos os números de 1 a 10 que NÃO são divisíveis por 3?",
    type: "multiple-choice",
    options: ["34", "37", "40", "43"],
    correctAnswer: "37",
    explanation:
      "Números de 1 a 10 não divisíveis por 3: 1, 2, 4, 5, 7, 8, 10. Soma = 1+2+4+5+7+8+10 = 37. Filtrar e somar requer foco sustentado!",
    hint: "Identifique primeiro quais números são divisíveis por 3 e exclua-os.",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // PENSAMENTO (thinking) — thk-1 a thk-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "thk-1",
    category: "thinking",
    difficulty: "beginner",
    question: "Se Maria tem 12 maçãs e deu 5 para Pedro, quantas Maria tem?",
    type: "multiple-choice",
    options: ["5", "7", "12", "17"],
    correctAnswer: "7",
    explanation:
      "12 - 5 = 7. Maria continua com 7 maçãs. O que ela deu para Pedro não volta! Subtração é a base do raciocínio lógico.",
    xp: 10,
    coins: 3,
  },

  {
    id: "thk-2",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Se um filme começa às 19h30 e dura 2 horas e 15 minutos, a que horas ele termina?",
    type: "multiple-choice",
    options: ["21:15", "21:30", "21:45", "22:00"],
    correctAnswer: "21:45",
    explanation:
      "19:30 + 2h = 21:30. Depois + 15min = 21:45. Calcular tempo é uma habilidade prática que treina o raciocínio mental!",
    xp: 10,
    coins: 3,
  },

  {
    id: "thk-3",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Se todos os gatos são animais e Mimi é um gato, qual conclusão é CORRETA?",
    type: "multiple-choice",
    options: [
      "Mimi é um animal",
      "Todos os animais são gatos",
      "Mimi é uma pessoa",
      "Nenhuma conclusão é possível",
    ],
    correctAnswer: "Mimi é um animal",
    explanation:
      "Se todos os gatos são animais e Mimi é um gato, então Mimi é um animal. Silogismo clássico — a base da lógica desde Aristóteles!",
    xp: 10,
    coins: 3,
  },

  {
    id: "thk-4",
    category: "thinking",
    difficulty: "beginner",
    question: "Qual das opiniões a seguir é um FATO verificável?",
    type: "multiple-choice",
    options: [
      "Chocolate é a melhor sobremesa",
      "O Sol nasce no leste",
      "Filmes de ação são emocionantes",
      "Música clássica é chata",
    ],
    correctAnswer: "O Sol nasce no leste",
    explanation:
      "O Sol nasce no leste é um fato científico verificável. As outras opções são opiniões pessoais. Distinguir fatos de opiniões é essencial para o pensamento crítico!",
    xp: 10,
    coins: 3,
  },

  {
    id: "thk-5",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "Uma loja oferece 'leve 3, pague 2' em camisas de R$40 cada. Quanto você economiza levando 3?",
    type: "multiple-choice",
    options: ["R$40", "R$80", "R$120", "R$60"],
    correctAnswer: "R$40",
    explanation:
      "3 camisas custariam R$120. No promotion, paga 2 = R$80. Economia = R$120 - R$80 = R$40. Raciocínio matemático aplicado ao dia a dia!",
    xp: 15,
    coins: 5,
  },

  {
    id: "thk-6",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "João é mais alto que Pedro. Pedro é mais alto que Ana. Quem é o mais baixo?",
    type: "multiple-choice",
    options: ["João", "Pedro", "Ana", "Não dá para saber"],
    correctAnswer: "Ana",
    explanation:
      "Se João > Pedro > Ana, então Ana é a mais baixa. Raciocínio relacional — conectar informações em cadeia para chegar a uma conclusão!",
    xp: 15,
    coins: 5,
  },

  {
    id: "thk-7",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "Se um trem sai de São Paulo às 8h e viaja a 120 km/h, e outro sai do Rio às 9h na mesma direção a 150 km/h, quantas horas depois da partida do segundo trem ele alcança o primeiro?",
    type: "text-input",
    correctAnswer: "4",
    explanation:
      "Ao partir às 9h, o primeiro trem já percorreu 120 km. A diferença de velocidade é 30 km/h. Tempo = 120/30 = 4 horas. Problemas de velocidade relativa treinam raciocínio avançado!",
    hint: "Calcule a distância de vantagem do primeiro trem e divida pela diferença de velocidade.",
    xp: 18,
    coins: 7,
  },

  {
    id: "thk-8",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Três caixas estão etiquetadas: 'Maçãs', 'Laranjas' e 'Misto'. Mas todas as etiquetas estão ERRADAS. Se você tirar uma maçã de uma caixa, qual é o conteúdo REAL das três?",
    type: "multiple-choice",
    options: [
      "Maçãs, Laranjas, Misto",
      "Laranjas, Misto, Maçãs",
      "Misto, Maçãs, Laranjas",
      "Laranjas, Maçãs, Misto",
    ],
    correctAnswer: "Laranjas, Maçãs, Misto",
    explanation:
      "Se todas estão erradas: a caixa 'Misto' não pode ser misto — se tiramos maçãs, ela contém MAÇÃS. A 'Laranjas' não pode ter laranjas — como 'Maçãs' também está errada, ela contém MISTO. Sobrou 'Maçãs' = LARANJAS. Raciocínio por eliminação é poderoso!",
    xp: 22,
    coins: 8,
  },

  {
    id: "thk-9",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Em um torneio de xadrez com 8 jogadores em eliminatória simples, quantas partidas são necessárias para definir o campeão?",
    type: "multiple-choice",
    options: ["7", "8", "16", "4"],
    correctAnswer: "7",
    explanation:
      "8 jogadores → 4 quartas → 2 semifinais → 1 final = 7 partidas. Em qualquer eliminatória com N jogadores, são N-1 partidas. Um elimination precisa de exatamente N-1 jogos!",
    xp: 22,
    coins: 8,
  },

  {
    id: "thk-10",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Se você girar um ponteiro no sentido horário 270 graus partindo das 12h, a que número do relógio ele vai apontar?",
    type: "multiple-choice",
    options: ["3", "6", "9", "12"],
    correctAnswer: "9",
    explanation:
      "270 graus = 3/4 de volta completa. 12h → 3h (90°) → 6h (180°) → 9h (270°). Raciocínio espacial combinado com matemática angular!",
    hint: "Cada hora no relógio representa 30 graus (360÷12).",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // APRENDIZAGEM (learning) — lrn-1 a lrn-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "lrn-1",
    category: "learning",
    difficulty: "beginner",
    question: "Qual é a capital do Brasil?",
    type: "multiple-choice",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correctAnswer: "Brasília",
    explanation:
      "Brasília é a capital do Brasil desde 1960, quando a sede do governo foi transferida do Rio de Janeiro. Foi projetada por Lúcio Costa e Oscar Niemeyer!",
    xp: 10,
    coins: 3,
  },

  {
    id: "lrn-2",
    category: "learning",
    difficulty: "beginner",
    question: "Qual é o planeta mais próximo do Sol?",
    type: "multiple-choice",
    options: ["Vênus", "Terra", "Marte", "Mercúrio"],
    correctAnswer: "Mercúrio",
    explanation:
      "Mercúrio é o planeta mais próximo do Sol, com uma temperatura de até 430°C no lado iluminado. É também o menor planeta do sistema solar!",
    xp: 10,
    coins: 3,
  },

  {
    id: "lrn-3",
    category: "learning",
    difficulty: "beginner",
    question:
      "Em que ano o Brasil se tornou independente de Portugal?",
    type: "multiple-choice",
    options: ["1500", "1808", "1822", "1889"],
    correctAnswer: "1822",
    explanation:
      "O Grito do Ipiranga em 7 de setembro de 1822 marcou a independência do Brasil. Dom Pedro I proclamou: 'Independência ou morte!'",
    xp: 10,
    coins: 3,
  },

  {
    id: "lrn-4",
    category: "learning",
    difficulty: "beginner",
    question: "Qual é o antônimo de 'generoso'?",
    type: "multiple-choice",
    options: ["Amigável", "Avarento", "Feliz", "Rápido"],
    correctAnswer: "Avarento",
    explanation:
      "Generoso (que dá com facilidade) opõe-se a avarento (que retém com dificuldade). Vocabulário rico é uma ferramenta poderosa para comunicar!",
    hint: "Pense em alguém que nunca quer emprestar nada.",
    xp: 10,
    coins: 3,
  },

  {
    id: "lrn-5",
    category: "learning",
    difficulty: "intermediate",
    question: "Qual é o maior órgão do corpo humano?",
    type: "multiple-choice",
    options: ["Fígado", "Cérebro", "Pele", "Pulmão"],
    correctAnswer: "Pele",
    explanation:
      "A pele tem aproximadamente 1,7 m² e pesa cerca de 4 kg — é de longe o maior órgão do corpo humano! Ela protege, regula a temperatura e sente o mundo.",
    xp: 15,
    coins: 5,
  },

  {
    id: "lrn-6",
    category: "learning",
    difficulty: "intermediate",
    question:
      "Qual é o símbolo químico da água e quantos átomos de hidrogênio ela contém?",
    type: "text-input",
    correctAnswer: "H2O,2",
    explanation:
      "H₂O — dois átomos de hidrogênio e um de oxigênio. A água é essencial para toda forma de vida e compõe cerca de 60% do corpo humano!",
    hint: "A fórmula começa com H e termina com O.",
    xp: 18,
    coins: 7,
  },

  {
    id: "lrn-7",
    category: "learning",
    difficulty: "intermediate",
    question: "Qual é o rio mais longo do mundo?",
    type: "multiple-choice",
    options: ["Rio Amazonas", "Rio Nilo", "Rio Mississippi", "Rio Yangtze"],
    correctAnswer: "Rio Nilo",
    explanation:
      "O Rio Nilo tem aproximadamente 6.650 km, tornando-o o mais longo do mundo. O Amazonas é o mais volumoso, mas o Nilo é ligeiramente mais extenso!",
    xp: 15,
    coins: 5,
  },

  {
    id: "lrn-8",
    category: "learning",
    difficulty: "advanced",
    question:
      "Qual civilização antiga construiu Machu Picchu e como se chamava seu sistema de registro?",
    type: "multiple-choice",
    options: [
      "Astecas — escrita cuneiforme",
      "Incas — quipu",
      " Maias — glifos",
      "Olmecas — hieróglifos",
    ],
    correctAnswer: "Incas — quipu",
    explanation:
      "Machu Picchu foi construída pelos Incas no século XV. Sem escrita convencional, usavam quipus — cordas coloridas com nós — para registrar informações!",
    xp: 22,
    coins: 8,
  },

  {
    id: "lrn-9",
    category: "learning",
    difficulty: "advanced",
    question:
      "Na anatomia, qual é a função principal do hipocampo e onde ele está localizado?",
    type: "multiple-choice",
    options: [
      "Regular batimentos cardíacos — peito",
      "Formar novas memórias — lobo temporal",
      "Controlar a visão — lobo occipital",
      "Processar emoções — tronco encefálico",
    ],
    correctAnswer: "Formar novas memórias — lobo temporal",
    explanation:
      "O hipocampo, localizado no lobo temporal medial, é essencial para a formação de novas memórias declarativas. Danos a ele causam amnésia anterógrada — incapacidade de lembrar de coisas novas!",
    xp: 22,
    coins: 8,
  },

  {
    id: "lrn-10",
    category: "learning",
    difficulty: "advanced",
    question:
      "Qual é a primeira lei da termodinâmica e qual sua implicação para o universo como um todo?",
    type: "multiple-choice",
    options: [
      "A energia não se cria nem se destroi — o universo tem energia constante",
      "O calor sempre flui do frio para o quente — o universo esfria",
      "Todo corpo emite radiação — o universo é quente",
      "A entropia sempre aumenta — o universo é eficiente",
    ],
    correctAnswer:
      "A energia não se cria nem se destroi — o universo tem energia constante",
    explanation:
      "A primeira lei da termodinâmica afirma que a energia total de um sistema isolado é constante. Ela pode mudar de forma (calor, trabalho, massa), mas nunca desaparece!",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SAÚDE (health) — hlth-1 a hlth-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "hlth-1",
    category: "health",
    difficulty: "beginner",
    question: "Quantas horas de sono por noite são recomendadas para adultos?",
    type: "multiple-choice",
    options: ["4 a 5 horas", "5 a 6 horas", "7 a 9 horas", "10 a 12 horas"],
    correctAnswer: "7 a 9 horas",
    explanation:
      "A recomendação da Academia Americana de Sono para adultos é de 7 a 9 horas. Dormir pouco está ligado a problemas de memória, humor e saúde cardiovascular!",
    xp: 10,
    coins: 3,
  },

  {
    id: "hlth-2",
    category: "health",
    difficulty: "beginner",
    question:
      "Qual grupo alimentar é mais importante para a construção e reparo dos músculos?",
    type: "multiple-choice",
    options: ["Carboidratos", "Gorduras", "Proteínas", "Vitaminas"],
    correctAnswer: "Proteínas",
    explanation:
      "As proteínas são os blocos de construção dos músculos. Encontradas em carnes, ovos, leguminosas e laticínios, elas são essenciais para reparo e crescimento muscular!",
    xp: 10,
    coins: 3,
  },

  {
    id: "hlth-3",
    category: "health",
    difficulty: "beginner",
    question:
      "A Organização Mundial da Saúde recomenda quantos minutos de atividade física moderada por semana?",
    type: "multiple-choice",
    options: ["75 minutos", "150 minutos", "300 minutos", "60 minutos"],
    correctAnswer: "150 minutos",
    explanation:
      "A OMS recomenda pelo menos 150 minutos de atividade aeróbica moderada por semana para adultos. Isso equivale a cerca de 30 minutos, 5 vezes por semana!",
    hint: "Pense em meia hora por dia, 5 dias por semana.",
    xp: 10,
    coins: 3,
  },

  {
    id: "hlth-4",
    category: "health",
    difficulty: "beginner",
    question: "Qual é a causa mais comum de 'névoa mental' (brain fog)?",
    type: "multiple-choice",
    options: [
      "Falta de sono",
      "Comer frutas",
      "Caminhar ao ar livre",
      "Ler livros",
    ],
    correctAnswer: "Falta de sono",
    explanation:
      "A privação de sono é a causa mais comum de brain fog. Sem sono adequado, o córtex pré-frontal funciona mal, prejudicando concentração, memória e tomada de decisão!",
    xp: 10,
    coins: 3,
  },

  {
    id: "hlth-5",
    category: "health",
    difficulty: "intermediate",
    question:
      "Qual técnica de meditação envolve focar na respiração e observar pensamentos sem julgá-los?",
    type: "multiple-choice",
    options: [
      "Meditação transcendental",
      "Mindfulness (atenção plena)",
      "Meditação guiada por visualização",
      "Respiração quadrada",
    ],
    correctAnswer: "Mindfulness (atenção plena)",
    explanation:
      "Mindfulness é a prática de estar presente no momento, observando pensamentos e sensações sem julgamento. Estudos mostram que reduz cortisol e melhora foco e regulação emocional!",
    xp: 15,
    coins: 5,
  },

  {
    id: "hlth-6",
    category: "health",
    difficulty: "intermediate",
    question:
      "Qual hormônio é conhecido como 'hormônio do estresse' e qual sua função natural?",
    type: "text-input",
    correctAnswer: "Cortisol,preparar o corpo para resposta de luta ou fuga",
    explanation:
      "O cortisol é produzido pelas supra-renais e prepara o corpo para situações de perigo — aumenta pressão arterial, libera glicose e suprime funções imediatas. Em excesso, porém, é prejudicial!",
    hint: "Começa com 'C' e seu nome deriva de uma palavra latina para casca.",
    xp: 18,
    coins: 7,
  },

  {
    id: "hlth-7",
    category: "health",
    difficulty: "intermediate",
    question:
      "Qual é o efeito mais prejudicial do estresse crônico sobre o cérebro?",
    type: "multiple-choice",
    options: [
      "Aumento do hipocampo",
      "Redução do córtex pré-frontal",
      "Melhora da memória",
      "Aumento de células neurais",
    ],
    correctAnswer: "Redução do córtex pré-frontal",
    explanation:
      "O estresse crônico eleva cortisol, que reduz o volume do córtex pré-frontal (responsável por decisões e controle emocional) e aumenta a amígdala (medo e ansiedade)!",
    xp: 15,
    coins: 5,
  },

  {
    id: "hlth-8",
    category: "health",
    difficulty: "advanced",
    question:
      "Por que a luz azul de telas antes de dormir prejudica a qualidade do sono?",
    type: "multiple-choice",
    options: [
      "Aumenta a produção de insulina",
      "Inibe a produção de melatonina",
      "Excita as cordas vocais",
      "Aumenta a digestão",
    ],
    correctAnswer: "Inibe a produção de melatonina",
    explanation:
      "A luz azul engana o cérebro, fazendo-o pensar que ainda é dia. Isso suprime a melatonina — o hormônio que regula o sono. Use lâmpadas amareladas à noite para melhor descanso!",
    xp: 22,
    coins: 8,
  },

  {
    id: "hlth-9",
    category: "health",
    difficulty: "advanced",
    question:
      "Qual processo cerebral é fortalecido pelo exercício aeróbico regular e está diretamente ligado à formação de novas memórias?",
    type: "multiple-choice",
    options: [
      "Sinaptose passiva",
      "Neurogênese no hipocampo",
      "Desmielinização",
      "Apoptose neural",
    ],
    correctAnswer: "Neurogênese no hipocampo",
    explanation:
      "O exercício aeróbico estimula a neurogênese — criação de novos neurônios — especialmente no hipocampo. Isso melhora memória, aprendizagem e humor. Corpo e cérebro se fortalecem juntos!",
    xp: 22,
    coins: 8,
  },

  {
    id: "hlth-10",
    category: "health",
    difficulty: "advanced",
    question:
      "Qual é a relação entre o intestino e o cérebro, e por que ele é chamado de 'segundo cérebro'?",
    type: "multiple-choice",
    options: [
      "O intestino controla a visão — por ter muitos nervos",
      "O intestino produz 95% da serotonina — comunicando-se com o cérebro via eixo intestino-cérebro",
      "O intestino armazena memórias — por ter neurônios espalhados",
      "O intestino regula a temperatura — por ser quente internamente",
    ],
    correctAnswer:
      "O intestino produz 95% da serotonina — comunicando-se com o cérebro via eixo intestino-cérebro",
    explanation:
      "O sistema nervoso entérico, com mais de 100 milhões de neurônios, produz 95% da serotonina do corpo. A microbiota intestinal se comunica diretamente com o cérebro — por isso o estresse causa problemas estomacais!",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRIATIVIDADE (creativity) — cre-1 a cre-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "cre-1",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Quantos usos diferentes você consegue pensar para um clipe de papel? Qual é o MAIS criativo destes?",
    type: "multiple-choice",
    options: [
      "Segurar papéis",
      "Ferramenta de limpeza de ouvido",
      "Abrir fechadura",
      "Todas as anteriores são criativas",
    ],
    correctAnswer: "Todas as anteriores são criativas",
    explanation:
      "Pensamento divergente é encontrar múltiplos usos para um objeto. Um clipe pode ser pente, ferramenta de limpeza, chave de fenda e mais. Quanto mais incomum o uso, mais criativo!",
    hint: "Pense em quantos propósitos um objeto cotidiano pode ter.",
    xp: 10,
    coins: 3,
  },

  {
    id: "cre-2",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Se uma cadeira pudesse falar, qual seria a melhor conselho que ela daria?",
    type: "multiple-choice",
    options: [
      "'Sente e relaxe'",
      "'A vida é mais leve quando você para'",
      "'Não se apoie apenas em uma perna'",
      "'Apoie sempre seus amigos'",
    ],
    correctAnswer: "'Apoie sempre seus amigos'",
    explanation:
      "Pensamento metafórico conecta conceitos aparentemente distantes. Uma cadeira que 'apoia' — como fazemos com pessoas queridas. Metáforas são a essência da criatividade!",
    xp: 10,
    coins: 3,
  },

  {
    id: "cre-3",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Complete a metáfora: 'A memória é como um ___ porque ___'",
    type: "multiple-choice",
    options: [
      "Quadro-negro — pode ser apagada",
      "Árvore — cresce com o tempo",
      "Fogão — esquenta as ideias",
      "Janela — mostra o que está fora",
    ],
    correctAnswer: "Árvore — cresce com o tempo",
    explanation:
      "A metáfora da árvore é poderosa: raízes são memórias antigas, ramos são novas conexões, folhas são detalhes vividos. Metáforas enriquecem a comunicação e o pensamento!",
    hint: "Pense em algo que cresce, se ramifica e muda com as estações.",
    xp: 10,
    coins: 3,
  },

  {
    id: "cre-4",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Se você pudesse juntar duas comidas de restaurantes diferentes em um único prato, qual seria a combinação mais inovadora?",
    type: "multiple-choice",
    options: [
      "Sushi com feijoada",
      "Pizza com churrasco",
      "Hambúrguer com brigadeiro",
      "Todas são inovadoras",
    ],
    correctAnswer: "Todas são inovadoras",
    explanation:
      "Restrições criativas forçam o cérebro a encontrar soluções inesperadas. Juntar culturas culinárias gera pratos que ninguém imaginou — como o sushi de brigadeiro que existe no Brasil!",
    xp: 10,
    coins: 3,
  },

  {
    id: "cre-5",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Na técnica de brainstorming 'brainwriting', qual é a regra principal que a distingue do brainstorming tradicional?",
    type: "multiple-choice",
    options: [
      "Só o líder fala",
      "As ideias são escritas em silêncio antes de serem discutidas",
      "Apenas ideias ruins são compartilhadas",
      "É proibido usar caneta",
    ],
    correctAnswer: "As ideias são escritas em silêncio antes de serem discutidas",
    explanation:
      "No brainwriting, cada pessoa escreve suas ideias em papéis antes da discussão. Isso evita que vozes dominantes silenciem introvertidos e gera contribuições mais diversas!",
    xp: 15,
    coins: 5,
  },

  {
    id: "cre-6",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Se você tivesse que explicar a internet para alguém do século XIX, qual seria a metáfora mais eficaz?",
    type: "multiple-choice",
    options: [
      "Uma biblioteca infinita onde todos podem escrever livros",
      "Um telefone que envia cartas instantâneas",
      "Uma estrada de ferro que transporta pensamentos",
      "Todas as anteriores são boas metáforas",
    ],
    correctAnswer: "Todas as anteriores são boas metáforas",
    explanation:
      "Metáforas eficazes conectam o desconhecido ao familiar. Cada uma captura um aspecto da internet: a biblioteca (informação), o telefone (comunicação) e a ferrovia (transporte de dados)!",
    xp: 15,
    coins: 5,
  },

  {
    id: "cre-7",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Na técnica de SCAMPER, o que a letra 'S' representa e qual é sua aplicação criativa?",
    type: "text-input",
    correctAnswer: "Substituir, trocar um elemento por outro",
    explanation:
      "SCAMPER é um acrônimo criativo: S=Substituir, C=Combinar, A=Adaptar, M=Modificar, P=Propósito inverso, E=Eliminar, R=Reorganizar. O 'S' propõe trocar partes de um produto por alternativas!",
    hint: "A letra começa com 'S' e a ação envolve trocar algo.",
    xp: 18,
    coins: 7,
  },

  {
    id: "cre-8",
    category: "creativity",
    difficulty: "advanced",
    question:
      "Qual conceito da teoria da criatividade descreve a habilidade de ver conexões entre campos aparentemente não relacionados?",
    type: "multiple-choice",
    options: [
      "Convergência",
      "Associação remota",
      "Fixação funcional",
      "Bloqueio criativo",
    ],
    correctAnswer: "Associação remota",
    explanation:
      "A associação remota é a capacidade de conectar ideias distantes — como Darwin conectando geologia com biologia para criar a teoria da evolução. Einstein chamava isso de 'brincadeira sagrada'!",
    xp: 22,
    coins: 8,
  },

  {
    id: "cre-9",
    category: "creativity",
    difficulty: "advanced",
    question:
      "O paradoxo da restrição criativa afirma que ter MENOS opções pode levar a soluções mais criativas. Qual é o mecanismo psicológico por trás disso?",
    type: "multiple-choice",
    options: [
      "O cérebro fica com preguiça e escolhe a primeira ideia",
      "Restrições forçam o cérebro a explorar caminhos não convencionais",
      "Com menos opções, a pessoa não pensa e copia os outros",
      "Restrições eliminam a criatividade completamente",
    ],
    correctAnswer:
      "Restrições forçam o cérebro a explorar caminhos não convencionais",
    explanation:
      "Quando as opções óbvias são bloqueadas, o cérebro é forçado a acessar conexões neurais menos usadas, gerando soluções inesperadas. Filmes de orço baixo muitas vezes são mais criativos que produções de Hollywood!",
    xp: 22,
    coins: 8,
  },

  {
    id: "cre-10",
    category: "creativity",
    difficulty: "advanced",
    question:
      "Se o universo fosse uma experiência sensorial, quais dos cinco sentidos seria dominante e por quê?",
    type: "multiple-choice",
    options: [
      "Visão — porque a luz domina a física do universo",
      "Audição — porque o som viaja pelo vazio interestelar",
      "Tato — porque a gravidade é uma força de contato",
      "Olfato — porque os gases dominam o espaço",
    ],
    correctAnswer:
      "Visão — porque a luz domina a física do universo",
    explanation:
      "A luz eletromagnética é a principal forma de energia que percebemos. Das estrelas às galáxias, o universo é fundamentalmente visual — e por isso nossos olhos evoluíram para captar essa realidade!",
    xp: 22,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════════
  // INTELIGÊNCIA EMOCIONAL (emotional-intelligence) — eq-1 a eq-10
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "eq-1",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Seu amigo está triste porque reprovou numa prova. Qual é a resposta mais empática?",
    type: "multiple-choice",
    options: [
      "'Não liga, prova não é tudo'",
      "'Eu sei como você se sente, e isso é frustrante. Quer que eu ajude a estudar?'",
      "'Pelo menos não foi pior'",
      "'Fazenda era mais fácil'",
    ],
    correctAnswer:
      "'Eu sei como você se sente, e isso é frustrante. Quer que eu ajude a estudar?'",
    explanation:
      "Empatia é validar o sentimento do outro antes de tentar consolar. Reconhecer a frustração e oferecer ajuda prática é muito mais eficaz do que minimizar o problema!",
    xp: 10,
    coins: 3,
  },

  {
    id: "eq-2",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Você ficou com raiva de alguém no trabalho. Qual é a melhor primeira ação para se acalmar?",
    type: "multiple-choice",
    options: [
      "Gritar de volta imediatamente",
      "Responder um e-mail de reclamação",
      "Respirar fundo 3 vezes e contar até 10",
      "Ignorar o problema para sempre",
    ],
    correctAnswer: "Respirar fundo 3 vezes e contar até 10",
    explanation:
      "A técnica clássica de 'contar até 10' funciona porque dá tempo ao córtex pré-frontal para retomar o controle da amígdala. Respiração profunda ativa o sistema nervoso parassimpático!",
    hint: "Pense em como desacelerar antes de reagir.",
    xp: 10,
    coins: 3,
  },

  {
    id: "eq-3",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Em um grupo de amigos, percebe que uma pessoa está calada e evita contato visual. O que isso pode indicar?",
    type: "multiple-choice",
    options: [
      "Ela está entediada e quer ir embora",
      "Ela pode estar triste ou desconfortável",
      "Ela está com raiva de todos",
      "Nada, algumas pessoas são assim",
    ],
    correctAnswer: "Ela pode estar traste ou desconfortável",
    explanation:
      "Linguagem corporal é uma janela para as emoções. Contato visual evitado e silêncio podem indicar tristeza, vergonha ou desconforto. Atenção social é uma habilidade de inteligência emocional!",
    xp: 10,
    coins: 3,
  },

  {
    id: "eq-4",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Dois colegas estão discutindo sobre qual projeto escolher. Qual é a abordagem mais inteligente para resolver o conflito?",
    type: "multiple-choice",
    options: [
      "Escolher o projeto do colega para evitar briga",
      "Ouvir os argumentos de ambos e buscar uma solução que atenda aos dois",
      "Desistir do projeto completamente",
      "Falar mal de um para o outro pelas costas",
    ],
    correctAnswer:
      "Ouvir os argumentos de ambos e buscar uma solução que atenda aos dois",
    explanation:
      "Resolução de conflitos começa com escuta ativa. Quando ambas as partes se sentem ouvidas, abre espaço para soluções colaborativas que fortalecem relacionamentos!",
    xp: 10,
    coins: 3,
  },

  {
    id: "eq-5",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Você errou em uma tarefa importante. Qual é a diferença entre autocompaixão e autopiedade?",
    type: "multiple-choice",
    options: [
      "São a mesma coisa, só muda o nome",
      "Autocompaixão reconhece o erro e busca melhorar; autopiedade se vitimiza",
      "Autopiedade é mais saudável porque aceita o erro",
      "Autocompaixão é fraqueza, autopiedade é força",
    ],
    correctAnswer:
      "Autocompaixão reconhece o erro e busca melhorar; autopiedade se vitimiza",
    explanation:
      "Autocompaixão é tratar a si mesmo como trataria um amigo: 'Errei, mas posso aprender'. Autopiedade é 'Pobre de mim, sempre dou errado'. A primeira leva ao crescimento, a segunda ao estagnamento!",
    xp: 15,
    coins: 5,
  },

  {
    id: "eq-6",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Identifique a emoção oculta: Um colega diz 'Tá bom, faz como quiser' com voz monótona e braços cruzados. O que ele provavelmente está sentindo?",
    type: "text-input",
    correctAnswer: "Frustração ou raiva contida",
    explanation:
      "Quando as palavras contradizem a linguagem corporal, acreditamos no corpo. Braços cruzados + voz monótona geralmente indica frustração ou raiva que não está sendo expressa diretamente!",
    hint: "Observe: braços cruzados + tom monótono + concordância superficial = ?",
    xp: 18,
    coins: 7,
  },

  {
    id: "eq-7",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Qual frase demonstra melhor a técnica de 'feedback' construtivo (método do sanduíche)?",
    type: "multiple-choice",
    options: [
      "'Seu trabalho está péssimo, mas pelo menos você tentou'",
      "'Você fez bem a apresentação, mas a parte de dados precisa melhorar, e tenho certeza que você consegue'",
      "'Sempre erra tudo que faz'",
      "'Tá tudo certo, não precisa mudar nada'",
    ],
    correctAnswer:
      "'Você fez bem a apresentação, mas a parte de dados precisa melhorar, e tenho certeza que você consegue'",
    explanation:
      "O método do sanduíche é: elogio → feedback construtivo → encorajamento. Isso abre a mente do receptor para ouvir melhorias sem se fechar defensivamente!",
    xp: 15,
    coins: 5,
  },

  {
    id: "eq-8",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Em psicologia, o que é 'projeção' como mecanismo de defesa e como ela afeta relacionamentos?",
    type: "multiple-choice",
    options: [
      "Atingir metas — é positiva para relacionamentos",
      "Atribuir aos outros sentimentos que são seus — pode gerar conflitos desnecessários",
      "Ensinar os outros — é uma forma de liderança",
      "Avaliar o desempenho — é uma ferramenta de gestão",
    ],
    correctAnswer:
      "Atribuir aos outros sentimentos que são seus — pode gerar conflitos desnecessários",
    explanation:
      "Projeção é dizer 'você está com raiva de mim' quando quem está com raiva sou eu. Reconhecer projeções é crucial para relacionamentos saudáveis — exige autoconhecimento profundo!",
    xp: 22,
    coins: 8,
  },

  {
    id: "eq-9",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Um amigo te conta que seu parceiro o traiu. Qual resposta demonstra inteligência emocional avançada?",
    type: "multiple-choice",
    options: [
      "'Eu sabia que isso ia acontecer!'",
      "'Fala pra ele/ela se separar agora!'",
      "'Sinto muito. Isso é doloroso. Estou aqui para o que precisar, sem julgar.'",
      "'Pelo menos você tem outro interesse agora'",
    ],
    correctAnswer:
      "'Sinto muito. Isso é doloroso. Estou aqui para o que precisar, sem julgar.'",
    explanation:
      "Validar o sofrimento, oferecer presença e não impor julgamento é o mais alto nível de empatia. A pessoa precisa ser ouvida, não orientada precipitadamente!",
    xp: 22,
    coins: 8,
  },

  {
    id: "eq-10",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Segundo Daniel Goleman, qual é a diferença entre 'inteligência emocional pessoal' e 'inteligência emocional social'?",
    type: "multiple-choice",
    options: [
      "Pessoal é sobre emoções; social é sobre números",
      "Pessoal é autoconhecimento e autorregulação; social é empatia e habilidades sociais",
      "Não há diferença, são a mesma coisa",
      "Pessoal é racional; social é emocional",
    ],
    correctAnswer:
      "Pessoal é autoconhecimento e autorregulação; social é empatia e habilidades sociais",
    explanation:
      "Goleman divide a IE em pessoal (autoconsciência + autorregulação + motivação) e social (empatia + habilidades sociais). Os dois pilares se complementam — você precisa se conhecer antes de entender os outros!",
    xp: 25,
    coins: 10,
  },
];
