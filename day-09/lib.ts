import { last, pipe, reduce } from "../util.ts";

export type X = number;
export type Y = number;

export type AxisRange = [X, X] | [Y, Y];
export type Coords = [X, Y];
export type Path = Coords[];
export type Boundaries = { x: AxisRange; y: AxisRange };

export type Instruction = [Direction, number];
export type Direction = "R" | "L" | "U" | "D";

export type State = {
  headPath: Path;
  knots: Path[][];
  boundaries: Boundaries;
};

export const mapOverSize = (num: number, fn: Function) =>
  new Array(num).fill(1).map((_, i) => fn(i + 1));

// @ts-ignore: No
export const mappingSteps = {
  R: (amount: number, [headX, headY]: Coords) =>
    mapOverSize(amount, (i: number) => [headX + i, headY]),
  D: (amount: number, [headX, headY]: Coords) =>
    mapOverSize(amount, (i: number) => [headX, headY - i]),
  L: (amount: number, [headX, headY]: Coords) =>
    mapOverSize(amount, (i: number) => [headX - i, headY]),
  U: (amount: number, [headX, headY]: Coords) =>
    mapOverSize(amount, (i: number) => [headX, headY + i]),
};

export const deltaOffset = (delta: number) => delta < 0 ? 1 : -1;

export const calculateKnot = (
  [prevKnotX, prevKnotY]: Coords,
  [prevPosX, prevPosY]: Coords,
) => {
  const deltaX = prevKnotX - prevPosX;
  const deltaY = prevKnotY - prevPosY;
  const absoluteDeltaX = Math.abs(deltaX);
  const absoluteDeltaY = Math.abs(deltaY);

  // No actionable change for 0 and 1 in any direction
  if (absoluteDeltaX <= 1 && absoluteDeltaY <= 1) {
    return [prevPosX, prevPosY];
  }

  if (absoluteDeltaX > 1) {
    return [prevKnotX + deltaOffset(deltaX), prevKnotY];
  } else {
    return [prevKnotX, prevKnotY + deltaOffset(deltaY)];
  }
};

export const extent = (
  el: number,
  [min, max]: Coords,
): AxisRange => [Math.min(el, min), Math.max(el, max)];

export const computeBoundaries = (
  [newPosX, newPosY]: Coords,
  { x, y }: Boundaries,
) => ({
  x: extent(newPosX, x),
  y: extent(newPosY, y),
});

export const blankState = (knotQty: number): State => ({
  headPath: [[0, 0]],
  knots: [new Array(knotQty).fill([0, 0])],
  boundaries: { x: [0, 0], y: [0, 0] },
});

export const generateInitialState = (knotQty: number) =>
  reduce((state: State, [dir, amount]: Instruction): State => {
    const steps = mappingSteps[dir](amount, last(state.headPath));
    const boundaries = computeBoundaries(last(steps), state.boundaries);

    return {
      headPath: state.headPath.concat(steps),
      boundaries,
      knots: state.knots,
    };
  }, blankState(knotQty));

export const calculateKnotPosition = (
  [prevX, prevY]: Coords,
  [headX, headY]: Coords,
): Coords => {
  const deltaX = headX - prevX;
  const deltaY = headY - prevY;
  const absoluteDeltaX = Math.abs(deltaX);
  const absoluteDeltaY = Math.abs(deltaY);

  // No actionable change for 0 and 1 in any direction
  if (absoluteDeltaX <= 1 && absoluteDeltaY <= 1) {
    return [prevX, prevY];
  }

  let newX = prevX;
  let newY = prevY;

  // Could clean this up, but meh
  if (absoluteDeltaX > 1 && absoluteDeltaY > 1) {
    newX = headX + (deltaX > 0 ? -1 : 1);
    newY = headY + (deltaY > 0 ? -1 : 1);
  } else if (absoluteDeltaX > 1) {
    newX = headX + (deltaX > 0 ? -1 : 1);
    newY = headY;
  } else if (absoluteDeltaY > 1) {
    newX = headX;
    newY = headY + (deltaY > 0 ? -1 : 1);
  }

  return [newX, newY];
};

const knotPositionWithResult =
  (prevPos: Coords) => ([acc, lastKnot]: [Coords[], Coords]) => {
    const pos = calculateKnotPosition(prevPos, lastKnot);

    return [acc.concat([pos]), pos];
  };

export const calculateKnotPositions = (
  prevRow: Coords[],
  headPos: Coords,
): Coords[] =>
  pipe(
    prevRow.map(knotPositionWithResult).concat(([acc]) => acc),
  )([
    [],
    headPos,
  ]) as Coords[];

export const mapKnotsToPath = (headPath: Path, originalKnots: Coords[][]) => {
  const knots = [...originalKnots];

  headPath.forEach((point: Coords, index: number) => {
    if (index !== 0) {
      knots.push(calculateKnotPositions(knots[index - 1], point));
    }
  });

  return knots;
};
