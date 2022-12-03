const { parseRawInput, processInputArg, pipe, split, map, tap, sum } = require('../util.js');
const [arg = 0] = process.argv.slice(2);

const filename = processInputArg(arg);

const inputList = parseRawInput(filename).trim();

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const part1 = () => {
  const compute = () => {

    const findIntersectingEl = (a, b) => {
      for (const el of a) {
        if (b.has(el)) {
          return el;
        }
      }
    };

    const splitToSet = (str) => {
      const middle = str.length / 2;
      const first = Array.from(str.substr(0, middle));
      const last = Array.from(str.substr(middle));

      return [new Set(first), new Set(last)];
    };

    const splitInput = pipe([
      split('\n'),
      map(splitToSet),
      map(([first, last]) => findIntersectingEl(first, last)),
      map((i) => chars.indexOf(i) + 1),
      sum,
    ]);

    return splitInput(inputList);
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
