// src/data/rootwoodEpisode1.ts
// Rootwood Academy — Episode 1: "The Door That Wasn't There"
// Full episode: Chapter 1 (The Door) + Chapter 2 (The Underbranch)
// ~12–15 minutes | 25 scenes | 7 challenges
// Math: 1.OA.A.1 (add within 20), 1.OA.D.8 (missing number), 1.NBT.B.2
// Reading: RF.1.3b, RF.1.3a, RL.1.1, RL.1.3

import type { RootwoodScene } from '../types/game'

const img = (name: string) => `/scenes/rootwood/${name}.svg`

export const rootwoodEpisode1: RootwoodScene[] = [

  // ─────────────────────────────────────────────────────────────────
  //  CHAPTER 1 — THE DOOR
  // ─────────────────────────────────────────────────────────────────

  // PAGE 1 — Arrival (no challenge)
  {
    id: 'rw1-arrival',
    text: [
      'Welcome to Rootwood Academy.',
      'It lives inside the biggest tree in the world.',
    ],
    image: { src: img('rootwood-gate'), alt: 'The grand glowing entrance of Rootwood Academy carved into an enormous ancient tree' },
    nextSceneId: 'rw1-cobb-intro',
  },

  // PAGE 2 — Cobb intro (no challenge)
  {
    id: 'rw1-cobb-intro',
    text: [
      'A small owl sits on a branch above the door.',
      '"Cobb," he says. "That is my name. Pay attention. Things happen fast here."',
    ],
    image: { src: img('cobb-perch'), alt: 'A small ancient owl perched on a moonlit branch, staring directly at the reader with huge amber eyes' },
    nextSceneId: 'rw1-the-hall',
  },

  // PAGE 3 — Walking the hall
  {
    id: 'rw1-the-hall',
    text: [
      'The hallway glows. The roots in the walls pulse soft gold.',
      'You can feel the tree breathing around you.',
    ],
    image: { src: img('mystery-door'), alt: 'A living tree corridor with glowing amber roots in the walls' },
    nextSceneId: 'rw1-door-appears',
  },

  // PAGE 4 — Door appears (mystery introduced)
  {
    id: 'rw1-door-appears',
    text: [
      'Then you stop.',
      'There is a door. It was not here this morning.',
    ],
    image: { src: img('mystery-door'), alt: 'A dark wooden door with glowing purple cracks set into the living wood of the tree hallway' },
    nextSceneId: 'rw1-cobb-notices',
  },

  // PAGE 5 — Reading challenge #1
  {
    id: 'rw1-cobb-notices',
    text: [
      'Cobb lands on your shoulder. He is heavier than he looks.',
      '"Interesting," he says. "Doors do not just appear. Except when they do."',
    ],
    image: { src: img('door-glow'), alt: 'The mysterious door pulsing with purple light, Cobb perched on a shoulder nearby' },
    event: {
      type: 'challenge',
      skillType: 'reading',
      promptByLevel: {
        R1: 'What is strange about the door?',
        R3: 'Why does Cobb say the door is interesting?',
        R6: 'What does Cobb mean when he says doors do not just appear — except when they do?',
      },
      hintByLevel: {
        R1: 'Was the door there this morning? Think back!',
        R3: 'Has Cobb seen this door before? What did you read?',
        R6: 'Cobb is saying something impossible just happened. What is it?',
      },
      options: [
        { id: 'opt-a', text: 'It appeared out of nowhere', isCorrect: true  },
        { id: 'opt-b', text: 'It is a very old door',      isCorrect: false },
        { id: 'opt-c', text: 'It is the wrong color',      isCorrect: false },
      ],
      successSceneId: 'rw1-knot-puzzle',
      failureSceneId: 'rw1-cobb-notices',
      reward: {
        id: 'rw1-owl-feather',
        label: 'Owl Feather',
        description: 'Cobb dropped this. He says he did it on purpose. He did not.',
      },
    },
  },

  // PAGE 6 — Math challenge #1 (7 + 6 = 13)
  {
    id: 'rw1-knot-puzzle',
    text: [
      'The door has a knotted vine across it.',
      'Seven knots on the left. Six knots on the right.',
      'The door counts every knot before it opens.',
    ],
    image: { src: img('knot-puzzle'), alt: 'A thick vine twisted across the door with numbered knot bumps on each side' },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'Count all the knots together. How many are there?',
        M2: 'How many knots are there in all?',
        M4: 'What is 7 + 6?',
        M5: '7 + 6 = ?',
      },
      hintByLevel: {
        M1: 'Count the left knots first, then count on the right ones.',
        M2: 'Start at 7. Count on 6 more.',
        M4: 'Make a ten: 7 + 3 = 10. Then add 3 more.',
        M5: 'Count both sides. Left has 7, right has 6.',
      },
      options: [
        { id: 'knot-a', text: '11', isCorrect: false },
        { id: 'knot-b', text: '12', isCorrect: false },
        { id: 'knot-c', text: '13', isCorrect: true  },
      ],
      successSceneId: 'rw1-vines-fall',
      failureSceneId: 'rw1-knot-puzzle',
      reward: {
        id: 'rw1-vine-knot',
        label: 'Vine Knot',
        description: 'A tiny knot from the door vine. It untied itself to say thank you.',
      },
    },
  },

  // PAGE 7 — Vines fall (no challenge)
  {
    id: 'rw1-vines-fall',
    text: [
      'The knots drop to the floor one by one.',
      'The door hums. A low, pleased sound.',
    ],
    image: { src: img('door-glow'), alt: 'The door glowing brighter now with the vine knots gone' },
    nextSceneId: 'rw1-the-choice',
  },

  // PAGE 8 — Choice moment
  {
    id: 'rw1-the-choice',
    text: [
      '"Your move," says Cobb. "Knock, or listen first."',
      '"I am not going to tell you which."',
    ],
    image: { src: img('door-glow'), alt: 'The glowing door waiting, Cobb watching with unreadable eyes' },
    event: {
      type: 'choice',
      prompt: 'What will you do?',
      options: [
        { id: 'choice-brave',  text: 'Knock on the door',      nextSceneId: 'rw1-brave-path',  flagKey: 'choseBrave'  },
        { id: 'choice-clever', text: 'Listen at the door first', nextSceneId: 'rw1-clever-path', flagKey: 'choseClever' },
      ],
    },
  },

  // PAGE 9A — Brave path
  {
    id: 'rw1-brave-path',
    text: [
      'You knock. Three loud thumps. The hall goes quiet.',
      'Then — something knocks back. Once.',
    ],
    image: { src: img('brave-hall'), alt: 'A fist raised knocking on the glowing door with neon sound waves rippling outward' },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 9B — Clever path
  {
    id: 'rw1-clever-path',
    text: [
      'You press your ear to the wood. Something is moving inside.',
      '"Footsteps," whispers Cobb. "Small ones. Interesting."',
    ],
    image: { src: img('clever-hall'), alt: 'An ear pressed against the glowing door with faint shadow footprints visible inside' },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 10 — Math challenge #2 (10 − ? = 3, answer 7)
  {
    id: 'rw1-door-lock',
    text: [
      'Numbers glow on the door. They make an equation.',
      '"Fill in the blank," says Cobb. "And the door opens."',
    ],
    image: { src: img('door-glow'), alt: 'The door showing a glowing equation with a blank space pulsing with light: 10 minus ? equals 3' },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'The door shows: 10 take away something equals 3. Which number fills the blank?',
        M2: '10 take away what number leaves 3?',
        M3: '10 − ? = 3. What is the missing number?',
        M4: 'Solve: 10 − ? = 3',
      },
      hintByLevel: {
        M1: 'Start at 10. Count back until you reach 3. How many steps?',
        M2: 'Count back from 10 to 3.',
        M3: 'Think: what plus 3 equals 10?',
        M4: 'Rearrange: 10 − 3 = ?',
      },
      options: [
        { id: 'lock-a', text: '5', isCorrect: false },
        { id: 'lock-b', text: '6', isCorrect: false },
        { id: 'lock-c', text: '7', isCorrect: true  },
      ],
      successSceneId: 'rw1-door-opens',
      failureSceneId: 'rw1-door-lock',
      reward: {
        id: 'rw1-glowstone',
        label: 'Glowstone',
        description: 'A stone pried from the door. It is warm. It fits perfectly in your pocket.',
      },
    },
  },

  // PAGE 11 — Door swings open + reward
  {
    id: 'rw1-door-opens',
    text: [
      'The door swings wide open.',
      'Inside is a small room full of floating golden lights.',
      'In the middle — a tiny creature, no bigger than your hand — fast asleep.',
    ],
    image: { src: img('door-open'), alt: 'The door wide open revealing a cozy glowing room with floating golden orbs and a tiny sleeping creature' },
    event: {
      type: 'reward',
      prompt: 'You solved the mystery of the door. A Rootwood Star is yours!',
      reward: {
        id: 'rw1-rootwood-star',
        label: 'Rootwood Star',
        description: 'Awarded for opening the door. It glows faintly, like it is proud of you.',
      },
      nextSceneId: 'rw1-cliffhanger',
    },
  },

  // PAGE 12 — Cliffhanger + bridge to Chapter 2
  {
    id: 'rw1-cliffhanger',
    text: [
      'The creature opens one eye.',
      'It looks right at you.',
      '"You took long enough," it says.',
    ],
    image: { src: img('creature-wakes'), alt: 'The tiny creature sitting up with one blazing green eye open, looking directly at the reader' },
    nextSceneId: 'rw1-pip-meet',
    savePoint: { chapterName: 'Chapter 1: The Door', chapterNumber: 1 },
  },

  // ─────────────────────────────────────────────────────────────────
  //  CHAPTER 2 — THE UNDERBRANCH
  // ─────────────────────────────────────────────────────────────────

  // PAGE 13 — Meet Pip
  {
    id: 'rw1-pip-meet',
    text: [
      'The creature sits up. It has green eyes like tiny glowstones.',
      '"My name is Pip," it says. "I am a Seedling Sprite. And we have a problem."',
    ],
    image: { src: img('pip-room'), alt: 'Pip the tiny glowing green Seedling Sprite standing in the magical floating-light room with arms spread wide' },
    nextSceneId: 'rw1-pip-warning',
  },

  // PAGE 14 — Pip's warning
  {
    id: 'rw1-pip-warning',
    text: [
      'Pip points straight down through the floor.',
      '"Something woke up," she says. "Down below. In the oldest roots. Where nobody goes."',
    ],
    image: { src: img('pip-room'), alt: 'Pip pointing urgently downward, her green eyes wide with worry' },
    nextSceneId: 'rw1-pip-challenge',
  },

  // PAGE 15 — Reading challenge #2 (comprehension)
  {
    id: 'rw1-pip-challenge',
    text: [
      'Cobb lands on the doorframe. His feathers go up.',
      '"Where exactly," he says slowly, "did you say this something woke up?"',
    ],
    image: { src: img('cobb-perch'), alt: 'Cobb perched with feathers raised, listening carefully to Pip' },
    event: {
      type: 'challenge',
      skillType: 'reading',
      promptByLevel: {
        R1: 'Where did Pip say something woke up?',
        R3: 'What is the problem Pip is telling you about?',
        R6: 'Why does Pip say this is serious? Use clues from what she said.',
      },
      hintByLevel: {
        R1: 'She pointed DOWN. Where is that?',
        R3: 'Pip said "nobody goes" there. Why would that make it scary?',
        R6: 'Think about where Pip pointed and what words she used.',
      },
      options: [
        { id: 'pip-a', text: 'In the oldest roots below', isCorrect: true  },
        { id: 'pip-b', text: 'In the library upstairs',   isCorrect: false },
        { id: 'pip-c', text: 'Outside in the forest',     isCorrect: false },
      ],
      successSceneId: 'rw1-roots-flicker',
      failureSceneId: 'rw1-pip-challenge',
      reward: {
        id: 'rw1-seedling-badge',
        label: 'Seedling Badge',
        description: 'Pip gave you this. It smells like forest after rain.',
      },
    },
  },

  // PAGE 16 — Roots go dark
  {
    id: 'rw1-roots-flicker',
    text: [
      'The roots in the hallway go dim.',
      'All of them. At once.',
      'Then they come back on — but much dimmer than before.',
    ],
    image: { src: img('underbranch'), alt: 'A dark underground tree corridor with mostly dead roots and just one faint amber glow remaining' },
    nextSceneId: 'rw1-cobb-warns',
  },

  // PAGE 17 — Cobb has seen this before
  {
    id: 'rw1-cobb-warns',
    text: [
      '"I have seen this before," says Cobb quietly.',
      '"Once. I was very young."',
      '"It was not a good day."',
    ],
    image: { src: img('cobb-perch'), alt: 'Cobb with his feathers all the way up, eyes wide, looking down into the dark corridor' },
    nextSceneId: 'rw1-ch2-choice',
  },

  // PAGE 18 — Choice: ask Cobb or follow Pip
  {
    id: 'rw1-ch2-choice',
    text: [
      'Pip is already at the end of the hall, waving at you.',
      '"Well?" says Cobb. "We are going down either way. The question is how fast."',
    ],
    image: { src: img('underbranch'), alt: 'The dark underground corridor stretching ahead, Pip a tiny green glow in the distance' },
    event: {
      type: 'choice',
      prompt: 'What do you do first?',
      options: [
        { id: 'ch2-ask',    text: 'Ask Cobb what he saw that day',  nextSceneId: 'rw1-cobb-tells',   flagKey: 'askedCobb'   },
        { id: 'ch2-follow', text: 'Follow Pip — no time to wait',   nextSceneId: 'rw1-pip-leads',    flagKey: 'followedPip' },
      ],
    },
  },

  // PAGE 19A — Cobb tells what he remembers
  {
    id: 'rw1-cobb-tells',
    text: [
      '"Something old lives in this tree," says Cobb. "Before the school. Before everything."',
      '"Most days it sleeps. I do not know what woke it."',
      '"I do not want to know. And yet." He sighs. "We are going to find out."',
    ],
    image: { src: img('cobb-perch'), alt: 'Cobb with a resigned but determined expression, feathers settling back down' },
    nextSceneId: 'rw1-liftvine',
  },

  // PAGE 19B — Follow Pip
  {
    id: 'rw1-pip-leads',
    text: [
      'Pip runs very fast for someone so small.',
      '"This way!" she calls. "Follow the dark roots! They lead down!"',
    ],
    image: { src: img('underbranch'), alt: 'A tiny green glowing figure sprinting through the dark root corridor' },
    nextSceneId: 'rw1-liftvine',
  },

  // PAGE 20 — Liftvine + Math challenge #3 (4 + 5 = 9)
  {
    id: 'rw1-liftvine',
    text: [
      'The Liftvine hangs at the corridor end. Normally it sings a little tune.',
      'Tonight it makes a low, nervous sound.',
      '"Four creatures are waiting at the bottom," says Pip. "Five more are still in the Cellar. We need to find them all."',
    ],
    image: { src: img('liftvine'), alt: 'The massive magical vine elevator humming nervously in a deep vertical shaft' },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'Pip has 4 friends waiting below. 5 more live in the Cellar. Count them all — how many creatures?',
        M2: '4 creatures are waiting and 5 more are in the Cellar. How many in all?',
        M4: 'What is 4 + 5?',
        M5: '4 + 5 = ?',
      },
      hintByLevel: {
        M1: 'Put 4 and 5 together. Count them all on your fingers.',
        M2: 'Start at 4. Count on 5 more.',
        M4: 'Think of it as 4 + 4 + 1.',
        M5: 'Count up: 4… 5, 6, 7, 8, 9.',
      },
      options: [
        { id: 'vine-a', text: '8',  isCorrect: false },
        { id: 'vine-b', text: '9',  isCorrect: true  },
        { id: 'vine-c', text: '10', isCorrect: false },
      ],
      successSceneId: 'rw1-cellar-entry',
      failureSceneId: 'rw1-liftvine',
      reward: {
        id: 'rw1-liftvine-ring',
        label: 'Liftvine Ring',
        description: 'A glowing runemark from the vine. It still hums faintly.',
      },
    },
  },

  // PAGE 21 — Cellar entry
  {
    id: 'rw1-cellar-entry',
    text: [
      'The Creature Cellar smells like warm hay and sleeping animals.',
      'But nothing is sleeping. Eight creatures are crammed into one corner.',
      'Their eyes are wide. Their ears are flat.',
    ],
    image: { src: img('cellar-entry'), alt: 'The creature cellar with eight pairs of glowing eyes all pressed into the corners, terrified' },
    nextSceneId: 'rw1-cellar-reading',
  },

  // PAGE 22 — Reading challenge #3 (comprehension: scared)
  {
    id: 'rw1-cellar-reading',
    text: [
      '"Something scared them," Pip whispers.',
      '"Look at what they are doing. That will tell you how scared they are."',
    ],
    image: { src: img('cellar-entry'), alt: 'Close up of the glowing frightened eyes of the creatures huddled in the cellar corner' },
    event: {
      type: 'challenge',
      skillType: 'reading',
      promptByLevel: {
        R1: 'What are the creatures doing that shows they are scared?',
        R3: 'How can you tell the creatures are frightened?',
        R6: 'What two things does the narrator tell us that show the creatures are very scared?',
      },
      hintByLevel: {
        R1: 'Are they running around, or hiding in one place?',
        R3: 'Look at their eyes and their ears. What do those tell you?',
        R6: 'The narrator gives you three clues. Find two of them.',
      },
      options: [
        { id: 'cel-a', text: 'Hiding in a corner with wide eyes',  isCorrect: true  },
        { id: 'cel-b', text: 'Running and jumping around',         isCorrect: false },
        { id: 'cel-c', text: 'Eating their dinner calmly',         isCorrect: false },
      ],
      successSceneId: 'rw1-shadow-appears',
      failureSceneId: 'rw1-cellar-reading',
      reward: {
        id: 'rw1-creature-token',
        label: 'Creature Token',
        description: 'One of the animals pressed this into your hand. It is shaped like a paw.',
      },
    },
  },

  // PAGE 23 — The shadow
  {
    id: 'rw1-shadow-appears',
    text: [
      'Then a shadow crosses the far wall.',
      'You look behind you.',
      'Nothing is there.',
    ],
    image: { src: img('shadow-wall'), alt: 'A humanoid shadow on the stone wall with no person casting it, deeply eerie' },
    nextSceneId: 'rw1-shadow-math',
  },

  // PAGE 24 — Math challenge #4 (9 − 4 = 5, missing marks)
  {
    id: 'rw1-shadow-math',
    text: [
      '"That shadow," says Cobb, "has no one to cast it."',
      'You see numbers carved into the old stone. Nine marks in a row. Four of them glow.',
      '"How many marks are dark?" asks Pip.',
    ],
    image: { src: img('shadow-wall'), alt: 'The stone wall with carved marks, four glowing amber and the rest dark' },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: '9 marks total. 4 are lit up. Count the dark ones. How many are dark?',
        M2: '9 minus 4 equals how many?',
        M3: '9 − 4 = ?',
        M4: 'Solve: 9 − 4',
      },
      hintByLevel: {
        M1: 'Start at 9. Count back 4. What do you land on?',
        M2: 'Think: 4 + ? = 9.',
        M3: 'Count back from 9: 8, 7, 6, 5…',
        M4: 'Or: 9 − 4 = 9 − 4.',
      },
      options: [
        { id: 'shad-a', text: '4', isCorrect: false },
        { id: 'shad-b', text: '5', isCorrect: true  },
        { id: 'shad-c', text: '6', isCorrect: false },
      ],
      successSceneId: 'rw1-cobb-knows',
      failureSceneId: 'rw1-shadow-math',
      reward: {
        id: 'rw1-carved-mark',
        label: 'Carved Mark',
        description: 'A rubbing of the stone carving. Cobb says not to lose it.',
      },
    },
  },

  // PAGE 25 — Cobb recognizes the symbol
  {
    id: 'rw1-cobb-knows',
    text: [
      'Cobb flies to a mark carved deep in the stone wall.',
      'He tilts his head left. Then right.',
      '"I know what this is," he says. "It is a door mark. Something is trying to open a door. From the other side."',
    ],
    image: { src: img('heartwood-symbol'), alt: 'The ancient carved symbol on the stone wall, glowing purple and pink, Cobb perched beside it' },
    nextSceneId: 'rw1-pip-glows',
  },

  // PAGE 26 — Pip glows + reward
  {
    id: 'rw1-pip-glows',
    text: [
      'Pip begins to glow. Very bright. Brighter than all the floating lights upstairs.',
      '"I can feel it," she whispers.',
      '"It has been here a very long time. It is not angry. It is just — lonely."',
    ],
    image: { src: img('heartwood-symbol'), alt: 'Pip glowing intensely gold-green beside the ancient symbol, Cobb watching in awe' },
    event: {
      type: 'reward',
      prompt: 'You found the secret of the Underbranch. The Rootwood Crest is yours.',
      reward: {
        id: 'rw1-rootwood-crest',
        label: 'Rootwood Crest',
        description: 'A carved stone symbol, warm to the touch. Cobb says it is very old.',
      },
      nextSceneId: 'rw1-final-cliffhanger',
    },
  },

  // PAGE 27 — EPIC CLIFFHANGER
  {
    id: 'rw1-final-cliffhanger',
    text: [
      'Then you hear it.',
      'A sound. From far below. Deep in the oldest root of the oldest tree in the world.',
      'A door. Already open.',
    ],
    image: { src: img('final-door'), alt: 'A massive ancient door deep underground at the base of the oldest root, cracked open with green light pouring through' },
    // No nextSceneId — end of episode
  },
]

export const rootwoodEpisode1Meta = {
  id: 'rootwood-ep1',
  title: "The Door That Wasn't There",
  narrator: 'Cobb',
  estimatedMinutes: 14,
  mathStandards: ['1.OA.A.1', '1.OA.D.8'],
  readingStandards: ['RF.1.3b', 'RF.1.3a', 'RL.1.1', 'RL.1.3'],
  initialSceneId: 'rw1-arrival',
}
