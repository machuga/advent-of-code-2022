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

const parseInstructions = pipe([
  split("\n"),
  map(pipe([
    split(" "),
    ([op, arg]) : number => op == 'noop' ? 0 : parseInt(arg, 10),
  ])),
  reduce((acc, e) => e == 0 ? acc.concat(e) : acc.concat([0, e]), [0]),
]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseInstructions,
      reduce(([x, tracked], num, cycle) => {

        if (cycle % 40 == 20) {
          tracked.push(cycle * x);
        }

        return [x + num, tracked];
      }, [1, []]),
      ([x, tracked]) => sum(tracked),
    ])(inputList);
  };

  console.log(`Part 1: Count is "`, compute());
};

const part2 = () => {
  const compute = () => {
    const cursorOffsets = [-1, 0, 1];

    return pipe([
      parseInstructions,
      reduce(([x, tracked], num, cycle) => {
        const relevantCycle = (cycle - 1) % 40 - x;
        const pixel = cursorOffsets.includes(relevantCycle) ? '#' : '.';

        tracked.push(pixel);

        return [x + num, tracked];
      }, [1, []]),
      ([x, tracked]) => tracked,
      chunk(40),
      map((row) => row.join('')),
    ])(inputList);
  };
  console.log(`Part 2: Count is "`, compute());
};

part1();
part2();
