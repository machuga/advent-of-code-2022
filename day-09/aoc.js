const { parseRawInput, processInputArg, pipe, reduce, map, tap, split, toInt, zip } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const mapping = {
  R: (amount) => ([headX, headY]) => [headX + amount, headY],
  D: (amount) => ([headX, headY]) => [headX, headY - amount],
  L: (amount) => ([headX, headY]) => [headX - amount, headY],
  U: (amount) => ([headX, headY]) => [headX, headY + amount],
};

const mapOverSize = (num, fn) => new Array(num).fill(1).map((el, i) => fn(i+1));

const mappingSteps = {
  R: (amount) => ([headX, headY]) => mapOverSize(amount, i => [headX + i, headY]),
  D: (amount) => ([headX, headY]) => mapOverSize(amount, i => [headX, headY - i]),
  L: (amount) => ([headX, headY]) => mapOverSize(amount, i => [headX - i, headY]),
  U: (amount) => ([headX, headY]) => mapOverSize(amount, i => [headX, headY + i]),
};

// * * *
// * * * -> 1,1
// * H T -> 2,1
// * * *

// * * *
// * H * -> 1,2
// * * T -> 2,1
// * * *

// * H *
// * T * -> 1,3
// * * * -> 1,2
// * * *
const calculateTail = ([headX, headY], [tailX, tailY]) => {
  const deltaX = headX - tailX// > 0 ? 1 : -1;
  const deltaY = headY - tailY// > 0 ? 1 : -1;
  const absoluteDeltaX = Math.abs(deltaX);
  const absoluteDeltaY = Math.abs(deltaY);

  // No actionable change for 0 and 1 in any direction
  if (absoluteDeltaX <= 1 && absoluteDeltaY <= 1) {
    return [tailX, tailY];
  }

  if (absoluteDeltaX > 1) {
    return [headX + (deltaX < 0 ? 1 : -1), headY];
  } else {
    return [headX, headY + (deltaY < 0 ? 1 : -1)];
  }
};

const plotGrid = (state) => {
  const blankSpace = '.';
  const hitSpace = '#';
  const headSpace = 'H';
  const tailSpace = 'T';
  const startSpace = 's';
  const [minX, maxX] = state.boundaries.x;
  const [minY, maxY] = state.boundaries.y;
  const deltaX = maxX - minX;
  const deltaY = maxY - minY;

  const positions = zip(state.headPositions, state.tailPositions);

  const showNode = ([headX, headY], [tailX, tailY], [pointX, pointY]) => {
    if (headX === pointX && headY === pointY) {
      return headSpace
    }

    if (tailX === pointX && tailY === pointY) {
      return tailSpace;
    }

    // Add logic for visited

    return blankSpace;
  }

  for (const [[headX, headY], [tailX, tailY]] of positions) {
    console.log(`\n Next State (${headX, headY})\n`);
    const rows = [];

    for (let rowIndex = 0; rowIndex < deltaX + 1; rowIndex++) {
      const cols = []

      for (let colIndex = 0; colIndex < deltaY + 1; colIndex++) {
        cols.push(showNode([headX, headY], [tailX, tailY], [colIndex, rowIndex]));
      }

      rows.push(cols);
    }

    for (let row of rows.reverse()) {
      console.log(row.join(''));
    }
  }
};

const part1 = () => {
  const inputs = pipe([
    split('\n'),
    map(pipe([
      split(' '),
      ([direction, amount]) => [direction, toInt(amount)],
    ])),
  ]);

  const extent = (el, [min, max]) => [Math.min(el, min), Math.max(el, max)]

  const computeBoundaries = ([newPosX, newPosY], { x, y }) => ({
    x: extent(newPosX, x),
    y: extent(newPosY, y),
  });

  const blankState = () => ({
    boundaries: { x: [0, 0], y: [0, 0] },
    currentHead: [0,0],
    currentTail: [0,0],
    headPositions: [[0,0]],
    tailPositions: [[0,0]],
  });

  const reduceState = pipe([
    reduce((state, [dir, amount]) => {
      const steps = mappingSteps[dir](amount)(state.currentHead);
      const tailSteps = reduce((acc, headPos) => {
        acc.positions.push(calculateTail(headPos, acc.previousTail));
        acc.previousTail = acc.positions[acc.positions.length - 1];

        return acc;
      }, { previousTail: state.currentTail, positions: [] })(steps).positions;

      const newPos = steps[steps.length - 1];

      state.boundaries = computeBoundaries(newPos, state.boundaries);
      state.currentHead = newPos;
      state.currentTail = tailSteps[tailSteps.length - 1];
      state.headPositions.push(...steps)
      state.tailPositions.push(...tailSteps);

      return state;
    }, blankState())
  ]);

  const compute = () => {
    let head = [0, 0];
    let tail = [0, 0];

    return pipe([
      reduceState,
      (state) => {
        //plotGrid(state, state.currentHead);
        return state;
      },
      (state) => new Set(state.tailPositions.map(([x,y]) => `${x},${y}`)),
      (set) => set.size
    ])(inputs(inputList));

    //return inputs(inputList);
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
