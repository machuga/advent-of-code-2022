import {
  sum,
  map,
  parseRawInput,
  pipe,
  processInputArg,
  reduce,
  split,
  chunk,
  tap,
} from "../util.ts";

const [arg] = Deno.args;
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const parseMonkey = () => {};
const parseMonkeyLine = (str) => 
const parseStartingItems = () => {};
const parseOperation = () => {};
const parseTestConsequence = () => {};
const parseTestAlternative = () => {};
const parseTest = () => {};

const parseInstructions = pipe([
  split("\n\n"),
  map(pipe([
    split("\n"),
  ])),
]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseInstructions,
    ])(inputList);
  };

  console.log(`Part 1: Count is "`, compute());
};

const part2 = () => {
  const compute = () => {
    const cursorOffsets = [-1, 0, 1];

    return pipe([
      parseInstructions,
    ])(inputList);
  };
  //console.log(`Part 2: Count is "`, compute());
};

part1();
part2();
