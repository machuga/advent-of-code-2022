const { parseRawInput, processInputArg } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const part1 = () => {
  const compute = () => {
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
