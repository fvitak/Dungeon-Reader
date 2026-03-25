# Dungeon Reader — Handoff Addendum
# Applies on top of: CLAUDE_CODE_HANDOFF_v2.md
# Issue found: story text and challenge numbers were mismatched

---

## THE RULE (applies to all episodes, forever)

Story text is FIXED — identical for all skill levels.
Challenge numbers ALWAYS match the story exactly.
Skill level only changes HOW the question is asked and what hint is given.
The numbers in the options are always the same regardless of skill level.

This was caught on the knot puzzle scene: the story said "seven knots on the
left, six on the right" but the M1 challenge said "3 knots on the left and 2
on the right." Those numbers contradicted each other. A kid reading the story
and then seeing different numbers in the challenge is confused and loses trust
in the game.

ALSO: if the story already gives the reader the numbers they need, the
challenge should not restate them. The challenge should give a REASON why
the number matters to the story, then just ask for the answer.

---

## SPECIFIC FIXES FOR rootwoodEpisode1.ts

### Fix 1 — rw1-knot-puzzle scene

Replace the entire scene with this:

```typescript
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
```

### Fix 2 — rw1-door-lock scene

Replace the entire scene with this:

```typescript
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
```

### Fix 3 — rw1-cobb-notices scene

The story already says the door was not there yesterday. The challenge should
not restate this as a setup — it should just ask about what the reader just read.

Replace the entire scene with this:

```typescript
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
```

---

## THE PATTERN FOR ALL FUTURE EPISODES

When writing a new challenge scene, follow this order:

1. Write the story text first. Put the numbers or clues the kid needs
   directly in the story. Make them matter to the world — give them a
   reason to exist ("the door counts every knot," "the lock needs the
   right number," "the creature will only wake if you get it right").

2. Write the challenge prompt. It should be SHORT because the story
   already did the setup. Often just one sentence. Never restate the
   numbers from the story — the kid just read them.

3. Write the options. Same three options for all skill levels.
   Wrong options should be plausible mistakes, not random numbers.
   For addition: one answer that is 2 too low, one that is 1 too low.
   For subtraction: one too high, one too low.
   For reading comprehension: one answer that is partially true but
   misses the point, one that is clearly wrong but sounds story-related.

4. Write the hints. These are the only place skill level changes
   the substance of content. Lower levels get more concrete guidance
   ("count back from 10"). Higher levels get a nudge ("rearrange it").

---

## VERIFY AFTER APPLYING FIXES

1. On the knot puzzle page: story text says "Seven knots on the left.
   Six on the right." Challenge options are 11, 12, 13. No other
   numbers appear anywhere on that screen.

2. On the door lock page: story text shows "10 − ? = 3". Challenge
   options are 5, 6, 7. The equation in the story matches the challenge.

3. On the cobb-notices page: story mentions the door appeared
   unexpectedly. Challenge asks what is strange about it. Options
   are consistent with the story.

4. At M1 skill level, the knot puzzle challenge says "Count all the
   knots" — NOT "3 knots on the left and 2 on the right."
