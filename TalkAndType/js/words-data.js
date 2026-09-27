/**
 * Talk & Type - A to Z Vocabulary & Picture Data
 * 26 Letters, curated iconic words recognizable by kids with phonics and SVG artwork.
 */

const WORDS_DATA = {
  A: [
    {
      word: 'APPLE',
      letter: 'A',
      emoji: '🍎',
      phonics: 'Ah as in Apple',
      hint: 'A crunchy, sweet fruit that grows on trees!',
      alternatives: ['apple', 'an apple', 'red apple', 'apples'],
      color: '#EF4444'
    },
    {
      word: 'AIRPLANE',
      letter: 'A',
      emoji: '✈️',
      phonics: 'Ay as in Airplane',
      hint: 'It has big wings and flies high in the sky!',
      alternatives: ['airplane', 'aeroplane', 'plane', 'air plane'],
      color: '#0284C7'
    },
    {
      word: 'ANT',
      letter: 'A',
      emoji: '🐜',
      phonics: 'Ah as in Ant',
      hint: 'A tiny, super strong insect that lives in a hill!',
      alternatives: ['ant', 'an ant', 'ants'],
      color: '#B45309'
    }
  ],
  B: [
    {
      word: 'BALL',
      letter: 'B',
      emoji: '⚽',
      phonics: 'Buh as in Ball',
      hint: 'Round and bouncy, great for kicking and catching!',
      alternatives: ['ball', 'a ball', 'soccer ball', 'football'],
      color: '#3B82F6'
    },
    {
      word: 'BANANA',
      letter: 'B',
      emoji: '🍌',
      phonics: 'Buh as in Banana',
      hint: 'A yellow, yummy fruit that monkeys love to peel!',
      alternatives: ['banana', 'a banana', 'bananas'],
      color: '#EAB308'
    },
    {
      word: 'BEAR',
      letter: 'B',
      emoji: '🐻',
      phonics: 'Buh as in Bear',
      hint: 'A furry, cuddly forest friend that loves honey!',
      alternatives: ['bear', 'a bear', 'teddy bear', 'brown bear'],
      color: '#92400E'
    }
  ],
  C: [
    {
      word: 'CAT',
      letter: 'C',
      emoji: '🐱',
      phonics: 'Kuh as in Cat',
      hint: 'A cute furry pet with whiskers that says Meow!',
      alternatives: ['cat', 'a cat', 'kitty', 'kitten'],
      color: '#F97316'
    },
    {
      word: 'CAR',
      letter: 'C',
      emoji: '🚗',
      phonics: 'Kuh as in Car',
      hint: 'It has four wheels and goes vroom on the road!',
      alternatives: ['car', 'a car', 'red car', 'automobile'],
      color: '#EF4444'
    },
    {
      word: 'CAKE',
      letter: 'C',
      emoji: '🎂',
      phonics: 'Kuh as in Cake',
      hint: 'A sweet birthday treat with frosting and candles!',
      alternatives: ['cake', 'a cake', 'birthday cake'],
      color: '#EC4899'
    }
  ],
  D: [
    {
      word: 'DOG',
      letter: 'D',
      emoji: '🐶',
      phonics: 'Duh as in Dog',
      hint: 'Man’s best friend that wags its tail and says Woof!',
      alternatives: ['dog', 'a dog', 'puppy', 'doggie'],
      color: '#B45309'
    },
    {
      word: 'DUCK',
      letter: 'D',
      emoji: '🦆',
      phonics: 'Duh as in Duck',
      hint: 'A friendly yellow bird that swims and says Quack Quack!',
      alternatives: ['duck', 'a duck', 'ducky'],
      color: '#F59E0B'
    },
    {
      word: 'DRUM',
      letter: 'D',
      emoji: '🥁',
      phonics: 'Duh as in Drum',
      hint: 'A musical instrument you tap with sticks to make beats!',
      alternatives: ['drum', 'a drum', 'drums'],
      color: '#DC2626'
    }
  ],
  E: [
    {
      word: 'ELEPHANT',
      letter: 'E',
      emoji: '🐘',
      phonics: 'Eh as in Elephant',
      hint: 'The biggest land animal with giant ears and a long trunk!',
      alternatives: ['elephant', 'an elephant'],
      color: '#64748B'
    },
    {
      word: 'EGG',
      letter: 'E',
      emoji: '🥚',
      phonics: 'Eh as in Egg',
      hint: 'Smooth and oval, laid by mother hens in a nest!',
      alternatives: ['egg', 'an egg', 'eggs'],
      color: '#FDE047'
    },
    {
      word: 'EARTH',
      letter: 'E',
      emoji: '🌍',
      phonics: 'Er as in Earth',
      hint: 'Our beautiful blue and green home planet spinning in space!',
      alternatives: ['earth', 'globe', 'planet earth'],
      color: '#10B981'
    }
  ],
  F: [
    {
      word: 'FISH',
      letter: 'F',
      emoji: '🐟',
      phonics: 'Fff as in Fish',
      hint: 'Swims smoothly underwater with fins and shiny scales!',
      alternatives: ['fish', 'a fish', 'goldfish'],
      color: '#06B6D4'
    },
    {
      word: 'FROG',
      letter: 'F',
      emoji: '🐸',
      phonics: 'Fff as in Frog',
      hint: 'A green hopper that jumps between lily pads and says Ribbit!',
      alternatives: ['frog', 'a frog', 'toad'],
      color: '#22C55E'
    },
    {
      word: 'FLOWER',
      letter: 'F',
      emoji: '🌸',
      phonics: 'Fff as in Flower',
      hint: 'Blooms in spring with colorful petals and sweet scent!',
      alternatives: ['flower', 'a flower', 'blossom'],
      color: '#F43F5E'
    }
  ],
  G: [
    {
      word: 'GIRAFFE',
      letter: 'G',
      emoji: '🦒',
      phonics: 'Juh as in Giraffe',
      hint: 'The tallest animal on Earth with a super long neck!',
      alternatives: ['giraffe', 'a giraffe'],
      color: '#D97706'
    },
    {
      word: 'GRAPES',
      letter: 'G',
      emoji: '🍇',
      phonics: 'Guh as in Grapes',
      hint: 'Juicy round purple and green fruits that grow in bunches!',
      alternatives: ['grapes', 'grape', 'a grape'],
      color: '#8B5CF6'
    },
    {
      word: 'GUITAR',
      letter: 'G',
      emoji: '🎸',
      phonics: 'Guh as in Guitar',
      hint: 'A wooden instrument with strings that rocks sweet music!',
      alternatives: ['guitar', 'a guitar'],
      color: '#EF4444'
    }
  ],
  H: [
    {
      word: 'HAT',
      letter: 'H',
      emoji: '🎩',
      phonics: 'Huh as in Hat',
      hint: 'Worn on top of your head to look stylish and shade the sun!',
      alternatives: ['hat', 'a hat', 'cap'],
      color: '#475569'
    },
    {
      word: 'HOUSE',
      letter: 'H',
      emoji: '🏠',
      phonics: 'Huh as in House',
      hint: 'A cozy home where family lives with windows, doors and a roof!',
      alternatives: ['house', 'a house', 'home'],
      color: '#E11D48'
    },
    {
      word: 'HORSE',
      letter: 'H',
      emoji: '🐴',
      phonics: 'Huh as in Horse',
      hint: 'A majestic runner with a mane that gallops and neighs!',
      alternatives: ['horse', 'a horse', 'pony'],
      color: '#B45309'
    }
  ],
  I: [
    {
      word: 'IGLOO',
      letter: 'I',
      emoji: '🧊',
      phonics: 'Ih as in Igloo',
      hint: 'A dome-shaped snowy home built out of ice blocks in the arctic!',
      alternatives: ['igloo', 'an igloo', 'ice house'],
      color: '#38BDF8'
    },
    {
      word: 'ISLAND',
      letter: 'I',
      emoji: '🏝️',
      phonics: 'Eye as in Island',
      hint: 'A patch of warm sandy beach with palm trees surrounded by water!',
      alternatives: ['island', 'an island'],
      color: '#0D9488'
    },
    {
      word: 'ICE',
      letter: 'I',
      emoji: '🍧',
      phonics: 'Eye as in Ice',
      hint: 'Freezing cold, shiny frozen water cubes that keep drinks cool!',
      alternatives: ['ice', 'ice cube', 'ice cream'],
      color: '#60A5FA'
    }
  ],
  J: [
    {
      word: 'JUICE',
      letter: 'J',
      emoji: '🧃',
      phonics: 'Juh as in Juice',
      hint: 'A sweet fruit drink squeezed from oranges or apples!',
      alternatives: ['juice', 'fruit juice', 'orange juice'],
      color: '#F97316'
    },
    {
      word: 'JELLYFISH',
      letter: 'J',
      emoji: '🪼',
      phonics: 'Juh as in Jellyfish',
      hint: 'A translucent ocean swimmer that glows and wiggles like jelly!',
      alternatives: ['jellyfish', 'a jellyfish', 'jelly fish'],
      color: '#A855F7'
    },
    {
      word: 'JACKET',
      letter: 'J',
      emoji: '🧥',
      phonics: 'Juh as in Jacket',
      hint: 'A warm coat you zip up when it’s chilly outside!',
      alternatives: ['jacket', 'a jacket', 'coat'],
      color: '#2563EB'
    }
  ],
  K: [
    {
      word: 'KITE',
      letter: 'K',
      emoji: '🪁',
      phonics: 'Kuh as in Kite',
      hint: 'A colorful diamond flying high in the wind tied to a string!',
      alternatives: ['kite', 'a kite'],
      color: '#EC4899'
    },
    {
      word: 'KANGAROO',
      letter: 'K',
      emoji: '🦘',
      phonics: 'Kuh as in Kangaroo',
      hint: 'An Australian jumper that carries its baby joey in a pouch!',
      alternatives: ['kangaroo', 'a kangaroo'],
      color: '#D97706'
    },
    {
      word: 'KEY',
      letter: 'K',
      emoji: '🔑',
      phonics: 'Kuh as in Key',
      hint: 'A shiny golden metal tool that turns to unlock secret doors!',
      alternatives: ['key', 'a key'],
      color: '#EAB308'
    }
  ],
  L: [
    {
      word: 'LION',
      letter: 'L',
      emoji: '🦁',
      phonics: 'Lll as in Lion',
      hint: 'The brave King of the Jungle with a mighty golden mane!',
      alternatives: ['lion', 'a lion'],
      color: '#F59E0B'
    },
    {
      word: 'LEMON',
      letter: 'L',
      emoji: '🍋',
      phonics: 'Lll as in Lemon',
      hint: 'A bright yellow citrus fruit that makes your lips pucker sour!',
      alternatives: ['lemon', 'a lemon'],
      color: '#FACC15'
    },
    {
      word: 'LEAF',
      letter: 'L',
      emoji: '🍃',
      phonics: 'Lll as in Leaf',
      hint: 'Grows green on tree branches and flutters in the breeze!',
      alternatives: ['leaf', 'a leaf', 'leaves'],
      color: '#16A34A'
    }
  ],
  M: [
    {
      word: 'MONKEY',
      letter: 'M',
      emoji: '🐵',
      phonics: 'Mmm as in Monkey',
      hint: 'Swings by branches, loves bananas, and makes funny faces!',
      alternatives: ['monkey', 'a monkey'],
      color: '#B45309'
    },
    {
      word: 'MOON',
      letter: 'M',
      emoji: '🌙',
      phonics: 'Mmm as in Moon',
      hint: 'Glows in the night sky surrounded by twinkling stars!',
      alternatives: ['moon', 'the moon'],
      color: '#FDE047'
    },
    {
      word: 'MANGO',
      letter: 'M',
      emoji: '🥭',
      phonics: 'Mmm as in Mango',
      hint: 'The delicious king of fruits, sweet and golden juicy!',
      alternatives: ['mango', 'a mango'],
      color: '#FB923C'
    }
  ],
  N: [
    {
      word: 'NEST',
      letter: 'N',
      emoji: '🪺',
      phonics: 'Nnn as in Nest',
      hint: 'A cozy bed of twigs made by birds to keep little eggs safe!',
      alternatives: ['nest', 'a nest', 'bird nest'],
      color: '#78350F'
    },
    {
      word: 'NUT',
      letter: 'N',
      emoji: '🥜',
      phonics: 'Nnn as in Nut',
      hint: 'A crunchy snack with a hard shell loved by squirrels!',
      alternatives: ['nut', 'peanut', 'a nut'],
      color: '#D97706'
    },
    {
      word: 'NOTEBOOK',
      letter: 'N',
      emoji: '📓',
      phonics: 'Nnn as in Notebook',
      hint: 'Filled with blank pages for drawing pictures and writing stories!',
      alternatives: ['notebook', 'a notebook', 'book'],
      color: '#3B82F6'
    }
  ],
  O: [
    {
      word: 'ORANGE',
      letter: 'O',
      emoji: '🍊',
      phonics: 'Ah as in Orange',
      hint: 'A round citrus fruit that shares its name with its color!',
      alternatives: ['orange', 'an orange'],
      color: '#EA580C'
    },
    {
      word: 'OWL',
      letter: 'O',
      emoji: '🦉',
      phonics: 'Ow as in Owl',
      hint: 'A wise night bird with huge round eyes that says Hoo-Hoo!',
      alternatives: ['owl', 'an owl'],
      color: '#92400E'
    },
    {
      word: 'OCTOPUS',
      letter: 'O',
      emoji: '🐙',
      phonics: 'Ah as in Octopus',
      hint: 'An amazing sea creature with eight flexible waving arms!',
      alternatives: ['octopus', 'an octopus'],
      color: '#DB2777'
    }
  ],
  P: [
    {
      word: 'PENGUIN',
      letter: 'P',
      emoji: '🐧',
      phonics: 'Puh as in Penguin',
      hint: 'A tuxedo-wearing bird that waddles on ice and swims like a torpedo!',
      alternatives: ['penguin', 'a penguin'],
      color: '#1E293B'
    },
    {
      word: 'PANDA',
      letter: 'P',
      emoji: '🐼',
      phonics: 'Puh as in Panda',
      hint: 'A cuddly black-and-white bear that munches on green bamboo!',
      alternatives: ['panda', 'a panda', 'panda bear'],
      color: '#0F172A'
    },
    {
      word: 'PIZZA',
      letter: 'P',
      emoji: '🍕',
      phonics: 'Puh as in Pizza',
      hint: 'A slice of warm cheesy goodness topped with yummy tomato sauce!',
      alternatives: ['pizza', 'a pizza', 'slice of pizza'],
      color: '#E11D48'
    }
  ],
  Q: [
    {
      word: 'QUEEN',
      letter: 'Q',
      emoji: '👑',
      phonics: 'Kwuh as in Queen',
      hint: 'A royal ruler wearing a sparkling crown in a grand castle!',
      alternatives: ['queen', 'a queen', 'crown'],
      color: '#F59E0B'
    },
    {
      word: 'QUIET',
      letter: 'Q',
      emoji: '🤫',
      phonics: 'Kwuh as in Quiet',
      hint: 'Shhh! Whispering softly like tiptoeing in a sleeping library!',
      alternatives: ['quiet', 'silence', 'shh'],
      color: '#8B5CF6'
    },
    {
      word: 'QUILT',
      letter: 'Q',
      emoji: '🧵',
      phonics: 'Kwuh as in Quilt',
      hint: 'A warm, colorful stitched blanket that keeps you cozy in bed!',
      alternatives: ['quilt', 'a quilt', 'blanket'],
      color: '#EC4899'
    }
  ],
  R: [
    {
      word: 'RABBIT',
      letter: 'R',
      emoji: '🐰',
      phonics: 'Rrr as in Rabbit',
      hint: 'A fluffy friend with long ears that hops and crunches carrots!',
      alternatives: ['rabbit', 'a rabbit', 'bunny'],
      color: '#F472B6'
    },
    {
      word: 'ROCKET',
      letter: 'R',
      emoji: '🚀',
      phonics: 'Rrr as in Rocket',
      hint: 'Blasts off with roaring fire to visit astronauts in space!',
      alternatives: ['rocket', 'a rocket', 'spaceship'],
      color: '#EF4444'
    },
    {
      word: 'RAINBOW',
      letter: 'R',
      emoji: '🌈',
      phonics: 'Rrr as in Rainbow',
      hint: 'Seven vibrant arching colors glowing when sun shines after rain!',
      alternatives: ['rainbow', 'a rainbow'],
      color: '#8B5CF6'
    }
  ],
  S: [
    {
      word: 'SUN',
      letter: 'S',
      emoji: '☀️',
      phonics: 'Sss as in Sun',
      hint: 'A warm golden star that lights up the day and makes flowers grow!',
      alternatives: ['sun', 'the sun', 'sunshine'],
      color: '#FBBF24'
    },
    {
      word: 'STAR',
      letter: 'S',
      emoji: '⭐',
      phonics: 'Sss as in Star',
      hint: 'Twinkles brightly like a diamond in the dark night sky!',
      alternatives: ['star', 'a star', 'stars'],
      color: '#F59E0B'
    },
    {
      word: 'SNAKE',
      letter: 'S',
      emoji: '🐍',
      phonics: 'Sss as in Snake',
      hint: 'Slithers along the grass with scales and goes sssss!',
      alternatives: ['snake', 'a snake'],
      color: '#16A34A'
    }
  ],
  T: [
    {
      word: 'TIGER',
      letter: 'T',
      emoji: '🐯',
      phonics: 'Tuh as in Tiger',
      hint: 'A fierce striped jungle big cat with blazing orange fur!',
      alternatives: ['tiger', 'a tiger'],
      color: '#EA580C'
    },
    {
      word: 'TRAIN',
      letter: 'T',
      emoji: '🚂',
      phonics: 'Tuh as in Train',
      hint: 'Chugs along railroad tracks with a whistle: Choo-Choo!',
      alternatives: ['train', 'a train', 'steam train'],
      color: '#2563EB'
    },
    {
      word: 'TURTLE',
      letter: 'T',
      emoji: '🐢',
      phonics: 'Tuh as in Turtle',
      hint: 'Walks nice and slow carrying its sturdy shell on its back!',
      alternatives: ['turtle', 'a turtle', 'tortoise'],
      color: '#059669'
    }
  ],
  U: [
    {
      word: 'UMBRELLA',
      letter: 'U',
      emoji: '☂️',
      phonics: 'Uh as in Umbrella',
      hint: 'Opens up wide to keep you dry under rainy showers!',
      alternatives: ['umbrella', 'an umbrella'],
      color: '#8B5CF6'
    },
    {
      word: 'UNICORN',
      letter: 'U',
      emoji: '🦄',
      phonics: 'Yoo as in Unicorn',
      hint: 'A magical horse with a sparkling spiral horn and rainbow mane!',
      alternatives: ['unicorn', 'a unicorn'],
      color: '#F472B6'
    },
    {
      word: 'UNDERWATER',
      letter: 'U',
      emoji: '🌊',
      phonics: 'Uh as in Underwater',
      hint: 'Beneath ocean waves where fish, coral and dolphins swim!',
      alternatives: ['underwater', 'ocean', 'sea'],
      color: '#0284C7'
    }
  ],
  V: [
    {
      word: 'VAN',
      letter: 'V',
      emoji: '🚐',
      phonics: 'Vvv as in Van',
      hint: 'A roomy motor vehicle with sliding doors for family road trips!',
      alternatives: ['van', 'a van', 'minivan'],
      color: '#4F46E5'
    },
    {
      word: 'VIOLIN',
      letter: 'V',
      emoji: '🎻',
      phonics: 'Vvv as in Violin',
      hint: 'A small wooden string instrument played with a graceful bow!',
      alternatives: ['violin', 'a violin', 'fiddle'],
      color: '#B45309'
    },
    {
      word: 'VOLCANO',
      letter: 'V',
      emoji: '🌋',
      phonics: 'Vvv as in Volcano',
      hint: 'A giant mountain that bubbles with glowing hot lava and smoke!',
      alternatives: ['volcano', 'a volcano'],
      color: '#DC2626'
    }
  ],
  W: [
    {
      word: 'WATERMELON',
      letter: 'W',
      emoji: '🍉',
      phonics: 'Wuh as in Watermelon',
      hint: 'A huge green striped fruit with sweet pink juicy slices!',
      alternatives: ['watermelon', 'a watermelon', 'melon'],
      color: '#10B981'
    },
    {
      word: 'WHALE',
      letter: 'W',
      emoji: '🐳',
      phonics: 'Wuh as in Whale',
      hint: 'A gentle giant of the ocean that shoots water spouts high!',
      alternatives: ['whale', 'a whale', 'blue whale'],
      color: '#0284C7'
    },
    {
      word: 'WATCH',
      letter: 'W',
      emoji: '⌚',
      phonics: 'Wuh as in Watch',
      hint: 'Strapped around your wrist to tell what time it is with ticking hands!',
      alternatives: ['watch', 'a watch', 'wristwatch'],
      color: '#6366F1'
    }
  ],
  X: [
    {
      word: 'XYLOPHONE',
      letter: 'X',
      emoji: '🎼',
      phonics: 'Zye as in Xylophone',
      hint: 'A rainbow instrument you tap with mallets to make ding-dong tunes!',
      alternatives: ['xylophone', 'a xylophone'],
      color: '#EC4899'
    },
    {
      word: 'X-RAY',
      letter: 'X',
      emoji: '🩻',
      phonics: 'Ex as in X-Ray',
      hint: 'A magical doctor picture that peeks right through to your bones!',
      alternatives: ['x-ray', 'x ray', 'xray'],
      color: '#06B6D4'
    },
    {
      word: 'XMAS',
      letter: 'X',
      emoji: '🎄',
      phonics: 'Ex as in Xmas',
      hint: 'A cheerful holiday with decorated trees, ornaments and presents!',
      alternatives: ['xmas', 'christmas', 'christmas tree'],
      color: '#16A34A'
    }
  ],
  Y: [
    {
      word: 'YOYO',
      letter: 'Y',
      emoji: '🪀',
      phonics: 'Yuh as in Yo-Yo',
      hint: 'A spinning toy on a string that goes down and snaps back up!',
      alternatives: ['yoyo', 'yo-yo', 'a yoyo'],
      color: '#F43F5E'
    },
    {
      word: 'YACHT',
      letter: 'Y',
      emoji: '⛵',
      phonics: 'Yuh as in Yacht',
      hint: 'A sleek white sailing boat gliding smoothly over sunny seas!',
      alternatives: ['yacht', 'a yacht', 'boat', 'sailboat'],
      color: '#3B82F6'
    },
    {
      word: 'YAK',
      letter: 'Y',
      emoji: '🐂',
      phonics: 'Yuh as in Yak',
      hint: 'A shaggy, long-haired mountain creature with big curved horns!',
      alternatives: ['yak', 'a yak'],
      color: '#78350F'
    }
  ],
  Z: [
    {
      word: 'ZEBRA',
      letter: 'Z',
      emoji: '🦓',
      phonics: 'Zzz as in Zebra',
      hint: 'A wild African horse that rocks bold black and white stripes!',
      alternatives: ['zebra', 'a zebra'],
      color: '#1E293B'
    },
    {
      word: 'ZIPPER',
      letter: 'Z',
      emoji: '🤐',
      phonics: 'Zzz as in Zipper',
      hint: 'Slides up and down to zip jackets, backpacks, and pencil cases!',
      alternatives: ['zipper', 'a zipper', 'zip'],
      color: '#F59E0B'
    },
    {
      word: 'ZOO',
      letter: 'Z',
      emoji: '🦁',
      phonics: 'Zzz as in Zoo',
      hint: 'A wonderful animal park where monkeys, lions and giraffes live!',
      alternatives: ['zoo', 'the zoo', 'animal park'],
      color: '#059669'
    }
  ]
};

window.WORDS_DATA = WORDS_DATA;
