import {
  join,
  last,
  sum,
  map,
  parseRawInput,
  pipe,
  processInputArg,
  reduce,
  split,
  tap,
  toInt,
  zip,
} from "../util.ts";

const [arg] = Deno.args;
const filename = processInputArg(arg);
console.log("Reading from", filename)
const inputList = parseRawInput(filename).trim();

type Operation = 'addx' | 'noop';
type NoOp = ['noop'];
type Instruction = [Operation, number] | NoOp;

const parseInstructions = pipe([
  split("\n"),
  map(pipe([
    split(" "),
    tap("Split"),
    ([op, arg]) : number => op == 'noop' ? 0 : parseInt(arg, 10),
  ])),
  reduce((acc, e) => e == 0 ? acc.concat(e) : acc.concat([0, e]), [0])
  // Note: Padded the above by 1 so that I don't have to do cycle + 1
]);

//const padInstructions = (instructions : Instruction[]) => instructions.concat([['noop'], ['noop']]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseInstructions,
      tap("Instructions"),
      //(list) => [1].concat(list),
      //accumulate,
      tap("Values are"),
      //padInstructions,
      tap("Starting cycles"),
      reduce(([x, tracked], num, cycle) => {
        console.log("On cycle", cycle, "X is", x);

        if (cycle % 40 == 20) {
          console.log("Pushing...", cycle, x, cycle * x);
          tracked.push(cycle * x);
        }

        return [x + num, tracked];
      }, [1, []]),
      tap("Here we go"),
      ([x, tracked]) => sum(tracked),
    ])(inputList);
  };

  console.log(`Part 1: Count is "`, compute());
};

const part2 = () => {
  const compute = () => {
    return pipe([
      parseInstructions,
    ])(inputList);
  };
  //console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
