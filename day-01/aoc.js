const { parseRawInput, sum, pipe, split, map, tap, toInt, sort } = require('../util.js');
const [filename = 0] = process.argv.slice(2);
const inputList = parseRawInput(filename).trim();

const parseInput =
  pipe([
    split('\n\n'),
    map(pipe([
      split('\n'),
      map(toInt)
    ])),
  ]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseInput,
      map(sum),
      tap('lists'),
      (list) => Math.max(...list)
    ])(inputList)
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
    return pipe([
      parseInput,
      map(sum),
      tap('lists'),
      sort,
      (list) => list.slice(list.length - 3),
      sum
    ])(inputList)
  };

  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
