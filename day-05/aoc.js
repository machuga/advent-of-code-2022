const { parseRawInput, processInputArg, pipe, split, map, filter, toInt, trim, join, tap, chunk, reduce } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename);

const INSTR_REGEX = /move (?<count>[0-9]+) from (?<source>[0-9]+) to (?<target>[0-9]+)/
const chunkString = (size) => {
  const chunkStringRecur = (str, pos = 0) => {
    const next = pos + size;

    if (pos >= str.length) {
      return [];
    }

    if (str.length < size) {
      return [str];
    }

    return [str.substring(pos, next).trim().replace(/(\[|\])/g, '')].concat(chunkStringRecur(str, next));
  }

  return (str) => chunkStringRecur(str);
}

const parseInputs = pipe([
  split("\n\n"),
  map(split("\n")),
  ([rawStack, rawInstructions]) => {
    const stackRows = rawStack.slice(0, rawStack.length - 1);
    const numberRow = rawStack[rawStack.length - 1];

    const stack = pipe([
      map(chunkString(4)),
      (list) => list.reverse(),
      reduce((stacks, row, rowIndex) => {
        if (rowIndex === 0) {
           return row.map((el) => el === '' ? [] : [el]);
        }

        stacks.forEach((stack, i) => {
          if (row[i] !== '') {
            stacks[i].push(row[i]);
          }
        });

        return stacks;
      }, []),

    ])(stackRows);

    const instructions = pipe([
      filter(Boolean),
      map((instr) => {
        const { groups: { count, source, target }} = instr.match(INSTR_REGEX);

        return [toInt(count), toInt(source) - 1, toInt(target) - 1]
      }),
    ])(rawInstructions);

    return [stack, instructions];
  },
]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseInputs,
      ([stack, instructions]) => {
        instructions.forEach(([count, source, target]) => {
          for (let i = 0; i < count; ++i) {
            const el = stack[source].pop();

            if (el === undefined) {
              return;
            }

            stack[target].push(el);
          }
        });

        return stack;
      },
      map((stack) => stack[stack.length - 1]),
      join(''),
    ])(inputList);
  };

  console.log(`Part 1: Result is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
  };

  console.log(`Part 2: Result is "${compute()}"`);
};

part1();
part2();
