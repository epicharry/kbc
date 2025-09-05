export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'agents' | 'maps' | 'weapons' | 'gameplay' | 'esports';
  imageUrl?: string;
  audioUrl?: string;
}

export const valorantQuestions: Question[] = [
  // Easy Questions (1-15)
  {
    id: 1,
    question: "Which agent has the ability called 'Resurrection'?",
    options: ["Sage", "Phoenix", "Reyna", "Skye"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'agents'
  },
  {
    id: 2,
    question: "What is the maximum number of players in a Valorant match?",
    options: ["8", "10", "12", "16"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 3,
    question: "Which map features a teleporter on site A?",
    options: ["Haven", "Bind", "Split", "Ascent"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'maps'
  },
  {
    id: 4,
    question: "What is the default pistol for all agents?",
    options: ["Sheriff", "Classic", "Ghost", "Frenzy"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'weapons'
  },
  {
    id: 5,
    question: "Which agent can create smokes?",
    options: ["Jett", "Raze", "Omen", "Breach"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'agents'
  },
  {
    id: 6,
    question: "How many rounds does a team need to win to win the match?",
    options: ["11", "12", "13", "15"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 7,
    question: "Which weapon is known as the 'Op'?",
    options: ["Marshal", "Operator", "Guardian", "Vandal"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'weapons'
  },
  {
    id: 8,
    question: "What does 'eco' mean in Valorant?",
    options: ["Economic round", "Easy carry on", "Explosive combat only", "Enemy contact outside"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 9,
    question: "Which agent has the ultimate ability 'Showstopper'?",
    options: ["Raze", "Phoenix", "Jett", "Reyna"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'agents'
  },
  {
    id: 10,
    question: "What is the spike plant time?",
    options: ["3 seconds", "4 seconds", "5 seconds", "6 seconds"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 11,
    question: "Which map has three sites?",
    options: ["Ascent", "Haven", "Split", "Bind"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'maps'
  },
  {
    id: 12,
    question: "What currency is used to buy weapons in Valorant?",
    options: ["VP", "Credits", "Creds", "Points"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 13,
    question: "Which agent can dash through walls?",
    options: ["Jett", "Phoenix", "Yoru", "Omen"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'agents'
  },
  {
    id: 14,
    question: "What is the maximum armor value?",
    options: ["100", "125", "150", "200"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'gameplay'
  },
  {
    id: 15,
    question: "Which weapon costs 2900 credits?",
    options: ["Phantom", "Vandal", "Both Phantom and Vandal", "Operator"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'weapons'
  },

  // Medium Questions (16-35)
  {
    id: 16,
    question: "What is Cypher's trapwire ability called?",
    options: ["Cyber Cage", "Spycam", "Trapwire", "Neural Theft"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 17,
    question: "How long does the spike defuse take?",
    options: ["5 seconds", "7 seconds", "10 seconds", "7.5 seconds"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'gameplay'
  },
  {
    id: 18,
    question: "Which pro player is known as 'El Diablo'?",
    options: ["yay", "TenZ", "ScreaM", "Sick"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'esports'
  },
  {
    id: 19,
    question: "What is the fire rate of the Vandal?",
    options: ["9.25 rounds/sec", "9.75 rounds/sec", "10 rounds/sec", "8.5 rounds/sec"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'weapons'
  },
  {
    id: 20,
    question: "Which map callout refers to the long corridor on Dust2... wait, that's CS:GO. Which map has 'Mid Courtyard'?",
    options: ["Ascent", "Split", "Haven", "Icebox"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'maps'
  },
  {
    id: 21,
    question: "What is Viper's passive ability?",
    options: ["Fuel", "Decay", "Toxin Screen", "Poison Cloud"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 22,
    question: "How many ultimate orbs does Sova need for his ultimate?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 23,
    question: "What is the damage of a headshot with the Sheriff?",
    options: ["145", "159", "160", "145"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'weapons'
  },
  {
    id: 24,
    question: "Which team won the first Valorant Champions?",
    options: ["Sentinels", "Acend", "Gambit", "Vision Strikers"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'esports'
  },
  {
    id: 25,
    question: "What is the maximum movement speed in Valorant?",
    options: ["5.4 m/s", "5.73 m/s", "6.0 m/s", "5.2 m/s"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'gameplay'
  },
  {
    id: 26,
    question: "Which agent has the most utility abilities?",
    options: ["Sova", "Breach", "Skye", "Viper"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 27,
    question: "What is the range falloff start for the Phantom?",
    options: ["15m", "20m", "25m", "30m"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'weapons'
  },
  {
    id: 28,
    question: "Which map was the first to be reworked?",
    options: ["Split", "Bind", "Haven", "Ascent"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'maps'
  },
  {
    id: 29,
    question: "What does ADS stand for in Valorant?",
    options: ["Aim Down Sights", "Advanced Defense System", "Auto Damage Scale", "Area Denial Smoke"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'gameplay'
  },
  {
    id: 30,
    question: "Which region has won the most international tournaments?",
    options: ["NA", "EMEA", "APAC", "Brazil"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'esports'
  },
  {
    id: 31,
    question: "What is Killjoy's ultimate called?",
    options: ["Nanoswarm", "Turret", "Lockdown", "Alarmbot"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 32,
    question: "How much does the Operator cost?",
    options: ["4500", "4700", "5000", "4900"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'weapons'
  },
  {
    id: 33,
    question: "What is the defuse time with half defuse?",
    options: ["3.5 seconds", "4 seconds", "4.5 seconds", "5 seconds"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'gameplay'
  },
  {
    id: 34,
    question: "Which agent was released with Episode 2?",
    options: ["Yoru", "Astra", "Kay/O", "Chamber"],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'agents'
  },
  {
    id: 35,
    question: "What is the maximum credits you can have?",
    options: ["8000", "9000", "10000", "12000"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'gameplay'
  },

  // Hard Questions (36-50)
  {
    id: 36,
    question: "What is the exact damage falloff multiplier for the Phantom at 30+ meters?",
    options: ["0.8x", "0.85x", "0.9x", "0.75x"],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'weapons'
  },
  {
    id: 37,
    question: "Which pro player has the highest ACS in a single map in VCT history?",
    options: ["TenZ", "Demon1", "Aspas", "Derke"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'esports'
  },
  {
    id: 38,
    question: "What is the exact radius of Viper's Pit in meters?",
    options: ["14m", "15m", "16m", "18m"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'agents'
  },
  {
    id: 39,
    question: "How many different gun sounds are there in Valorant?",
    options: ["42", "45", "48", "51"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'gameplay'
  },
  {
    id: 40,
    question: "What is the exact movement accuracy penalty for the Vandal while walking?",
    options: ["0.25", "0.35", "0.45", "0.55"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'weapons'
  },
  {
    id: 41,
    question: "Which team had the longest win streak in VCT history?",
    options: ["Sentinels", "FPX", "OpTic", "LOUD"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'esports'
  },
  {
    id: 42,
    question: "What is the frame data for Jett's dash ability?",
    options: ["12 frames", "15 frames", "18 frames", "20 frames"],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'agents'
  },
  {
    id: 43,
    question: "How many unique peek angles are possible on Ascent A site?",
    options: ["127", "134", "142", "156"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'maps'
  },
  {
    id: 44,
    question: "What is the exact wall penetration damage for Medium materials with the Vandal?",
    options: ["25.5", "29.75", "31.2", "28.6"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'weapons'
  },
  {
    id: 45,
    question: "Which agent has the fastest ability deploy time?",
    options: ["Reyna", "Jett", "Phoenix", "Yoru"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'agents'
  },
  {
    id: 46,
    question: "What is the server tick rate for Valorant competitive matches?",
    options: ["64", "128", "256", "120"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'gameplay'
  },
  {
    id: 47,
    question: "How many milliseconds of peeker's advantage exist in Valorant?",
    options: ["20-40ms", "40-60ms", "60-80ms", "80-100ms"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'gameplay'
  },
  {
    id: 48,
    question: "What is the exact damage per tick of Viper's decay?",
    options: ["4.5", "5.0", "5.5", "6.0"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'agents'
  },
  {
    id: 49,
    question: "Which pro player has played the most agents in professional matches?",
    options: ["Sick", "Chronicle", "Derke", "nAts"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'esports'
  },
  {
    id: 50,
    question: "What is the theoretical maximum KDA possible in a 13-0 victory?",
    options: ["65.0", "78.0", "91.0", "Infinite"],
    correctAnswer: 3,
    difficulty: 'hard',
    category: 'gameplay'
  {
  id: 51,
  question: "Which agent is shown in this image?",
  imageUrl: "https://example.com/agent-image.jpg",
  options: ["Jett", "Reyna", "Phoenix", "Sage"],
  correctAnswer: 0,
  difficulty: 'easy',
  category: 'agents'
}
];