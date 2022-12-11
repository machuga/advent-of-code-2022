const { parseRawInput, processInputArg } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const createRingBuffer = (length) => {
  const buffer = [];

  const push = (el) => {
    if (buffer.length >= length) {
      buffer.shift();
    }

    buffer.push(el);
  };

  const maxAndUnique = () => {
    return length === new Set(buffer).size;
  }

  return {
    push,
    maxAndUnique
  };
};

// mjqjpqmgbljsphdztnvjfqwrcgsmlb
const part1 = () => {
  const compute = () => {
    const buffer = createRingBuffer(4);

    for (let i = 0; i < inputList.length; ++i) {
      buffer.push(inputList[i]);
      if (buffer.maxAndUnique()) {
        return i+1;
      }
    }
  };

  console.log(`Part 1: Result is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
    const buffer = createRingBuffer(14);

    for (let i = 0; i < inputList.length; ++i) {
      buffer.push(inputList[i]);
      if (buffer.maxAndUnique()) {
        return i+1;
      }
    }
  };

  console.log(`Part 2: Result is "${compute()}"`);
};

part1();
part2();
