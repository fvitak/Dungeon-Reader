import { sceneImages } from '../assets/scenes'
import type { StoryScene } from '../types/game'

export const storyScenes: StoryScene[] = [
  {
    id: 'forest-gate',
    gradeBand: '3-4',
    text: [
      'You reach the ancient gate at the edge of Moonlit Forest.',
      'A wise owl perched above the arch says the path opens only for those who choose well.',
    ],
    image: {
      src: sceneImages.forestGate,
      alt: 'A glowing forest gate beneath a night sky',
    },
    event: {
      type: 'choice',
      promptByGrade: {
        '1-2': 'Which path will you take?',
        '3-4': 'Two paths stretch before you. Which do you follow?',
        '5': 'The owl watches as you weigh your options. Which path do you take?',
      },
      options: [
        {
          id: 'path-river',
          textByGrade: {
            '1-2': 'Follow the river',
            '3-4': 'Follow the river',
            '5': 'Follow the glowing river',
          },
          nextSceneId: 'river-riddle',
          flagKey: 'choseRiver',
        },
        {
          id: 'path-bridge',
          textByGrade: {
            '1-2': 'Cross the bridge',
            '3-4': 'Cross the stone bridge',
            '5': 'Cross the old stone bridge',
          },
          nextSceneId: 'bridge-guard',
          flagKey: 'choseBridge',
        },
      ],
    },
  },
  {
    id: 'river-riddle',
    gradeBand: '3-4',
    text: [
      'Silver fish dart through the stream as a turtle blocks the stepping stones.',
      "The turtle eyes you slowly: 'Answer my riddle, and I will let you pass.'",
    ],
    image: {
      src: sceneImages.riverRiddle,
      alt: 'A dark river with stepping stones and a turtle',
    },
    event: {
      type: 'riddle',
      promptByGrade: {
        '1-2': 'You spot 2 birds resting on a mossy rock, and 3 more birds sitting on a branch above the stream. How many birds do you see in all?',
        '3-4': 'Two turtles bask on a sunny log. Three more swim over and climb up beside them. How many turtles are on the log now?',
        '5': 'A flock of birds perches along the riverbank. You count 3 on the left bank and 2 on a half-submerged log in the middle. How many birds are there in all?',
      },
      correctAnswerByGrade: {
        '1-2': '5',
        '3-4': '5',
        '5': '5',
      },
      hintByGrade: {
        '1-2': 'Count each group, then bring them together.',
        '3-4': 'Think about how many were there first, then how many joined.',
        '5': 'Count each group carefully, then add them up.',
      },
      successSceneId: 'treasure-clearing',
      failureSceneId: 'river-riddle',
      reward: {
        id: 'river-pearl',
        label: 'River Pearl',
        description: 'A bright pearl from the turtle.',
      },
    },
  },
  {
    id: 'bridge-guard',
    gradeBand: '3-4',
    text: [
      'A carved stone sentinel blocks the bridge, its eyes glowing faintly in the dark.',
      'It does not move. It only waits — for the right answer.',
    ],
    image: {
      src: sceneImages.bridgeGuard,
      alt: 'A stone bridge with a sentinel statue',
    },
    event: {
      type: 'combat',
      enemyName: 'Stone Sentinel',
      promptByGrade: {
        '1-2': 'The bridge has 4 torches on the left wall and 1 torch on the right. How many torches light the bridge?',
        '3-4': "The sentinel speaks: 'I have watched 7 travelers cross at dawn and 5 more at dusk. How many travelers have I seen today?'",
        '5': 'Twelve banners once lined this bridge. Three were torn away by the last great storm. How many banners still hang?',
      },
      correctAnswerByGrade: {
        '1-2': '5',
        '3-4': '12',
        '5': '9',
      },
      options: [
        {
          id: 'bridge-a',
          textByGrade: { '1-2': '4', '3-4': '10', '5': '8' },
          value: '4',
          isCorrect: false,
        },
        {
          id: 'bridge-b',
          textByGrade: { '1-2': '5', '3-4': '12', '5': '9' },
          value: '5',
          isCorrect: true,
        },
        {
          id: 'bridge-c',
          textByGrade: { '1-2': '6', '3-4': '14', '5': '10' },
          value: '6',
          isCorrect: false,
        },
      ],
      successSceneId: 'treasure-clearing',
      failureSceneId: 'bridge-guard',
      reward: {
        id: 'guardian-coin',
        label: 'Guardian Coin',
        description: 'A heavy coin pressed into your hand as the sentinel steps aside.',
      },
    },
  },
  {
    id: 'treasure-clearing',
    gradeBand: '3-4',
    nextSceneId: 'crystal-cave-entry',
    text: [
      'You step into a moonlit clearing where strange flowers glow like embers.',
      'The chest creaks open, and something glimmers inside...',
    ],
    image: {
      src: sceneImages.treasureClearing,
      alt: 'A clearing with glowing flowers and a treasure chest',
    },
    event: {
      type: 'reward',
      promptByGrade: {
        '1-2': 'You found a shining star!',
        '3-4': 'You found a shining Forest Star!',
        '5': 'You found the Forest Star for finishing the path!',
      },
      reward: {
        id: 'forest-star',
        label: 'Forest Star',
        description: 'A shining star for finishing the path.',
      },
    },
  },
  {
    id: 'crystal-cave-entry',
    gradeBand: '3-4',
    nextSceneId: 'echo-riddle',
    text: [
      'Beyond the clearing, the path dips into a glittering cave.',
      'Crystals the size of boulders line the walls, humming with cold light.',
    ],
    image: {
      src: sceneImages.crystalCaveEntry,
      alt: 'The entrance to a glittering crystal cave',
    },
  },
  {
    id: 'echo-riddle',
    gradeBand: '3-4',
    text: [
      'Your footsteps echo strangely in this chamber.',
      "A voice drifts from the crystal walls: 'Only those who listen carefully may pass.'",
    ],
    image: {
      src: sceneImages.echoRiddle,
      alt: 'A crystal chamber with echoing walls',
    },
    event: {
      type: 'riddle',
      promptByGrade: {
        '1-2': 'You find 4 blue crystals near the entrance and 3 green ones deeper in. How many crystals did you find in all?',
        '3-4': 'A crystal shelf held 11 shards. You brushed past and 4 fell to the floor. How many shards are still on the shelf?',
        '5': 'The cave holds 15 glowing mushrooms. After you pass through, 8 go dark. How many still glow?',
      },
      correctAnswerByGrade: {
        '1-2': '7',
        '3-4': '7',
        '5': '7',
      },
      hintByGrade: {
        '1-2': 'Put the two groups together.',
        '3-4': 'Start with what was there, then take away what fell.',
        '5': 'Subtract the ones that went dark from the total.',
      },
      successSceneId: 'bat-swarm',
      failureSceneId: 'echo-riddle',
      reward: {
        id: 'echo-crystal',
        label: 'Echo Crystal',
        description: 'A crystal that hums when you hold it.',
      },
    },
  },
  {
    id: 'bat-swarm',
    gradeBand: '3-4',
    text: [
      'The ceiling erupts — dozens of bats pour from a crack in the rock above you.',
      'Their wings beat the cold air. The swarm watches you with tiny glinting eyes.',
    ],
    image: {
      src: sceneImages.batSwarm,
      alt: 'A swarm of bats in a dark cave',
    },
    event: {
      type: 'combat',
      enemyName: 'Bat Swarm',
      promptByGrade: {
        '1-2': 'You count 5 bats on the left wall and 4 on the right. How many bats in all?',
        '3-4': 'Six bats swoop in from the left and seven from the right. How many bats are circling you?',
        '5': 'A colony of 18 bats splits in half — one half darts away into a side tunnel. How many remain?',
      },
      correctAnswerByGrade: {
        '1-2': '9',
        '3-4': '13',
        '5': '9',
      },
      options: [
        {
          id: 'bat-a',
          textByGrade: { '1-2': '8', '3-4': '11', '5': '8' },
          value: '8',
          isCorrect: false,
        },
        {
          id: 'bat-b',
          textByGrade: { '1-2': '9', '3-4': '13', '5': '9' },
          value: '9',
          isCorrect: true,
        },
        {
          id: 'bat-c',
          textByGrade: { '1-2': '10', '3-4': '15', '5': '10' },
          value: '10',
          isCorrect: false,
        },
      ],
      successSceneId: 'mirror-lake',
      failureSceneId: 'bat-swarm',
      reward: {
        id: 'bat-wing-token',
        label: 'Bat Wing Token',
        description: 'A dark token that hums with cave energy.',
      },
    },
  },
  {
    id: 'mirror-lake',
    gradeBand: '3-4',
    text: [
      'A perfectly still lake fills the next chamber, reflecting every stone like a mirror.',
      "A voice rises from the water: 'What do you see when you look closely?'",
    ],
    image: {
      src: sceneImages.mirrorLake,
      alt: 'A still underground lake that mirrors the ceiling',
    },
    event: {
      type: 'riddle',
      promptByGrade: {
        '1-2': "You count 3 white stones and 4 black stones at the water's edge. How many stones are there in all?",
        '3-4': 'The lake reflects 12 stars above. Clouds drift in and cover 5 of them. How many stars are still reflected?',
        '5': 'You spot 19 ripples spreading across the lake. Then 12 fade and vanish. How many ripples remain?',
      },
      correctAnswerByGrade: {
        '1-2': '7',
        '3-4': '7',
        '5': '7',
      },
      hintByGrade: {
        '1-2': 'Count all the stones together.',
        '3-4': 'Start with all the stars and take away the covered ones.',
        '5': 'Subtract the ones that faded.',
      },
      successSceneId: 'singing-stones',
      failureSceneId: 'mirror-lake',
      reward: {
        id: 'mirror-shard',
        label: 'Mirror Shard',
        description: 'A sliver of the lake surface, still and clear.',
      },
    },
  },
  {
    id: 'singing-stones',
    gradeBand: '3-4',
    text: [
      'Ancient stones arranged in a ring begin to glow as you step closer.',
      'A deep tone rises from them — a challenge ringing through the rock.',
    ],
    image: {
      src: sceneImages.singingStones,
      alt: 'A ring of glowing ancient stones',
    },
    event: {
      type: 'combat',
      enemyName: 'Singing Stone',
      promptByGrade: {
        '1-2': "The stones sing: 'Six steps lead up, two steps lead down. How many steps did you walk in all?'",
        '3-4': "The stones chime: 'Seven emeralds rest on the left stone, five on the right. How many emeralds in all?'",
        '5': "The stones harmonize: 'Our song has 20 notes. We add 8 more for the final verse. How many notes in all?'",
      },
      correctAnswerByGrade: {
        '1-2': '8',
        '3-4': '12',
        '5': '28',
      },
      options: [
        {
          id: 'stone-a',
          textByGrade: { '1-2': '7', '3-4': '10', '5': '26' },
          value: '7',
          isCorrect: false,
        },
        {
          id: 'stone-b',
          textByGrade: { '1-2': '8', '3-4': '12', '5': '28' },
          value: '8',
          isCorrect: true,
        },
        {
          id: 'stone-c',
          textByGrade: { '1-2': '9', '3-4': '14', '5': '30' },
          value: '9',
          isCorrect: false,
        },
      ],
      successSceneId: 'crystal-guard',
      failureSceneId: 'singing-stones',
      reward: {
        id: 'stone-chime',
        label: 'Stone Chime',
        description: 'A small stone that rings softly when tapped.',
      },
    },
  },
  {
    id: 'crystal-guard',
    gradeBand: '3-4',
    text: [
      'The final door looms ahead, sealed with locks of living crystal.',
      "A towering guardian steps forward. Its voice is like breaking glass: 'Prove yourself.'",
    ],
    image: {
      src: sceneImages.crystalGuard,
      alt: 'A towering crystal guardian blocking the final door',
    },
    event: {
      type: 'combat',
      enemyName: 'Crystal Guardian',
      promptByGrade: {
        '1-2': 'The guardian holds 4 crystals in one hand and 5 in the other. How many crystals does it hold in all?',
        '3-4': "The guardian's armor has 7 crystal panels on the front and 6 on the back. How many panels in all?",
        '5': "The guardian's sword bears 25 runes. Nine are cracked and broken. How many runes remain whole?",
      },
      correctAnswerByGrade: {
        '1-2': '9',
        '3-4': '13',
        '5': '16',
      },
      options: [
        {
          id: 'guard-a',
          textByGrade: { '1-2': '8', '3-4': '11', '5': '15' },
          value: '8',
          isCorrect: false,
        },
        {
          id: 'guard-b',
          textByGrade: { '1-2': '9', '3-4': '13', '5': '16' },
          value: '9',
          isCorrect: true,
        },
        {
          id: 'guard-c',
          textByGrade: { '1-2': '10', '3-4': '15', '5': '17' },
          value: '10',
          isCorrect: false,
        },
      ],
      successSceneId: 'crystal-heart',
      failureSceneId: 'crystal-guard',
      reward: {
        id: 'guardian-key',
        label: 'Guardian Key',
        description: 'A crystal key that opens the final door.',
      },
    },
  },
  {
    id: 'crystal-heart',
    gradeBand: '3-4',
    text: [
      'The door opens to reveal a chamber pulsing with warm light.',
      'At the center floats a crystal heart — the treasure at the very bottom of the dungeon.',
    ],
    image: {
      src: sceneImages.crystalHeart,
      alt: 'A glowing crystal heart in a radiant chamber',
    },
    event: {
      type: 'reward',
      promptByGrade: {
        '1-2': 'You found the Crystal Heart!',
        '3-4': 'You found the Crystal Heart of the dungeon!',
        '5': 'The Crystal Heart of the deep dungeon is yours at last!',
      },
      reward: {
        id: 'crystal-heart-item',
        label: 'Crystal Heart',
        description: 'The heart of the dungeon, pulsing with ancient magic.',
      },
    },
  },
]
