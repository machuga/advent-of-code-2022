import {
  join,
  last,
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

import {
  calculateKnot,
  calculateKnotPosition,
  calculateKnotPositions,
  computeBoundaries,
  Coords,
  generateInitialState,
  Instruction,
  mapKnotsToPath,
  mappingSteps,
  State,
} from "./lib.ts";

const [arg] = Deno.args;
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const generateBlankGrid = ({ x: [minX, maxX], y: [minY, maxY] }) => {
  const deltaX = maxX - minX + 5;
  const deltaY = maxY - minY + 5;
  const offsetX = minX >= 0 ? 0 : Math.abs(minX);
  const offsetY = minY >= 0 ? 0 : Math.abs(minY);
  const rows = [];

  for (let rowIndex = 0; rowIndex < deltaX + 1; rowIndex++) {
    const cols: string[] = [];

    for (let colIndex = 0; colIndex < deltaY + 1; colIndex++) {
      cols.push(".");
    }

    cols.push(" ");
    cols.push((rowIndex - offsetY).toString());

    rows.push(cols);
  }

  rows.push(rows[0].map(() => " ").slice(0, rows[0].length - 2));
  rows.push(rows[0].map((x, i) => i.toString()).slice(0, rows[0].length - 2));

  return rows;
};

const plotGrid = (state) => {
  const blankSpace = ".";
  const hitSpace = "#";
  const headSpace = "H";
  const tailSpace = "T";
  const startSpace = "s";
  const [minX] = state.boundaries.x;
  const [minY] = state.boundaries.y;
  const offsetX = minX >= 0 ? 0 : Math.abs(minX);
  const offsetY = minY >= 0 ? 0 : Math.abs(minY);

  const tailPositions: Coords[] = state.knots.map(last);
  const [finalTailX, finalTailY]: Coords = last(tailPositions);

  const grid = generateBlankGrid(state.boundaries);

  const allPositions = state.headPath.map((pos: Coords, i: number) =>
    [pos].concat(state.knots[i])
  );

  const updateNode = (grid: string[][], [x, y]: Coords, value: string) => {
    grid[y + offsetY][x + offsetX] = value;
  };

  for (const row of allPositions) {
    const grid = generateBlankGrid(state.boundaries);

    for (let i = row.length - 1; i >= 0; i--) {
      const value = (i === 0) ? "H" : i.toString();

      updateNode(grid, row[i], value);
    }

    //grid[0 + offsetY][0 + offsetX] = "s";

    console.log("\n----- New State -----");
    console.log(grid.reverse().map(join("")).join("\n"));
    console.log("\n---------------------\n\n");

    const input = prompt("Hit for next");
  }

  console.log("\n----- Final State -----");
  for (const [x, y] of tailPositions) {
    grid[y + offsetY][x + offsetX] = hitSpace;
  }

  grid[0 + offsetY][0 + offsetX] = "s";
  grid[finalTailY + offsetY][finalTailX + offsetX] = "9";

  console.log(grid.reverse().map(join("")).join("\n"));

  return state;
};

const parseDirections = pipe([
  split("\n"),
  map(pipe([
    split(" "),
    ([direction, amount]: Instruction) => [direction, toInt(amount)],
  ])),
]);

const part1 = () => {
  const compute = () => {
    return pipe([
      parseDirections,
      generateInitialState(1),
      (state: State) => {
        state.knots = mapKnotsToPath(state.headPath, state.knots);

        return state;
      },
      (state: State) =>
        new Set(state.knots.map((row) => row[row.length - 1].toString())),
      (set: Set<Coords>) => set.size,
    ])(inputList);

    //return inputs(inputList);
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const compute = () => {
    return pipe([
      parseDirections,
      generateInitialState(9),
      (state: State) => {
        state.knots = mapKnotsToPath(state.headPath, state.knots);

        return state;
      },
      //plotGrid,
      (state: State) =>
        new Set(state.knots.map((row) => row[row.length - 1].toString())),
      (set: Set<Coords>) => set.size,
    ])(inputList);

    //return inputs(inputList);
  };
  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
