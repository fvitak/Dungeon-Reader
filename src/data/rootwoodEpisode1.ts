// src/data/rootwoodEpisode1.ts
// Rootwood Academy — Episode 1: "The Door That Wasn't There"
// Narrator: Cobb
// Math standards: 1.OA.A.1 (add within 20), 1.OA.D.8 (missing number within 10)
// Reading standards: RF.1.3b (CVC), RF.1.3a (digraphs), RF.1.3c (blends)

import type { RootwoodScene } from '../types/game'

const img = (name: string) => `/scenes/rootwood/${name}.svg`

export const rootwoodEpisode1: RootwoodScene[] = [
  {
    id: 'rw1-arrival',
    text: [
      'Welcome to Rootwood Academy.',
      'It lives inside the biggest tree in the world.',
    ],
    image: { src: img('rootwood-gate'), alt: 'The great entrance of Rootwood Academy carved into an enormous glowing tree trunk' },
    nextSceneId: 'rw1-cobb-intro',
  },
  {
    id: 'rw1-cobb-intro',
    text: [
      'A small owl sits on a branch above the door.',
      '"Cobb," he says. "That is my name. Pay attention. Things happen fast here."',
    ],
    image: { src: img('cobb-perch'), alt: 'A small brown owl perched on a branch, one eye open, looking directly at the reader' },
    nextSceneId: 'rw1-door-appears',
  },
  {
    id: 'rw1-door-appears',
    text: [
      'You walk down the hall. The roots glow under your feet.',
      'Then you stop. There is a door. It was not here yesterday.',
    ],
    image: { src: img('mystery-door'), alt: 'A dark wooden door with glowing cracks around its edges set into the living wood of the tree hallway' },
    nextSceneId: 'rw1-cobb-notices',
  },
  {
    id: 'rw1-cobb-notices',
    text: [
      'Cobb lands on your shoulder. He is heavier than he looks.',
      '"Interesting," he says. "Doors do not just appear. Except when they do."',
    ],
    image: { src: img('door-glow'), alt: 'The mysterious door pulsing with soft gold light, Cobb perched on a shoulder in the foreground' },
    event: {
      type: 'riddle',
      promptByLevel: {
        R1: 'Cobb says the door was NOT here. What is odd about it?',
        R3: 'Cobb says doors do not just appear. What does he mean?',
        R6: 'Cobb says something unexpected. What does his reaction tell you?',
      },
      correctAnswerByLevel: {
        R1: 'it appeared out of nowhere',
        R3: 'magic made it appear',
        R6: 'strange things happen at rootwood',
      },
      hintByLevel: {
        R1: 'Think about what Cobb said — the door was not here before.',
        R3: 'What kind of school makes doors appear from nowhere?',
        R6: 'What does it say about a school when its owl is not surprised?',
      },
      successSceneId: 'rw1-knot-puzzle',
      failureSceneId: 'rw1-cobb-notices',
      reward: {
        id: 'rw1-owl-feather',
        label: 'Owl Feather',
        description: 'Cobb dropped this. He says he did it on purpose. He did not.',
      },
    },
  },
  {
    id: 'rw1-knot-puzzle',
    text: [
      'The door has a knotted vine across it.',
      'Cobb squints. "Seven knots on the left. Six on the right. How many in all?"',
    ],
    image: { src: img('knot-puzzle'), alt: 'A thick vine twisted across the door with visible knotted bumps on each side' },
    event: {
      type: 'combat',
      enemyName: 'Knotted Door',
      promptByLevel: {
        M1: 'There are 3 knots on the left and 2 on the right. How many in all?',
        M2: 'There are 7 knots on the left and 6 on the right. How many in all?',
        M4: 'There are 7 knots on the left and 6 on the right. What is 7 + 6?',
        M5: 'There are 7 knots, then 6 more, then 2 fell off. How many knots are there now?',
      },
      correctAnswerByLevel: {
        M1: '5',
        M2: '13',
        M4: '13',
        M5: '11',
      },
      hintByLevel: {
        M1: 'Count 3, then count on 2 more.',
        M2: 'Start at 7 and count on 6 more.',
        M4: 'Try making a ten first: 7 + 3 = 10, then add 3 more.',
        M5: 'Add 7 + 6 first, then take away 2.',
      },
      // NOTE: options 11/12/13 are correct for M2+. M1 correct answer is '5'
      // which is not listed as an option — M1 players will fall through to text input.
      options: [
        { id: 'knot-a', text: '11', value: '11', isCorrect: false },
        { id: 'knot-b', text: '12', value: '12', isCorrect: false },
        { id: 'knot-c', text: '13', value: '13', isCorrect: true },
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
  {
    id: 'rw1-the-choice',
    text: [
      'The knots fall away. The door hums.',
      '"Your move," says Cobb. "Knock, or listen first. I am not going to tell you which."',
    ],
    image: { src: img('door-glow'), alt: 'The door glowing brighter now with the vine gone' },
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
  {
    id: 'rw1-brave-path',
    text: [
      'You knock. Three loud thumps. The hall goes quiet.',
      'Then — something knocks back. Once.',
    ],
    image: { src: img('brave-hall'), alt: 'A fist raised to knock on the glowing door' },
    nextSceneId: 'rw1-door-lock',
  },
  {
    id: 'rw1-clever-path',
    text: [
      'You press your ear to the wood. Something is moving in there.',
      '"Footsteps," whispers Cobb. "Small ones. Interesting."',
    ],
    image: { src: img('clever-hall'), alt: 'An ear pressed against the glowing door with small footprint shadows visible' },
    nextSceneId: 'rw1-door-lock',
  },
  {
    id: 'rw1-door-lock',
    text: [
      'Numbers glow on the door. There is one missing.',
      '"Fill in the blank," says Cobb. "And the door opens."',
    ],
    image: { src: img('door-glow'), alt: 'The door showing a glowing number puzzle with a blank space' },
    event: {
      type: 'riddle',
      promptByLevel: {
        M1: '5 take away something equals 3. What is missing?',
        M2: '10 take away something equals 3. What is the missing number?',
        M3: 'The door shows: 10 − ? = 3. What fills the blank?',
        M4: 'Solve: 10 − ? = 3',
      },
      correctAnswerByLevel: {
        M1: '2',
        M2: '7',
        M3: '7',
        M4: '7',
      },
      hintByLevel: {
        M1: 'Start at 5. Count back until you reach 3.',
        M2: 'Start at 10. Count back until you reach 3. How many steps?',
        M3: 'Think: what number plus 3 equals 10?',
        M4: 'Rearrange: 10 − 3 = ?',
      },
      successSceneId: 'rw1-door-opens',
      failureSceneId: 'rw1-door-lock',
      reward: {
        id: 'rw1-glowstone',
        label: 'Glowstone',
        description: 'A stone pried from the door. It is warm. It fits perfectly in your pocket.',
      },
    },
  },
  {
    id: 'rw1-door-opens',
    text: [
      'The door swings open. Inside is a small room full of floating lights.',
      'In the middle sits a tiny creature, no bigger than your hand, fast asleep.',
    ],
    image: { src: img('door-open'), alt: 'The door wide open revealing a cozy room with floating lights and a small sleeping creature' },
    event: {
      type: 'reward',
      prompt: 'You solved the mystery! You earn a Rootwood Star!',
      reward: {
        id: 'rw1-rootwood-star',
        label: 'Rootwood Star',
        description: 'Awarded for finishing Episode 1. It glows faintly, like it is proud of you.',
      },
      nextSceneId: 'rw1-cliffhanger',
    },
  },
  {
    id: 'rw1-cliffhanger',
    text: [
      'The creature opens one eye. It looks right at you.',
      '"You took long enough," it says.',
    ],
    image: { src: img('creature-wakes'), alt: 'The tiny creature sitting up with one eye open looking directly at the reader' },
    // No nextSceneId — episode end
  },
]

export const rootwoodEpisode1Meta = {
  id: 'rootwood-ep1',
  title: "The Door That Wasn't There",
  narrator: 'Cobb',
  estimatedMinutes: 12,
  mathStandards: ['1.OA.A.1', '1.OA.D.8'],
  readingStandards: ['RF.1.3b', 'RF.1.3a'],
  initialSceneId: 'rw1-arrival',
}
