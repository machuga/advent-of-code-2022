const { parseRawInput, processInputArg, pipe, flatMap, map, filter, reduce, tap, toInt, split } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();

const parseGrid = pipe([
  split('\n'),
  map(pipe([
    split(''),
    map(toInt),
  ])),
]);

const directions = ['north', 'south', 'west', 'east'];

const getLineOfSight = (grid, rowIndex, colIndex) => (direction) => {
  const nodes = [];

  if (direction === 'north') {
    for (let i = rowIndex - 1; i >= 0; i--) {
      nodes.push(grid[i][colIndex]);
    }
  } else if (direction === 'south') {
    for (let i = rowIndex + 1; i < grid.length; i++) {
      nodes.push(grid[i][colIndex]);
    }
  } else if (direction === 'west') {
    for (let i = colIndex - 1; i >= 0; i--) {
      nodes.push(grid[rowIndex][i]);
    }
  } else if (direction === 'east') {
    for (let i = colIndex + 1; i < grid[rowIndex].length; i++) {
      nodes.push(grid[rowIndex][i]);
    }
  }

  return nodes;
}

const isVisible = (tree) => (lineOfSight) => !lineOfSight.some(neighbor => neighbor >= tree);

const length = (list) => list.length;

const part1 = () => {
  const compute = () => {
    return pipe([
      parseGrid,
      (grid) => reduce((acc, row, rowIndex) => {
        const amount = filter((tree, colIndex) => {
          return pipe([
            map(getLineOfSight(grid, rowIndex, colIndex)),
            //tap(`lines of sight for ${tree} (${rowIndex} ${colIndex})`),
            filter(isVisible(tree)),
            //tap("filtered to lineofsight"),
            (node) => node.length > 0,
          ])(directions);
        })(row).length

        acc += amount;

        return acc;
      }, 0)(grid),
    ])(inputList);
  };

  console.log(`Part 1: Count is "${compute()}"`);
};

const part2 = () => {
  const countVisibleTreesIn = (grid, rowIndex, colIndex) => (direction) => {
    const treeHeight = grid[rowIndex][colIndex];
    const nodes = [];

    if (direction === 'north') {
      for (let i = rowIndex - 1; i >= 0; i--) {
        nodes.push(grid[i][colIndex]);
        if (grid[i][colIndex] >= treeHeight) {
          break;
        }
      }
    } else if (direction === 'south') {
      for (let i = rowIndex + 1; i < grid.length; i++) {
        nodes.push(grid[i][colIndex]);
        if (grid[i][colIndex] >= treeHeight) {
          break;
        }
      }
    } else if (direction === 'west') {
      for (let i = colIndex - 1; i >= 0; i--) {
        nodes.push(grid[rowIndex][i]);
        if (grid[rowIndex][i] >= treeHeight) {
          break;
        }
      }
    } else if (direction === 'east') {
      for (let i = colIndex + 1; i < grid[rowIndex].length; i++) {
        nodes.push(grid[rowIndex][i]);
        if (grid[rowIndex][i] >= treeHeight) {
          break;
        }
      }
    }

    return nodes.length;
  }

  const compute = () => {
    return pipe([
      parseGrid,
      (grid) => reduce((highest, row, rowIndex) => {
        row.forEach((tree, colIndex) => {
          const visibleTrees = directions
            .map(countVisibleTreesIn(grid, rowIndex, colIndex))
            .reduce((product, quantity) => product * quantity, 1);

          if (visibleTrees > highest) {
            highest = visibleTrees;
          }
        });

        return highest;
      }, 0)(grid)
    ])(inputList);
  };

  console.log(`Part 2: Count is "${compute()}"`);
};

part1();
part2();
