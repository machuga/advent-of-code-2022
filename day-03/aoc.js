const { parseRawInput, processInputArg, pipe, split, map, tap, sum, chunk } = require('../util.js');
const [arg = 0] = process.argv.slice(2);

const filename = processInputArg(arg);

const inputList = parseRawInput(filename).trim();

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const findIntersectingEl = ([head, ...rest]) => {
  return rest.reduce((a, bArr) => {
    const b = new Set(bArr);
    const set = new Set();

    for (const el of a) {
      if (b.has(el)) {
        set.add(el);
      }
    }

    return set;
  }, new Set(head));
};

const calculateCharValue = (value) => chars.indexOf(value) + 1;

const firstFromSet = (set) => Array.from(set)[0];

const part1 = () => {
  const compute = () => {

    const splitToSet = (str) => {
      const middle = str.length / 2;
      const first = Array.from(str.substr(0, middle));
      const last = Array.from(str.substr(middle));

      return [new Set(first), new Set(last)];
    };

    const splitInput = pipe([
      split('\n'),
      map(splitToSet),
      map(findIntersectingEl),
      map(firstFromSet),
      map(calculateCharValue),
      sum,
    ]);

    return splitInput(inputList);
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
    const splitInput = pipe([
      split('\n'),
      chunk(3),
      map(findIntersectingEl),
      map(firstFromSet),
      map(calculateCharValue),
      sum,
    ]);

    return splitInput(inputList);
  };

  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
