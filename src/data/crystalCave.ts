import { sceneImages } from '../assets/scenes'
import type { StoryScene } from '../types/game'

export const crystalCaveEpisode: StoryScene[] = [
  {
    id: 'crystal-cave-entry',
    gradeBand: '3-4',
    text: [
      'You step into the Crystal Cave.',
      'Blue lights sparkle on the walls.',
    ],
    image: {
      src: sceneImages.crystalCaveEntry,
      alt: 'A glowing cave with blue crystals',
    },
    event: {
      type: 'choice',
      promptByGrade: {
        '1-2': 'Which way will you go?',
        '3-4': 'Which tunnel will you explore first?',
        '5': 'Which path seems best for entering the cave safely?',
      },
      options: [
        {
          id: 'glow-tunnel',
          textByGrade: {
            '1-2': 'Take the bright tunnel',
            '3-4': 'Follow the bright crystal tunnel',
            '5': 'Choose the bright tunnel with clear crystal marks',
          },
          nextSceneId: 'crystal-guard',
          flagKey: 'brightTunnel',
        },
        {
          id: 'echo-tunnel',
          textByGrade: {
            '1-2': 'Take the echo tunnel',
            '3-4': 'Follow the tunnel with echoing drops',
            '5': 'Choose the darker echo tunnel and listen for clues',
          },
          nextSceneId: 'echo-riddle',
          flagKey: 'echoTunnel',
        },
      ],
    },
  },
  {
    id: 'crystal-guard',
    gradeBand: '3-4',
    text: [
      'A crystal crab blocks the path.',
      'It taps its claws and asks a quick question.',
    ],
    image: {
      src: sceneImages.crystalGuard,
      alt: 'A crystal crab guarding a cave path',
    },
    event: {
      type: 'combat',
      enemyName: 'Crystal Crab',
      promptByGrade: {
        '1-2': 'What is 3 + 2?',
        '3-4': 'The crab asks: what is 6 + 4?',
        '5': 'Solve this to pass: what is 14 - 5?',
      },
      correctAnswerByGrade: {
        '1-2': '5',
        '3-4': '10',
        '5': '9',
      },
      options: [
        {
          id: 'crab-a',
          textByGrade: { '1-2': '4', '3-4': '8', '5': '8' },
          value: '8',
          isCorrect: false,
        },
        {
          id: 'crab-b',
          textByGrade: { '1-2': '5', '3-4': '10', '5': '9' },
          value: '9',
          isCorrect: true,
        },
        {
          id: 'crab-c',
          textByGrade: { '1-2': '6', '3-4': '12', '5': '10' },
          value: '10',
          isCorrect: false,
        },
      ],
      successSceneId: 'singing-stones',
      failureSceneId: 'crystal-guard',
    },
  },
  {
    id: 'echo-riddle',
    gradeBand: '3-4',
    text: [
      'A soft voice bounces off the cave walls.',
      'The cave asks a riddle in a whisper.',
    ],
    image: {
      src: sceneImages.echoRiddle,
      alt: 'A cave tunnel with sound echoes and crystals',
    },
    event: {
      type: 'riddle',
      promptByGrade: {
        '1-2': 'You find 4 gems. Then you find 2 more. How many gems do you have?',
        '3-4': 'A miner finds 4 gems, then 2 more. How many gems does the miner have now?',
        '5': 'A cave explorer collects 4 crystals and then 2 more. How many crystals were collected in all?',
      },
      correctAnswerByGrade: {
        '1-2': '6',
        '3-4': '6',
        '5': '6',
      },
      hintByGrade: {
        '1-2': 'Start at 4 and count 2 more.',
        '3-4': 'Add 4 and 2.',
        '5': 'Use addition.',
      },
      successSceneId: 'singing-stones',
      failureSceneId: 'echo-riddle',
    },
  },
  {
    id: 'singing-stones',
    gradeBand: '3-4',
    text: [
      'Crystal stones hum a tiny song.',
      'A bright path opens deeper into the cave.',
    ],
    image: {
      src: sceneImages.singingStones,
      alt: 'Glowing stones making music in a cave',
    },
    nextSceneId: 'bat-swarm',
  },
  {
    id: 'bat-swarm',
    gradeBand: '3-4',
    text: [
      'A swarm of crystal bats spins overhead.',
      'The bat captain asks one more fast question.',
    ],
    image: {
      src: sceneImages.batSwarm,
      alt: 'Crystal bats flying through a cave chamber',
    },
    event: {
      type: 'combat',
      enemyName: 'Bat Captain',
      promptByGrade: {
        '1-2': 'What number comes after 9?',
        '3-4': 'What is 5 + 5?',
        '5': 'What is 3 x 4?',
      },
      correctAnswerByGrade: {
        '1-2': '10',
        '3-4': '10',
        '5': '12',
      },
      options: [
        {
          id: 'bat-a',
          textByGrade: { '1-2': '8', '3-4': '9', '5': '10' },
          value: '10',
          isCorrect: false,
        },
        {
          id: 'bat-b',
          textByGrade: { '1-2': '10', '3-4': '10', '5': '12' },
          value: '12',
          isCorrect: true,
        },
        {
          id: 'bat-c',
          textByGrade: { '1-2': '11', '3-4': '11', '5': '14' },
          value: '14',
          isCorrect: false,
        },
      ],
      successSceneId: 'mirror-lake',
      failureSceneId: 'bat-swarm',
    },
  },
  {
    id: 'mirror-lake',
    gradeBand: '3-4',
    text: [
      'A still lake shines like glass.',
      'Words appear on the water in silver light.',
    ],
    image: {
      src: sceneImages.mirrorLake,
      alt: 'A shining lake inside a crystal cave',
    },
    event: {
      type: 'riddle',
      promptByGrade: {
        '1-2': 'There are 8 glowing stones. 3 roll away. How many are left?',
        '3-4': 'A pile has 8 glowing stones. Then 3 roll away. How many remain?',
        '5': 'A cave pool is lined with 8 crystals, but 3 slide into the water. How many remain on the edge?',
      },
      correctAnswerByGrade: {
        '1-2': '5',
        '3-4': '5',
        '5': '5',
      },
      hintByGrade: {
        '1-2': 'Take away 3 from 8.',
        '3-4': 'This is subtraction.',
        '5': 'Subtract the stones that rolled away.',
      },
      successSceneId: 'crystal-heart',
      failureSceneId: 'mirror-lake',
    },
  },
  {
    id: 'crystal-heart',
    gradeBand: '3-4',
    text: [
      'At the center of the cave, a warm crystal glows.',
      'It lights up because you were brave and kind.',
    ],
    image: {
      src: sceneImages.crystalHeart,
      alt: 'A glowing crystal heart at the center of a cave',
    },
    event: {
      type: 'reward',
      promptByGrade: {
        '1-2': 'You found the Crystal Star!',
        '3-4': 'You earned the Crystal Star for finishing the cave!',
        '5': 'You earned the Crystal Star by clearing the cave challenges!',
      },
      reward: {
        id: 'crystal-star',
        label: 'Crystal Star',
        description: 'A bright star from the heart of the cave.',
      },
      nextSceneId: 'cave-exit',
    },
  },
  {
    id: 'cave-exit',
    gradeBand: '3-4',
    text: [
      'You walk out of the cave with your new treasure.',
      'The mountain sparkles as you head home.',
    ],
    image: {
      src: sceneImages.caveExit,
      alt: 'A child leaving a cave with crystal light behind them',
    },
  },
]
