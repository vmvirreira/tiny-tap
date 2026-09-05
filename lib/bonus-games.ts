export type AgeId = '6m' | '9m' | '12m' | '18m' | '24m';

export type BonusGameConfig = {
  id: string;
  age: AgeId;
  title: string;
  prompt: string;
  icon: string;
  color: string;
  skill: string;
  mode: 'tap' | 'find' | 'reveal' | 'choice' | 'sequence' | 'collect' | 'match' | 'sort' | 'pattern' | 'pretend';
  items: string[];
  instruction: string;
};

const colors = ['#ff8a80', '#ffd166', '#78d8c4', '#7bd3f7', '#b99cff', '#ff9acb', '#a7dc78', '#ffad66', '#80cbc4', '#9fa8da'];

const make = (
  age: AgeId,
  entries: Array<Omit<BonusGameConfig, 'age' | 'color'>>,
) => entries.map((entry, index) => ({ ...entry, age, color: colors[index] }));

export const bonusGames: BonusGameConfig[] = [
  ...make('6m', [
    { id: 'firework-fingers', title: 'Firework Fingers', prompt: 'Tap for a burst', icon: '🎆', skill: 'Cause & effect', mode: 'tap', items: ['✨', '⭐', '💫', '🌟'], instruction: 'Tap anywhere for a gentle sparkle' },
    { id: 'rainy-window', title: 'Rainy Window', prompt: 'Make raindrops', icon: '🌧️', skill: 'Visual attention', mode: 'tap', items: ['💧', '💦', '🫧'], instruction: 'Tap the window to make rain' },
    { id: 'balloon-bop', title: 'Balloon Bop', prompt: 'Bop the balloon', icon: '🎈', skill: 'Visual tracking', mode: 'find', items: ['🎈', '☁️', '☁️', '☁️'], instruction: 'Where is the balloon?' },
    { id: 'hello-sun', title: 'Hello, Sun!', prompt: 'Wake up the sun', icon: '🌞', skill: 'Cause & effect', mode: 'reveal', items: ['🌞', '🌙', '☁️', '⭐'], instruction: 'Tap a sky window' },
    { id: 'wiggle-friends', title: 'Wiggle Friends', prompt: 'Make them dance', icon: '🐛', skill: 'Motion awareness', mode: 'tap', items: ['🐛', '🐙', '🦋', '🐝'], instruction: 'Tap to meet a wiggly friend' },
    { id: 'soft-snow', title: 'Soft Snow', prompt: 'Fill the sky', icon: '❄️', skill: 'Cause & effect', mode: 'tap', items: ['❄️', '❅', '❆'], instruction: 'Tap to make snowflakes' },
    { id: 'moon-glow', title: 'Moon Glow', prompt: 'Find the glow', icon: '🌙', skill: 'Light tracking', mode: 'find', items: ['🌙', '⭐', '✨', '☁️'], instruction: 'Tap the glowing moon' },
    { id: 'happy-faces', title: 'Happy Faces', prompt: 'A new hello', icon: '😊', skill: 'Face attention', mode: 'reveal', items: ['😊', '🥰', '😄', '🤗'], instruction: 'Tap each circle for a friendly face' },
    { id: 'leaf-flutter', title: 'Leaf Flutter', prompt: 'Send leaves flying', icon: '🍃', skill: 'Visual tracking', mode: 'tap', items: ['🍃', '🍂', '🌿'], instruction: 'Tap to flutter a leaf' },
    { id: 'big-button', title: 'Big Button', prompt: 'Press and surprise', icon: '🔴', skill: 'Intentional touch', mode: 'choice', items: ['🔴', '🟡', '🔵'], instruction: 'Press the biggest button' },
  ]),
  ...make('9m', [
    { id: 'find-the-bee', title: 'Find the Bee', prompt: 'Buzz, buzz!', icon: '🐝', skill: 'Visual search', mode: 'find', items: ['🐝', '🌼', '🌸', '🌿'], instruction: 'Can you find the bee?' },
    { id: 'rolling-ball', title: 'Rolling Ball', prompt: 'Catch the ball', icon: '⚽', skill: 'Eye tracking', mode: 'find', items: ['⚽', '◯', '◯', '◯'], instruction: 'Tap the rolling ball' },
    { id: 'cup-surprise', title: 'Cup Surprise', prompt: 'Who is hiding?', icon: '🥤', skill: 'Object permanence', mode: 'reveal', items: ['🐭', '🐸', '🐥', '🐰'], instruction: 'Tap a cup to look underneath' },
    { id: 'fishy-follow', title: 'Fishy Follow', prompt: 'Follow the fish', icon: '🐠', skill: 'Hand-eye control', mode: 'find', items: ['🐠', '🫧', '🌊', '🪸'], instruction: 'Catch the swimming fish' },
    { id: 'wheres-teddy', title: 'Where’s Teddy?', prompt: 'Peek behind', icon: '🧸', skill: 'Object permanence', mode: 'reveal', items: ['🧸', '🪁', '🚂', '⚽'], instruction: 'Open the doors to find Teddy' },
    { id: 'bubble-chase', title: 'Bubble Chase', prompt: 'Catch every bubble', icon: '🫧', skill: 'Visual tracking', mode: 'collect', items: ['🫧', '🫧', '🫧', '🫧', '🫧'], instruction: 'Tap the bubbles as they float' },
    { id: 'drop-the-blocks', title: 'Drop the Blocks', prompt: 'Blocks go in', icon: '🧱', skill: 'Early containment', mode: 'collect', items: ['🟥', '🟨', '🟦', '🟩'], instruction: 'Put every block in the box' },
    { id: 'garden-peek', title: 'Garden Peek', prompt: 'Who lives here?', icon: '🌻', skill: 'Curiosity', mode: 'reveal', items: ['🐞', '🐌', '🦋', '🐛'], instruction: 'Tap the flowers to discover a friend' },
    { id: 'tap-the-glow', title: 'Tap the Glow', prompt: 'Light moves around', icon: '💡', skill: 'Touch accuracy', mode: 'find', items: ['💡', '◌', '◌', '◌'], instruction: 'Find the glowing light' },
    { id: 'baby-band', title: 'Baby Band', prompt: 'Meet the sounds', icon: '🪇', skill: 'Sound discovery', mode: 'choice', items: ['🥁', '👏', '🎹'], instruction: 'Tap an instrument' },
  ]),
  ...make('12m', [
    { id: 'stack-the-rings', title: 'Stack the Rings', prompt: 'Bottom to top', icon: '🛟', skill: 'Sequencing', mode: 'sequence', items: ['🟣', '🔵', '🟢', '🟡', '🔴'], instruction: 'Tap the rings from biggest to smallest' },
    { id: 'feed-the-puppy', title: 'Feed the Puppy', prompt: 'A tasty snack', icon: '🐶', skill: 'Pretend play', mode: 'collect', items: ['🦴', '🥕', '🍎', '🧀'], instruction: 'Give the puppy every snack' },
    { id: 'color-pairs', title: 'Color Pairs', prompt: 'Find two alike', icon: '🎨', skill: 'Color matching', mode: 'match', items: ['🔴', '🟡', '🔵'], instruction: 'Find the matching colors' },
    { id: 'shape-drop', title: 'Shape Drop', prompt: 'Shapes go home', icon: '🔷', skill: 'Shape recognition', mode: 'sort', items: ['●', '■', '▲', '●', '■', '▲'], instruction: 'Tap each shape to send it home' },
    { id: 'fruit-basket', title: 'Fruit Basket', prompt: 'Pick the fruit', icon: '🍓', skill: 'Category learning', mode: 'choice', items: ['🍓', '🍌', '🚗', '🍎'], instruction: 'Which one is fruit?' },
    { id: 'copy-my-face', title: 'Copy My Face', prompt: 'Silly expressions', icon: '😛', skill: 'Social imitation', mode: 'reveal', items: ['😛', '😮', '😊', '😉'], instruction: 'Tap and copy the face' },
    { id: 'little-train', title: 'Little Train', prompt: 'Build the train', icon: '🚂', skill: 'Sequencing', mode: 'sequence', items: ['🚂', '🟦', '🟨', '🟥'], instruction: 'Tap the train pieces in order' },
    { id: 'sock-pairs', title: 'Sock Pairs', prompt: 'Find the pairs', icon: '🧦', skill: 'Visual matching', mode: 'match', items: ['🧦', '👟', '🧤'], instruction: 'Turn over two that match' },
    { id: 'bath-time', title: 'Bath Time', prompt: 'Wash the duck', icon: '🛁', skill: 'Pretend routines', mode: 'pretend', items: ['🦆', '🫧', '🚿', '✨'], instruction: 'Tap each step for a bubbly bath' },
    { id: 'sound-baskets', title: 'Sound Baskets', prompt: 'Choose a sound', icon: '👂', skill: 'Listening choice', mode: 'choice', items: ['🐮', '🥁', '🎹'], instruction: 'Tap what you want to hear' },
  ]),
  ...make('18m', [
    { id: 'first-words', title: 'First Words', prompt: 'Name what you see', icon: '💬', skill: 'Vocabulary', mode: 'reveal', items: ['Ball', 'Cat', 'Cup', 'Moon'], instruction: 'Tap a card and say the word together' },
    { id: 'body-parts', title: 'Body Parts', prompt: 'Head, hands, toes', icon: '🖐️', skill: 'Body awareness', mode: 'choice', items: ['👀', '👂', '🖐️', '🦶'], instruction: 'Can you find your hands?' },
    { id: 'feeling-faces', title: 'Feeling Faces', prompt: 'Happy, sad, silly', icon: '🥰', skill: 'Emotion language', mode: 'choice', items: ['😊', '😢', '😴', '😮'], instruction: 'Tap the happy face' },
    { id: 'animal-homes', title: 'Animal Homes', prompt: 'Who lives where?', icon: '🏡', skill: 'Association', mode: 'sort', items: ['🐟', '🐦', '🐶', '🐟', '🐦', '🐶'], instruction: 'Help each animal find home' },
    { id: 'one-two-three', title: 'One, Two, Three', prompt: 'Count together', icon: '3️⃣', skill: 'Early counting', mode: 'sequence', items: ['1️⃣', '2️⃣', '3️⃣'], instruction: 'Tap one, two, then three' },
    { id: 'opposite-day', title: 'Opposite Day', prompt: 'Big and little', icon: '🐘', skill: 'Concept words', mode: 'choice', items: ['🐘', '🐭', '⬆️', '⬇️'], instruction: 'Which one is little?' },
    { id: 'toy-cleanup', title: 'Toy Cleanup', prompt: 'Everything away', icon: '🧺', skill: 'Routine practice', mode: 'collect', items: ['🧸', '🚗', '🪀', '🧱', '⚽'], instruction: 'Put the toys in the basket' },
    { id: 'garden-grow', title: 'Garden Grow', prompt: 'Seed to flower', icon: '🌱', skill: 'Order & nature', mode: 'sequence', items: ['🌰', '🌱', '🌿', '🌻'], instruction: 'Help the flower grow in order' },
    { id: 'puzzle-pals', title: 'Puzzle Pals', prompt: 'Complete the picture', icon: '🧩', skill: 'Problem solving', mode: 'sequence', items: ['🧩', '🧩', '🧩', '🧩'], instruction: 'Tap each piece to finish the puzzle' },
    { id: 'what-comes-next', title: 'What Comes Next?', prompt: 'Spot the pattern', icon: '🔁', skill: 'Pattern awareness', mode: 'pattern', items: ['🔴', '🔵', '🔴'], instruction: 'What comes next?' },
  ]),
  ...make('24m', [
    { id: 'memory-meadow', title: 'Memory Meadow', prompt: 'Find every pair', icon: '🌼', skill: 'Working memory', mode: 'match', items: ['🐝', '🌸', '🐞', '🦋'], instruction: 'Turn over two cards at a time' },
    { id: 'pattern-builder', title: 'Pattern Builder', prompt: 'Finish the row', icon: '🟡', skill: 'Pattern reasoning', mode: 'pattern', items: ['🟡', '🟢', '🟡'], instruction: 'Choose what comes next' },
    { id: 'color-mixer', title: 'Color Mixer', prompt: 'Mix a new color', icon: '🟣', skill: 'Color discovery', mode: 'choice', items: ['🔴', '🔵', '🟡'], instruction: 'Choose two colors to mix' },
    { id: 'mini-kitchen', title: 'Mini Kitchen', prompt: 'Make a tiny meal', icon: '🍳', skill: 'Pretend play', mode: 'pretend', items: ['🥕', '🔪', '🍳', '🍽️'], instruction: 'Tap the cooking steps in order' },
    { id: 'traffic-helper', title: 'Traffic Helper', prompt: 'Stop and go', icon: '🚦', skill: 'Rule following', mode: 'choice', items: ['🔴', '🟡', '🟢'], instruction: 'Which light means go?' },
    { id: 'weather-dress', title: 'Weather Dress-Up', prompt: 'Choose what to wear', icon: '☔', skill: 'Everyday reasoning', mode: 'sort', items: ['☔', '🧥', '🕶️', '🩳', '🥾', '🧢'], instruction: 'Sort clothes for rain or sunshine' },
    { id: 'story-steps', title: 'Story Steps', prompt: 'First, next, last', icon: '📖', skill: 'Story sequencing', mode: 'sequence', items: ['🌰', '🌱', '🌳', '🍎'], instruction: 'Tell the story in order' },
    { id: 'little-maze', title: 'Little Maze', prompt: 'Find the path', icon: '🐭', skill: 'Planning', mode: 'find', items: ['🧀', '⬜', '⬜', '⬜'], instruction: 'Help the mouse find the cheese' },
    { id: 'tiny-composer', title: 'Tiny Composer', prompt: 'Make your own song', icon: '🎼', skill: 'Creative music', mode: 'pretend', items: ['🎹', '🥁', '👏', '🎹'], instruction: 'Tap the band to build a song' },
    { id: 'treasure-trail', title: 'Treasure Trail', prompt: 'Follow the clues', icon: '🗺️', skill: 'Multi-step thinking', mode: 'sequence', items: ['🗺️', '👣', '🔑', '🎁'], instruction: 'Follow the trail to the treasure' },
  ]),
];
