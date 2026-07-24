import type { BrainQuestion } from "./types";

export const BRAIN_QUESTIONS_FR: BrainQuestion[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MEMORY (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "mem-1",
    category: "memory",
    difficulty: "beginner",
    question:
      "Votre mère vous envoie au marché : riz, haricots, tomates et piment. Lequel ne vous a-t-elle PAS demandé d'acheter ?",
    type: "multiple-choice",
    options: ["Riz", "Haricots", "Ogi", "Piment"],
    correctAnswer: "Ogi",
    explanation:
      "Votre mère n'a pas mentionné l'ogi ! Vous l'avez ajouté vous-même. La mémoire consiste à retenir ce qu'on entend, pas ce qu'on suppose.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-2",
    category: "memory",
    difficulty: "beginner",
    question:
      "Combien de lettres contient le mot « Bananier » ?",
    type: "multiple-choice",
    options: ["7", "8", "9", "6"],
    correctAnswer: "8",
    explanation:
      "B-A-N-A-N-I-E-R = 8 lettres. Compter les lettres d'un mot est un excellent exercice pour renforcer la mémoire visuelle.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-3",
    category: "memory",
    difficulty: "beginner",
    question:
      "Vous.rangez vos clés dans une poche, puis votre sac, puis un tiroir. Où sont vos clés maintenant ?",
    type: "multiple-choice",
    options: ["Dans la poche", "Dans le sac", "Dans le tiroir", "Sur la table"],
    correctAnswer: "Dans le tiroir",
    explanation:
      "Vous avez déplacé vos clés du sac au tiroir. La mémoire de travail suit les étapes successives d'un déplacement.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-4",
    category: "memory",
    difficulty: "beginner",
    question:
      "Quel est le quatrième jour de la semaine en français ?",
    type: "multiple-choice",
    options: ["Mercredi", "Jeudi", "Vendredi", "Mardi"],
    correctAnswer: "Jeudi",
    explanation:
      "Lundi, mardi, mercredi, jeudi… Le jeudi est bien le quatrième jour. La mémorisation de séquences familières renforce la mémoire à court terme.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-5",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Écoutez cette séquence dans votre tête : bleu, rouge, vert, jaune, bleu, rouge. Quelle couleur suit le jaune ?",
    type: "multiple-choice",
    options: ["Vert", "Bleu", "Rouge", "Orange"],
    correctAnswer: "Bleu",
    explanation:
      "La séquence est : bleu, rouge, vert, jaune, bleu, rouge. Après le jaune vient bleu. Entraînez-vous à répéter des séquences pour améliorer votre mémoire auditive.",
    xp: 15,
    coins: 5,
  },
  {
    id: "mem-6",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Vous rencontrez une personne qui se présente sous le nom de Fatoumata. Plus tard dans la journée, vous oubliez son prénom. Quelle stratégie est la plus efficace pour s'en souvenir ?",
    type: "multiple-choice",
    options: [
      "Répéter le nom mentalement 3 fois",
      "Associer le nom à une image mentale",
      "Écrire le nom sur sa main",
      "Demander à nouveau le prénom",
    ],
    correctAnswer: "Associer le nom à une image mentale",
    explanation:
      "L'association visuelle crée un lien mémoriel plus fort que la simple répétition. Imaginez par exemple une fata (fatoumata) qui porte un grand chapeau — c'est plus marquant !",
    xp: 15,
    coins: 5,
  },
  {
    id: "mem-7",
    category: "memory",
    difficulty: "intermediate",
    question:
      "Voici une liste de courses : œufs, lait, pain, fromage, pommes, café. Si on retire « lait » et « fromage », combien d'items restent dans la liste d'origine ?",
    type: "multiple-choice",
    options: ["4", "6", "2", "5"],
    correctAnswer: "4",
    explanation:
      "La liste d'origine comptait 6 éléments. En retirant le lait et le fromage, il en reste 4 : œufs, pain, pommes et café. La mémoire de travail vous permet de manipuler des informations en tête sans les oublier.",
    xp: 15,
    coins: 5,
  },
  {
    id: "mem-8",
    category: "memory",
    difficulty: "advanced",
    question:
      "Quel chiffre manque dans cette séquence ? 2, 6, 12, 20, 30, ?",
    type: "multiple-choice",
    options: ["40", "42", "36", "44"],
    correctAnswer: "42",
    explanation:
      "Les écarts sont 4, 6, 8, 10, 12. Chaque fois l'écart augmente de 2. Donc 30 + 12 = 42. La mémoire des patrons numériques est essentielle pour le raisonnement rapide.",
    xp: 22,
    coins: 8,
  },
  {
    id: "mem-9",
    category: "memory",
    difficulty: "advanced",
    question:
      "Vous êtes à Dakar et vous vous garez dans un parking souterrain. Vous êtes au niveau B3, poste 47. En sortant, vous montez 2 niveaux. À quel niveau êtes-vous maintenant ?",
    type: "multiple-choice",
    options: ["B1", "B5", "Niveau 0", "B2"],
    correctAnswer: "B1",
    explanation:
      "De B3, en montant 2 niveaux : B3 → B2 → B1. La mémoire spatiale et la compréhension des niveaux négatifs sont des compétences essentielles au quotidien.",
    xp: 22,
    coins: 8,
  },
  {
    id: "mem-10",
    category: "memory",
    difficulty: "advanced",
    question:
      "Écrivez le nombre de lettres « e » dans la phrase suivante : « Le élégant élève allemand est allé à l'école. »",
    type: "text-input",
    correctAnswer: "12",
    explanation:
      "Il y a 12 lettres « e » dans cette phrase. Compter des lettres spécifiques dans une phrase longue sollicite l'attention sélective et la mémoire de travail — deux piliers de la mémoire.",
    hint: "Comptez chaque « e » un par un, en ne passant pas à la lettre suivante tant que vous n'avez pas validé la courante.",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOCUS (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "foc-1",
    category: "focus",
    difficulty: "beginner",
    question:
      "Combien de fois la lettre « s » apparaît-elle dans le mot « stress » ?",
    type: "multiple-choice",
    options: ["2", "3", "1", "4"],
    correctAnswer: "3",
    explanation:
      "S-T-R-E-S-S contient trois « s ». La focalisation sur des détails précis comme les lettres répétées entraîne votre attention sélective.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-2",
    category: "focus",
    difficulty: "beginner",
    question:
      "Complétez ce proverbe français : « Petit à petit, l'oiseau fait… »",
    type: "multiple-choice",
    options: ["Son nid", "Son chemin", "Son vol", "Son chant"],
    correctAnswer: "Son nid",
    explanation:
      "« Petit à petit, l'oiseau fait son nid. » Ce proverbe enseigne la patience et la persévérance. La concentration sur les connaissances culturelles renforce la mémoire à long terme.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-3",
    category: "focus",
    difficulty: "beginner",
    question:
      "Dans cette série, quel élément ne fait pas partie du groupe : poulet, bœuf, poisson, voiture ?",
    type: "multiple-choice",
    options: ["Poulet", "Bœuf", "Poisson", "Voiture"],
    correctAnswer: "Voiture",
    explanation:
      "La voiture n'est pas un aliment ! Repérer l'intrus dans une liste est un exercice classique d'attention et de catégorisation.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-4",
    category: "focus",
    difficulty: "beginner",
    question:
      "Lisez cette phrase rapidement : « Le chat noir dort sur le tapis rouge. » De quelle couleur est le tapis ?",
    type: "multiple-choice",
    options: ["Rouge", "Noir", "Gris", "Blanc"],
    correctAnswer: "Rouge",
    explanation:
      "Le tapis est rouge. Il est facile de confondre les couleurs quand on lit trop vite. La lecture attentive est une forme fondamentale de concentration.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-5",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Comptez combien de syllabes contient le mot « ordinateur ».",
    type: "multiple-choice",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
    explanation:
      "Or-di-na-teur = 5 syllabes. Découper les mots en syllabes est un exercice de concentration qui améliore la conscience phonologique.",
    xp: 15,
    coins: 5,
  },
  {
    id: "foc-6",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Dans la phrase « Le professeur a dit que la leçon serait annulée hier », quelle information est illogique ?",
    type: "multiple-choice",
    options: [
      "Le professeur a dit quelque chose",
      "La leçon serait annulée",
      "La leçon serait annulée hier",
      "Il n'y a rien d'illogique",
    ],
    correctAnswer: "La leçon serait annulée hier",
    explanation:
      "On ne peut pas annuler une leçon pour « hier » (le passé est déjà passé). La logique temporelle demande une attention particulière aux adverbes de temps.",
    xp: 15,
    coins: 5,
  },
  {
    id: "foc-7",
    category: "focus",
    difficulty: "intermediate",
    question:
      "Quel mot dans cette liste est le plus long ? Afrique, Éthiopie, Madagascar, République.",
    type: "multiple-choice",
    options: ["Madagascar", "Éthiopie", "République", "Afrique"],
    correctAnswer: "Madagascar",
    explanation:
      "Madagascar = 10 lettres, République = 10 lettres aussi ! Attention, les deux sont à égalité. Comparer la longueur de mots de noms propres teste votre capacité d'analyse visuelle rapide.",
    xp: 15,
    coins: 5,
  },
  {
    id: "foc-8",
    category: "focus",
    difficulty: "advanced",
    question:
      "Dans un groupe de 12 personnes, chaque personne serre la main exactement une fois avec chaque autre personne. Combien de poignées de main au total ?",
    type: "multiple-choice",
    options: ["66", "12", "132", "24"],
    correctAnswer: "66",
    explanation:
      "Formule : n × (n-1) / 2 = 12 × 11 / 2 = 66. Chaque paire unique compte une seule poignée de main. La combinaison mathématique demande une concentration rigoureuse.",
    xp: 22,
    coins: 8,
  },
  {
    id: "foc-9",
    category: "focus",
    difficulty: "advanced",
    question:
      "Lisez attentivement : « Si aujourd'hui est mardi, dans 3 jours ce sera vendredi, et il y a 5 jours c'était jeudi. » Combien d'erreurs contient cette phrase ?",
    type: "multiple-choice",
    options: ["0", "1", "2", "3"],
    correctAnswer: "1",
    explanation:
      "Si aujourd'hui est mardi, dans 3 jours ce sera vendredi — c'est correct (mercredi, jeudi, vendredi). Mais il y a 5 jours, c'était samedi (pas jeudi). Il y a donc 1 seule erreur.",
    xp: 22,
    coins: 8,
  },
  {
    id: "foc-10",
    category: "focus",
    difficulty: "advanced",
    question:
      "Combien de lettres « a » dans la phrase suivante : « Papa et Maman allaient à la plage avec Anna » ?",
    type: "text-input",
    correctAnswer: "12",
    explanation:
      "Il y a 12 lettres « a » dans cette phrase. Exercice d'attention sélective intense — prendre le temps de lire lettre par lettre est la clé de la précision.",
    hint: "Notez chaque occurrence de « a » en dessous de la phrase pour ne rien manquer.",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THINKING (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "thk-1",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Si un tissu coûte 500 FCFA et vous en achetez 3, combien payez-vous au total ?",
    type: "multiple-choice",
    options: ["1 500 FCFA", "2 000 FCFA", "1 000 FCFA", "1 200 FCFA"],
    correctAnswer: "1 500 FCFA",
    explanation:
      "500 × 3 = 1 500 FCFA. Les multiplications simples sont la base du raisonnement mathématique au quotidien, surtout au marché !",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-2",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Il est 14h30. Dans combien de temps sera-t-il 16h00 ?",
    type: "multiple-choice",
    options: ["1h30", "2h00", "2h30", "1h00"],
    correctAnswer: "1h30",
    explanation:
      "De 14h30 à 16h00, il y a 1 heure et 30 minutes. Le calcul du temps écoulé est une compétence de raisonnement essentielle dans la vie de tous les jours.",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-3",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Quel mot dans cette phrase est un fait vérifiable et non une opinion : « Le Sénégal est un beau pays » ?",
    type: "multiple-choice",
    options: [
      "Le Sénégal est un beau pays",
      "Le Sénégal est en Afrique de l'Ouest",
      "Le Sénégal a la meilleure cuisine",
      "Le Sénégal est le plus beau pays",
    ],
    correctAnswer: "Le Sénégal est en Afrique de l'Ouest",
    explanation:
      "« Le Sénégal est en Afrique de l'Ouest » est un fait géographique vérifiable. « Beau », « meilleur », « plus beau » sont des opinions subjectives. Distinguer fait et opinion est crucial pour la pensée critique.",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-4",
    category: "thinking",
    difficulty: "beginner",
    question:
      "Si vous avez 12 œufs et que vous en cassez 3, combien vous en reste-t-il ?",
    type: "multiple-choice",
    options: ["9", "12", "6", "15"],
    correctAnswer: "9",
    explanation:
      "12 − 3 = 9. Attention à ne pas suranalyser — la question est simple. Parfois la pensée critique consiste à accepter la réponse évidente.",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-5",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "Un bus part de Bamako à 8h00 et arrive à Dakar à 14h00. Le trajet dure combien d'heures ?",
    type: "multiple-choice",
    options: ["6 heures", "8 heures", "4 heures", "5 heures"],
    correctAnswer: "6 heures",
    explanation:
      "De 8h00 à 14h00 = 14 − 8 = 6 heures. Le calcul de durée entre deux heures est un exercice classique de raisonnement temporel.",
    xp: 15,
    coins: 5,
  },
  {
    id: "thk-6",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "Dans quelle direction se trouvent les États-Unis par rapport à la France ?",
    type: "multiple-choice",
    options: ["Ouest", "Est", "Nord", "Sud"],
    correctAnswer: "Ouest",
    explanation:
      "Les États-Unis se trouvent à l'ouest de la France, de l'autre côté de l'Atlantique. La géographie est un pilier de la pensée analytique et de la compréhension du monde.",
    xp: 15,
    coins: 5,
  },
  {
    id: "thk-7",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "Si A + B = 10 et A = 4, quelle est la valeur de B ?",
    type: "multiple-choice",
    options: ["6", "14", "4", "8"],
    correctAnswer: "6",
    explanation:
      "Si A = 4, alors 4 + B = 10, donc B = 10 − 4 = 6. L'algebra de base est l'outil fondamental de la résolution de problèmes.",
    xp: 15,
    coins: 5,
  },
  {
    id: "thk-8",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Vous avez 3 chemises (rouge, bleue, blanche) et 2 pantalons (noir, beige). Combien de combinaisons différentes pouvez-vous créer ?",
    type: "multiple-choice",
    options: ["5", "6", "8", "4"],
    correctAnswer: "6",
    explanation:
      "3 chemises × 2 pantalons = 6 combinaisons. Le principe de comptage multiplicatif est fondamental en mathématiques et en logique.",
    xp: 22,
    coins: 8,
  },
  {
    id: "thk-9",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Un fermier a des poules et des lapins. Au total, il y a 20 têtes et 54 pattes. Combien de lapins a-t-il ?",
    type: "multiple-choice",
    options: ["7", "13", "10", "6"],
    correctAnswer: "7",
    explanation:
      "Si toutes les bêtes étaient des poules : 20 × 2 = 40 pattes. Il manque 54 − 40 = 14 pattes. Chaque lapin a 2 pattes de plus qu'un poulet. 14 / 2 = 7 lapins. Un classique de logique !",
    xp: 22,
    coins: 8,
  },
  {
    id: "thk-10",
    category: "thinking",
    difficulty: "advanced",
    question:
      "Combien de côtés possède un polygone qui a 5 diagonales ?",
    type: "text-input",
    correctAnswer: "5",
    explanation:
      "La formule du nombre de diagonales est n(n-3)/2. Si n = 5, alors 5 × 2 / 2 = 5 diagonales. Un pentagone (5 côtés) a bien 5 diagonales. Le raisonnement mathématique inversé est un exercice avancé mais très gratifiant !",
    hint: "La formule est n(n-3)/2. Essayez : si n = 4, le résultat est 2. Si n = 5, que donne-t-il ?",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEARNING (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "lrn-1",
    category: "learning",
    difficulty: "beginner",
    question:
      "Quelle est la capitale du Sénégal ?",
    type: "multiple-choice",
    options: ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor"],
    correctAnswer: "Dakar",
    explanation:
      "Dakar est la capitale et la plus grande ville du Sénégal. Connaître les capitales est une base essentielle de culture générale.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-2",
    category: "learning",
    difficulty: "beginner",
    question:
      "Combien de continents existe-t-il sur Terre ?",
    type: "multiple-choice",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    explanation:
      "Les 7 continents sont : Afrique, Amérique du Nord, Amérique du Sud, Antarctique, Asie, Europe et Océanie. La connaissance du monde est la clé de l'ouverture d'esprit.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-3",
    category: "learning",
    difficulty: "beginner",
    question:
      "Quel organe du corps humain pompe le sang ?",
    type: "multiple-choice",
    options: ["Le cœur", "Le cerveau", "Les poumons", "Les reins"],
    correctAnswer: "Le cœur",
    explanation:
      "Le cœur est un muscle qui pompe environ 7 500 litres de sang par jour. Connaître son corps est le premier pas vers une meilleure santé.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-4",
    category: "learning",
    difficulty: "beginner",
    question:
      "En quelle année Christophe Colomb a-t-il découvert l'Amérique ?",
    type: "multiple-choice",
    options: ["1492", "1789", "1914", "1066"],
    correctAnswer: "1492",
    explanation:
      "En 1492, Christophe Colomb a atteint les Amériques. Cette date marque un tournant majeur de l'histoire mondiale. Retenir les dates clés structure notre compréhension du passé.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-5",
    category: "learning",
    difficulty: "intermediate",
    question:
      "Quel est le plus long fleuve d'Afrique ?",
    type: "multiple-choice",
    options: ["Le Nil", "Le Congo", "Le Niger", "Le Sénégal"],
    correctAnswer: "Le Nil",
    explanation:
      "Le Nil s'étend sur environ 6 650 km, ce qui en fait le plus long fleuve d'Afrique (et l'un des plus longs au monde). La géographie physique enrichit notre compréhension de l'environnement.",
    xp: 15,
    coins: 5,
  },
  {
    id: "lrn-6",
    category: "learning",
    difficulty: "intermediate",
    question:
      "Dans le système solaire, quelle planète est la plus proche du Soleil ?",
    type: "multiple-choice",
    options: ["Mercure", "Vénus", "Terre", "Mars"],
    correctAnswer: "Mercure",
    explanation:
      "Mercure orbite à environ 58 millions de km du Soleil, ce qui en fait la planète la plus proche. L'astronomie nous rappelle notre place dans l'univers.",
    xp: 15,
    coins: 5,
  },
  {
    id: "lrn-7",
    category: "learning",
    difficulty: "intermediate",
    question:
      "Quel mot français signifie « une grande peur soudaine » et commence par la lettre P ?",
    type: "multiple-choice",
    options: ["Panique", "Peur", "Péril", "Panic"],
    correctAnswer: "Panique",
    explanation:
      "La « panique » est une peur intense et soudaine qui pousse à fuir. Enrichir son vocabulaire rend la communication plus précise et plus expressive.",
    xp: 15,
    coins: 5,
  },
  {
    id: "lrn-8",
    category: "learning",
    difficulty: "advanced",
    question:
      "Quel est le nom scientifique du fémur ?",
    type: "multiple-choice",
    options: [
      "Os le plus long du corps",
      "Os du bras",
      "Os du genou",
      "Os du crâne",
    ],
    correctAnswer: "Os le plus long du corps",
    explanation:
      "Le fémur est l'os le plus long et le plus fort du corps humain. Il se trouve dans la cuisse. Connaître l'anatomie de base aide à mieux comprendre les messages médicaux.",
    xp: 22,
    coins: 8,
  },
  {
    id: "lrn-9",
    category: "learning",
    difficulty: "advanced",
    question:
      "En quelle année Nelson Mandela est-il devenu le premier président noir d'Afrique du Sud ?",
    type: "multiple-choice",
    options: ["1994", "1990", "1980", "2000"],
    correctAnswer: "1994",
    explanation:
      "Nelson Mandela a été élu président en 1994, mettant fin à l'apartheid. Cette date symbolise la lutte pour l'égalité dans le monde entier.",
    xp: 22,
    coins: 8,
  },
  {
    id: "lrn-10",
    category: "learning",
    difficulty: "advanced",
    question:
      "Quel gaz les plantes absorbent-elles principalement pour la photosynthèse ?",
    type: "text-input",
    correctAnswer: "CO2",
    explanation:
      "Les plantes absorbent le dioxyde de carbone (CO2) et rejettent de l'oxygène (O2). La photosynthèse est le processus fondamental qui rend la vie possible sur Terre.",
    hint: "C'est un gaz formé d'un atome de carbone et de deux atomes d'oxygène. On l'écrit avec une formule chimique.",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // HEALTH (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "hlth-1",
    category: "health",
    difficulty: "beginner",
    question:
      "Combien d'heures de sommeil sont recommandées pour un adulte par nuit ?",
    type: "multiple-choice",
    options: ["7 à 9 heures", "4 à 5 heures", "10 à 12 heures", "3 à 4 heures"],
    correctAnswer: "7 à 9 heures",
    explanation:
      "Les adultes ont besoin de 7 à 9 heures de sommeil pour que le cerveau consolide les souvenirs et régénère les cellules. Le sommeil est le fondement de la santé cérébrale.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-2",
    category: "health",
    difficulty: "beginner",
    question:
      "Quelle boisson est la meilleure pour rester hydraté au quotidien ?",
    type: "multiple-choice",
    options: ["L'eau", "Le jus d'orange", "Le café", "Le soda"],
    correctAnswer: "L'eau",
    explanation:
      "L'eau est essentielle à toutes les fonctions du corps. Boire au moins 1,5 litre par jour aide le cerveau à rester alerte et performant.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-3",
    category: "health",
    difficulty: "beginner",
    question:
      "Marcher 30 minutes par jour est bénéfique pour le cerveau. Pourquoi ?",
    type: "multiple-choice",
    options: [
      "Cela améliore la circulation sanguine vers le cerveau",
      "Cela fait grandir les cheveux",
      "Cela change la couleur des yeux",
      "Cela remplace le sommeil",
    ],
    correctAnswer: "Cela améliore la circulation sanguine vers le cerveau",
    explanation:
      "L'exercice physique augmente le flux sanguin vers le cerveau, améliorant la mémoire et la concentration. Même une simple marche fait toute la différence !",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-4",
    category: "health",
    difficulty: "beginner",
    question:
      "Quel aliment est riche en oméga-3, essentiels pour le cerveau ?",
    type: "multiple-choice",
    options: ["Le poisson gras", "Le pain blanc", "Le sucre", "Le sel"],
    correctAnswer: "Le poisson gras",
    explanation:
      "Les poissons gras (thon, saumon, sardines) contiennent des oméga-3 qui favorisent le développement et le fonctionnement du cerveau.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-5",
    category: "health",
    difficulty: "intermediate",
    question:
      "Qu'est-ce que le « brouillard cérébral » (brain fog) ?",
    type: "multiple-choice",
    options: [
      "Une confusion mentale et un manque de clarté",
      "Un type de nuage météorologique",
      "Une maladie du poumon",
      "Un syndrome de la jambe sans repos",
    ],
    correctAnswer: "Une confusion mentale et un manque de clarté",
    explanation:
      "Le brouillard cérébral se manifeste par de la confusion, de la fatigue mentale et des difficultés de concentration. Il peut être causé par le stress, le manque de sommeil ou une mauvaise alimentation.",
    xp: 15,
    coins: 5,
  },
  {
    id: "hlth-6",
    category: "health",
    difficulty: "intermediate",
    question:
      "Combien de temps faut-il méditer par jour pour commencer à ressentir des bénéfices ?",
    type: "multiple-choice",
    options: [
      "5 à 10 minutes",
      "1 heure minimum",
      "30 minutes strictement",
      "Aucun temps, c'est inutile",
    ],
    correctAnswer: "5 à 10 minutes",
    explanation:
      "Des études montrent que même 5 à 10 minutes de méditation quotidienne réduisent le stress et améliorent la concentration. La régularité est plus importante que la durée.",
    xp: 15,
    coins: 5,
  },
  {
    id: "hlth-7",
    category: "health",
    difficulty: "intermediate",
    question:
      "Quel est l'impact du stress chronique sur le cerveau ?",
    type: "multiple-choice",
    options: [
      "Il réduit le volume de l'hippocampe",
      "Il agrandit le cerveau",
      "Il améliore la mémoire",
      "Il n'a aucun effet",
    ],
    correctAnswer: "Il réduit le volume de l'hippocampe",
    explanation:
      "Le stress chronique peut rétrécir l'hippocampe (centre de la mémoire) et nuire à l'apprentissage. Gérer son stress est donc essentiel pour protéger son cerveau.",
    xp: 15,
    coins: 5,
  },
  {
    id: "hlth-8",
    category: "health",
    difficulty: "advanced",
    question:
      "Quel est l'effet de l'exercice physique intense sur la production de BDNF (Brain-Derived Neurotrophic Factor) ?",
    type: "multiple-choice",
    options: [
      "Il augmente sa production",
      "Il diminue sa production",
      "Il n'a aucun effet",
      "Il le transforme en cortisol",
    ],
    correctAnswer: "Il augmente sa production",
    explanation:
      "L'exercice intense stimule la production de BDNF, une protéine qui favorise la croissance de nouveaux neurones et renforce les connexions synaptiques. C'est comme un « fertilisant pour le cerveau ».",
    xp: 22,
    coins: 8,
  },
  {
    id: "hlth-9",
    category: "health",
    difficulty: "advanced",
    question:
      "Quel est l'effet de la lumière bleue des écrans sur la production de mélatonine ?",
    type: "multiple-choice",
    options: [
      "Elle réduit la production",
      "Elle augmente la production",
      "Elle n'a aucun effet",
      "Elle stimule le foie",
    ],
    correctAnswer: "Elle réduit la production",
    explanation:
      "La lumière bleue des écrans freine la production de mélatonine, l'hormone du sommeil. C'est pourquoi on recommande d'éviter les écrans au moins 30 minutes avant de dormir.",
    xp: 22,
    coins: 8,
  },
  {
    id: "hlth-10",
    category: "health",
    difficulty: "advanced",
    question:
      "En médecine traditionnelle africaine, quelle plante est couramment utilisée pour soulager les maux de tête et les douleurs ?",
    type: "text-input",
    correctAnswer: "Artemisia",
    explanation:
      "L'Artemisia (surtout Artemisia annua) est utilisée en Afrique de l'Ouest pour ses propriétés médicinales. Elle est particulièrement connue pour ses vertus antipaludiques, mais aussi pour soulager les douleurs. Les remèdes naturels font partie intégrante de la santé au quotidien.",
    hint: "C'est le nom latin d'une plante dont le nom commun en français est « armoise ».",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // CREATIVITY (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "cre-1",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Combien d'utilisations possibles pouvez-vous trouver pour une bouteille en plastique ?",
    type: "multiple-choice",
    options: [
      "Moins de 3",
      "Entre 3 et 5",
      "Plus de 5",
      "Aucune, c'est juste une poubelle",
    ],
    correctAnswer: "Plus de 5",
    explanation:
      "Une bouteille peut devenir un arrosoir, un pot de fleurs, un jouet, un réservoir d'eau, un porte-stylos… La pensée divergente, c'est voir le potentiel caché dans les objets du quotidien.",
    xp: 10,
    coins: 3,
  },
  {
    id: "cre-2",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Complétez cette métaphore : « Le vent soufflait si fort que les arbres dansaient comme… »",
    type: "multiple-choice",
    options: [
      "Des danseuses sur une scène",
      "Des poteaux",
      "Des rochers",
      "Des murs",
    ],
    correctAnswer: "Des danseuses sur une scène",
    explanation:
      "Comparer les arbres à des danseuses est une métaphore vivante et poétique. La pensée metaphorique est un pilier de la créativité — elle connecte des idées différentes entre elles.",
    xp: 10,
    coins: 3,
  },
  {
    id: "cre-3",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Si vous pouviez inventer un nouvel animal, quelle combinaison choisiriez-vous ?",
    type: "multiple-choice",
    options: [
      "Un lion avec des ailes",
      "Un poisson avec des pattes",
      "Un oiseau avec une carapace",
      "Toutes ces réponses sont créatives",
    ],
    correctAnswer: "Toutes ces réponses sont créatives",
    explanation:
      "Aucune réponse n'est fausse ! La créativité n'a pas de bonnes ou mauvaises réponses. Ce qui compte, c'est la capacité à imaginer et à combiner des idées de manière inédite.",
    xp: 10,
    coins: 3,
  },
  {
    id: "cre-4",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Quel mot est le plus proche de « soleil » dans une pensée créative ?",
    type: "multiple-choice",
    options: ["Énergie", "Pierre", "Eau", "Ombre"],
    correctAnswer: "Énergie",
    explanation:
      "Le soleil est une source d'énergie. Les associations d'idées libres — comme soleil et énergie — stimulent la créativité en créant de nouvelles connexions mentales.",
    xp: 10,
    coins: 3,
  },
  {
    id: "cre-5",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Vous devez raconter une histoire en utilisant uniquement 3 mots. Lesquels choisissez-vous ?",
    type: "multiple-choice",
    options: [
      "Pluie, voyage, espoir",
      "A, B, C",
      "Bonne, mauvaise, normal",
      "Un, deux, trois",
    ],
    correctAnswer: "Pluie, voyage, espoir",
    explanation:
      "Ces trois mots créent une narration riche et émotionnelle. La créativité sous contrainte (peu de mots) force l'esprit à être plus inventif et concis.",
    xp: 15,
    coins: 5,
  },
  {
    id: "cre-6",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Quel est le meilleur moyen de stimuler la créativité en groupe ?",
    type: "multiple-choice",
    options: [
      "Le brainstorming sans jugement",
      "La critique de chaque idée",
      "Le vote rapide",
      "Le silence total",
    ],
    correctAnswer: "Le brainstorming sans jugement",
    explanation:
      "Le brainstorming repose sur le principe de defer — on émet toutes les idées sans les critiquer. La quantité mène à la qualité : parmi 100 idées, une peut être brillante.",
    xp: 15,
    coins: 5,
  },
  {
    id: "cre-7",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "Si la musique était une couleur, quelle couleur serait le jazz ?",
    type: "multiple-choice",
    options: ["Bleu profond", "Rouge vif", "Blanc pur", "Gris foncé"],
    correctAnswer: "Bleu profond",
    explanation:
      "Le jazz, avec ses improvisations et ses nuances, évoque le bleu profond — une couleur associée à l'émotion, à la profondeur et à la créativité. Les synesthésies (associer des sens différents) nourrissent l'imagination.",
    xp: 15,
    coins: 5,
  },
  {
    id: "cre-8",
    category: "creativity",
    difficulty: "advanced",
    question:
      "Vous ne pouvez utiliser que des mots en 4 lettres pour écrire une phrase de 3 mots. Laquelle de ces phrases est possible ?",
    type: "multiple-choice",
    options: [
      "Lune nuit voir",
      "Belle maison grande",
      "Aller chercher eau",
      "Rouge terre fleur",
    ],
    correctAnswer: "Lune nuit voir",
    explanation:
      "Lune (4), nuit (4), voir (4) — tous les mots font bien 4 lettres. La contrainte créative pousse à être inventif et à trouver des combinaisons inattendues. C'est l'essence de la poésie et de l'écriture créative.",
    xp: 22,
    coins: 8,
  },
  {
    id: "cre-9",
    category: "creativity",
    difficulty: "advanced",
    question:
      "Comment s'appelle la technique de créativité qui consiste à se demander « Et si… ? » pour explorer des scénarios alternatifs ?",
    type: "multiple-choice",
    options: [
      "La pensée contrefactuelle",
      "La pensée linéaire",
      "Le raisonnement logique",
      "L'analyse statistique",
    ],
    correctAnswer: "La pensée contrefactuelle",
    explanation:
      "La pensée contrefactuelle (« Et si… ») est un outil puissant pour imaginer des scénarios alternatifs et développer la créativité. C'est ainsi que les inventeurs trouvent de nouvelles solutions.",
    xp: 22,
    coins: 8,
  },
  {
    id: "cre-10",
    category: "creativity",
    difficulty: "advanced",
    question:
      "Inventez un mot de 6 lettres qui décrit un sentiment mélangeant la joie et la nostalgie. Donnez une seule réponse possible (cela peut être un mot inventé).",
    type: "text-input",
    correctAnswer: "joissance",
    explanation:
      "« Joissance » (joie + nostalgie) est un exemple de mot-valise créatif. Inventer des mots pour nommer des émotions non exprimées est un acte profondément créatif — c'est ainsi que la langue évolue !",
    hint: "Combinez un mot lié à la joie avec un suffixe évoquant la sensation ou le souvenir.",
    xp: 25,
    coins: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // EMOTIONAL INTELLIGENCE (10 questions)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "eq-1",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Votre ami(e) pleure parce qu'il/elle a raté un examen. Quelle est la meilleure première réaction ?",
    type: "multiple-choice",
    options: [
      "L'écouter et valider son émotion",
      "Lui dire « Ce n'est pas grave »",
      "Changer de sujet",
      "Lui dire de pleurer plus fort",
    ],
    correctAnswer: "L'écouter et valider son émotion",
    explanation:
      "Valider l'émotion de quelqu'un (« Je comprends que tu sois déçu(e) ») crée un espace sûr. Dire « ce n'est pas grave » minimise le ressenti de l'autre, même avec les meilleures intentions.",
    xp: 10,
    coins: 3,
  },
  {
    id: "eq-2",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Qu'est-ce que l'empathie ?",
    type: "multiple-choice",
    options: [
      "La capacité à comprendre et ressentir les émotions des autres",
      "Le fait de pleurer avec quelqu'un",
      "Donner des conseils non sollicités",
      "L'imagination créative",
    ],
    correctAnswer: "La capacité à comprendre et ressentir les émotions des autres",
    explanation:
      "L'empathie va au-delà de la simple sympathie. C'est se mettre à la place de l'autre pour comprendre son vécu, sans nécessairement partager son expérience.",
    xp: 10,
    coins: 3,
  },
  {
    id: "eq-3",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Vous êtes en colère après une dispute. Quelle est la meilleure chose à faire ?",
    type: "multiple-choice",
    options: [
      "Prendre une pause avant de réagir",
      "Crier immédiatement",
      "Envoyer un message furieux",
      "Ignorer la personne définitivement",
    ],
    correctAnswer: "Prendre une pause avant de réagir",
    explanation:
      "La régulation émotionnelle commence par un moment de pause. Respirer profondément et attendre que la colère diminue permet de répondre de manière réfléchie plutôt que réactive.",
    xp: 10,
    coins: 3,
  },
  {
    id: "eq-4",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Dans un conflit, quelle attitude est la plus constructive ?",
    type: "multiple-choice",
    options: [
      "Chercher une solution ensemble",
      "Avoir toujours raison",
      "Faire semblant que ça n'arrive pas",
      "Se mettre en colère plus fort que l'autre",
    ],
    correctAnswer: "Chercher une solution ensemble",
    explanation:
      "La résolution de conflits repose sur la collaboration, pas sur la domination. Écouter, comprendre et trouver un terrain d'entente renforce les relations.",
    xp: 10,
    coins: 3,
  },
  {
    id: "eq-5",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Qu'est-ce que la « self-compassion » (bienveillance envers soi-même) ?",
    type: "multiple-choice",
    options: [
      "Se traiter avec douceur lorsqu'on échoue",
      "S'excuser toujours pour tout",
      "Éviter tous les problèmes",
      "Se juger sévèrement pour progresser",
    ],
    correctAnswer: "Se traiter avec douceur lorsqu'on échoue",
    explanation:
      "La bienveillance envers soi-même signifie s'accepter avec ses erreurs, comme on le ferait pour un ami. Les recherches montrent qu'elle réduit l'anxiété et améliore la résilience.",
    xp: 15,
    coins: 5,
  },
  {
    id: "eq-6",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Un collègue fait un commentaire blessant devant tout le monde. Quelle est la réponse la plus mature ?",
    type: "multiple-choice",
    options: [
      "En parler calmement en privé avec lui",
      "Répondre sur le même ton devant tout le monde",
      "Rester silencieux et garder la rancune",
      "Se plaindre à tous les autres collègues",
    ],
    correctAnswer: "En parler calmement en privé avec lui",
    explanation:
      "La communication assertive — exprimer son ressenti calmement, en privé — est la marque d'une intelligence émotionnelle développée. Elle préserve la dignité de tous.",
    xp: 15,
    coins: 5,
  },
  {
    id: "eq-7",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "Quel est le lien entre les émotions et les décisions ?",
    type: "multiple-choice",
    options: [
      "Les émotions influencent fortement nos choix",
      "Les émotions n'ont aucun lien avec les décisions",
      "Les émotions doivent toujours être ignorées",
      "Les émotions remplacent la logique",
    ],
    correctAnswer: "Les émotions influencent fortement nos choix",
    explanation:
      "Neuroscientifiquement, les émotions jouent un rôle crucial dans la prise de décision. Comprendre ses émotions permet de faire de meilleurs choix, pas de les ignorer.",
    xp: 15,
    coins: 5,
  },
  {
    id: "eq-8",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Qu'est-ce que la « régulation émotionnelle réactive » par rapport à la « proactive » ?",
    type: "multiple-choice",
    options: [
      "Réagir après qu'une émotion forte est apparue",
      "Prévenir les émotions avant qu'elles n'apparaissent",
      "Exprimer immédiatement toutes ses émotions",
      "Ne jamais ressentir d'émotions fortes",
    ],
    correctAnswer: "Réagir après qu'une émotion forte est apparue",
    explanation:
      "La régulation réactive consiste à gérer ses émotions après leur apparition (respiration, recadrage). La proactive consiste à les anticiper (préparation, habitudes saines). Les deux sont complémentaires et essentielles.",
    xp: 22,
    coins: 8,
  },
  {
    id: "eq-9",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Dans la communication non violente (CNV), quelles sont les 4 étapes dans l'ordre correct ?",
    type: "multiple-choice",
    options: [
      "Observation, sentiment, besoin, demande",
      "Demande, observation, sentiment, besoin",
      "Sentiment, observation, demande, besoin",
      "Besoin, demande, observation, sentiment",
    ],
    correctAnswer: "Observation, sentiment, besoin, demande",
    explanation:
      "La CNV de Marshall Rosenberg suit cet ordre : 1) Observer sans juger, 2) Exprimer son sentiment, 3) Identifier le besoin, 4) Formuler une demande. C'est un outil puissant pour résoudre les conflits avec compassion.",
    xp: 22,
    coins: 8,
  },
  {
    id: "eq-10",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "Selon les travaux de Daniel Goleman, combien de piliers composent l'intelligence émotionnelle ?",
    type: "text-input",
    correctAnswer: "5",
    explanation:
      "Daniel Goleman identifie 5 piliers de l'intelligence émotionnelle : 1) la conscience de soi, 2) l'autorégulation, 3) la motivation, 4) l'empathie, 5) les compétences sociales. Ces cinq piliers forment le socle d'une vie relationnelle épanouie.",
    hint: "C'est un nombre entre 4 et 6. Le modèle est souvent représenté sous forme de pentagone ou de diagramme en 5 parties.",
    xp: 25,
    coins: 10,
  },
];
