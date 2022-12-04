const { parseRawInput, processInputArg, pipe, split, map, filter, toInt, tap } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const part1 = () => {
  const parseToRanges = pipe([
    split("\n"),
    map(pipe([
      split(","),
      map(
        pipe([
          split("-"),
          map(toInt)
        ])
      )
    ])),
  ]);

  const containsPairSet = ([a,b]) => doesSetContain(a,b) || doesSetContain(b,a)

  const doesSetContain = ([minA, maxA], [minB, maxB]) => (minA <= minB && maxA >= maxB)

  const compute = () => {

    return pipe([
      parseToRanges,
      map(containsPairSet),
      filter(Boolean)
    ])(inputList).length;
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
  };

  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
