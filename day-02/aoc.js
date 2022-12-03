const { parseRawInput, sum, pipe, split, map, tap, toInt, sort } = require('../util.js');
const [filename = 0] = process.argv.slice(2);
const inputList = parseRawInput(filename).trim();

// Map
// A => Rock
// B => Paper
// C => Scissors
//
// X => Rock
// Y => Paper
// Z => Scissors


const list = ['A','B','C'];

const winBonus = (theirs, mine) => {
  if (theirs === mine) {
    return 3;
  }

  if (list[(list.indexOf(theirs) + 1) % 3] === mine) {
    return 6;
  }

  return 0;
};

// X lose
// Y draw
// Z win

const parseInput =
  pipe([
    split('\n'),
    map(split(' '))
  ]);

const part1 = () => {
  const pairMapping = {
    'X': 'A',
    'Y': 'B',
    'Z': 'C',
  };

  const compute = () => {
    return pipe([
      parseInput,
      map(([theirs, originalMine]) => {
        const mine = pairMapping[originalMine];

        return list.indexOf(mine) + 1 + winBonus(theirs, mine);
      }),
      sum
    ])(inputList)
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
    const calculateWin = (char) => {
      switch (char) {
        case 'X': return -1;
        case 'Y': return 0;
        case 'Z': return 1;
      }
    };

    return pipe([
      parseInput,
      map(([theirs, endgame]) => {
        console.log("Theirs", theirs, "endgame", endgame);
        const offset = calculateWin(endgame)
        const rawIndex = (list.indexOf(theirs) + offset) % 3;
        const index = rawIndex < 0 ? list.length + rawIndex : rawIndex;
        const mine = list[index]
        const bonus = winBonus(theirs, mine);

        return index + 1 + bonus;
      }),
      sum
    ])(inputList)
  };

  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
