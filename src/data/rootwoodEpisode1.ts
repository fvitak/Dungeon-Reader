// src/data/rootwoodEpisode1.ts
// Rootwood Academy — Episode 1: "The Door That Wasn't There"
// Narrator: Cobb
// Math standards: 1.OA.A.1 (add within 20), 1.OA.D.8 (missing number)
// Reading standards: RF.1.3b, RF.1.3a — story comprehension, multiple choice only

import type { RootwoodScene } from '../types/game'

// Using .svg extension for placeholders — swap to .png when production images arrive
const img = (name: string) => `/scenes/rootwood/${name}.svg`

export const rootwoodEpisode1: RootwoodScene[] = [

  // PAGE 1 — hook, no challenge
  {
    id: 'rw1-arrival',
    text: [
      'Welcome to Rootwood Academy.',
      'It lives inside the biggest tree in the world.',
    ],
    image: {
      src: img('rootwood-gate'),
      alt: 'The grand entrance of Rootwood Academy carved into an enormous glowing tree',
    },
    nextSceneId: 'rw1-cobb-intro',
  },

  // PAGE 2 — Cobb intro, no challenge
  {
    id: 'rw1-cobb-intro',
    text: [
      'A small owl sits on a branch above the door.',
      '"Cobb," he says. "That is my name. Pay attention. Things happen fast here."',
    ],
    image: {
      src: img('cobb-perch'),
      alt: 'A small ancient owl perched on a branch looking directly at the reader',
    },
    nextSceneId: 'rw1-door-appears',
  },

  // PAGE 3 — mystery introduced, no challenge
  {
    id: 'rw1-door-appears',
    text: [
      'You walk down the hall. The roots glow under your feet.',
      'Then you stop. There is a door. It was not here yesterday.',
    ],
    image: {
      src: img('mystery-door'),
      alt: 'A dark wooden door with glowing cracks set into the living wood of the tree hallway',
    },
    nextSceneId: 'rw1-cobb-notices',
  },

  // PAGE 4 — first easy challenge (reading comprehension, multiple choice)
  {
    id: 'rw1-cobb-notices',
    text: [
      'Cobb lands on your shoulder. He is heavier than he looks.',
      '"Interesting," he says. "Doors do not just appear. Except when they do."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The mysterious door pulsing with soft gold light, Cobb perched on a shoulder',
    },
    event: {
      type: 'challenge',
      skillType: 'reading',
      promptByLevel: {
        R1: 'What is strange about the door?',
        R3: 'Why is the door surprising?',
        R6: 'What does Cobb mean when he says doors do not just appear?',
      },
      hintByLevel: {
        R1: 'Think back — was this door here when you first walked in?',
        R3: 'Cobb has lived here for hundreds of years. Has he seen this door before?',
        R6: 'Cobb says something impossible just happened. What is it?',
      },
      options: [
        { id: 'opt-a', text: 'It appeared out of nowhere', isCorrect: true  },
        { id: 'opt-b', text: 'It is very old',             isCorrect: false },
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

  // PAGE 5 — big math challenge (addition, multiple choice)
  // Math standard: 1.OA.A.1 — add within 20
  {
    id: 'rw1-knot-puzzle',
    text: [
      'The door has a knotted vine across it.',
      'Seven knots on the left. Six on the right.',
      'The door counts every knot before it opens.',
    ],
    image: {
      src: img('knot-puzzle'),
      alt: 'A thick vine twisted across the door with visible knotted bumps on each side',
    },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'Count all the knots. How many does the door need?',
        M2: 'How many knots does the door need to count?',
        M4: 'What is 7 + 6?',
        M5: '7 + 6 = ?',
      },
      hintByLevel: {
        M1: 'Count the left knots, then the right ones, then put them together.',
        M2: 'Start at 7 and count on 6 more.',
        M4: 'Try making a ten first: 7 + 3 = 10, then add 3 more.',
        M5: 'Add left and right, then check your work.',
      },
      options: [
        { id: 'knot-a', text: '11', isCorrect: false },
        { id: 'knot-b', text: '12', isCorrect: false },
        { id: 'knot-c', text: '13', isCorrect: true  },
      ],
      successSceneId: 'rw1-the-choice',
      failureSceneId: 'rw1-knot-puzzle',
      reward: {
        id: 'rw1-vine-knot',
        label: 'Vine Knot',
        description: 'A tiny knot from the door vine. It untied itself to say thank you.',
      },
    },
  },

  // PAGE 6 — choice moment (both paths valid, both earn XP)
  {
    id: 'rw1-the-choice',
    text: [
      'The knots fall away. The door hums.',
      '"Your move," says Cobb. "Knock, or listen first. I am not going to tell you which."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The door glowing brighter now with the vine knots gone',
    },
    event: {
      type: 'choice',
      prompt: 'What will you do?',
      options: [
        {
          id: 'choice-brave',
          text: 'Knock on the door',
          nextSceneId: 'rw1-brave-path',
          flagKey: 'choseBrave',
        },
        {
          id: 'choice-clever',
          text: 'Listen at the door first',
          nextSceneId: 'rw1-clever-path',
          flagKey: 'choseClever',
        },
      ],
    },
  },

  // PAGE 7A — brave path (routes to rw1-door-lock)
  {
    id: 'rw1-brave-path',
    text: [
      'You knock. Three loud thumps. The hall goes quiet.',
      'Then — something knocks back. Once.',
    ],
    image: {
      src: img('brave-hall'),
      alt: 'A fist raised knocking on the glowing door with sound waves rippling outward',
    },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 7B — clever path (routes to rw1-door-lock)
  {
    id: 'rw1-clever-path',
    text: [
      'You press your ear to the wood. Something is moving in there.',
      '"Footsteps," whispers Cobb. "Small ones. Interesting."',
    ],
    image: {
      src: img('clever-hall'),
      alt: 'An ear pressed against the glowing door with faint footprint shadows visible inside',
    },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 8 — big challenge (missing number, multiple choice)
  // Math standard: 1.OA.D.8 — find the unknown in an equation
  {
    id: 'rw1-door-lock',
    text: [
      'Numbers glow on the door: 10 − ? = 3.',
      '"Fill in the blank," says Cobb. "And the door opens."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The door showing a glowing equation with a blank space pulsing with light',
    },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'The door shows 10 take away something equals 3. Which number fills the blank?',
        M2: '10 take away what number leaves 3?',
        M3: '10 − ? = 3. What is the missing number?',
        M4: 'Solve: 10 − ? = 3',
      },
      hintByLevel: {
        M1: 'Start at 10. Count back until you reach 3. How many steps was that?',
        M2: 'Count back from 10 until you get to 3.',
        M3: 'Think: what number plus 3 equals 10?',
        M4: 'Rearrange it: 10 − 3 = ?',
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

  // PAGE 9 — resolution + reward
  {
    id: 'rw1-door-opens',
    text: [
      'The door swings open. Inside is a small room full of floating lights.',
      'In the middle sits a tiny creature, no bigger than your hand, fast asleep.',
    ],
    image: {
      src: img('door-open'),
      alt: 'The door wide open revealing a cozy glowing room with a tiny sleeping creature inside',
    },
    event: {
      type: 'reward',
      prompt: 'You solved the mystery of the door. A Rootwood Star is yours!',
      reward: {
        id: 'rw1-rootwood-star',
        label: 'Rootwood Star',
        description: 'Awarded for finishing Episode 1. It glows faintly, like it is proud of you.',
      },
      nextSceneId: 'rw1-cliffhanger',
    },
  },

  // PAGE 10 — cliffhanger, episode end
  {
    id: 'rw1-cliffhanger',
    text: [
      'The creature opens one eye. It looks right at you.',
      '"You took long enough," it says.',
    ],
    image: {
      src: img('creature-wakes'),
      alt: 'The tiny creature sitting up with one eye open looking directly at the reader',
    },
    // No nextSceneId — end of episode
  },

]

export const rootwoodEpisode1Meta = {
  id: 'rootwood-ep1',
  title: "The Door That Wasn't There",
  narrator: 'Cobb',
  estimatedMinutes: 12,
  mathStandards: ['1.OA.A.1', '1.OA.D.8'],
  readingStandards: ['RF.1.3b', 'RF.1.3a', 'RL.1.1'],
  initialSceneId: 'rw1-arrival',
}
