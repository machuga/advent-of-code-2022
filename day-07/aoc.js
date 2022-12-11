const { parseRawInput, processInputArg, toInt, sum, trim, tap, pipe, map, split } = require('../util.js');
const [arg = 0] = process.argv.slice(2);
const filename = processInputArg(arg);
const inputList = parseRawInput(filename).trim();


const determineType = (firstEl) => {
  if (firstEl.startsWith('$')) {
    return 'command';
  }

  if (isNaN(firstEl[0])) {
    return 'dir';
  }

  return 'file';
};

const tokenize = pipe([
  split('\n'),
  map(pipe([trim, split(' ')])),
  map((row) => {
    const [first, ...rest] = row;
    const entryType = determineType(first);

    switch (entryType) {
      case 'command': return { type: 'command', name: row[1], arg: row[2] };
      case 'dir': return { type: 'dir', name: row[1] };
      case 'file': return { type: 'file', name: row[1], size: toInt(row[0]) };
      default: throw new Error("Unknown history entry ${row}");
    }
  }),
]);

const createFile = (name, size, parent) => ({ type: 'file', name, size, parent })
const createDir = (name, parent) => ({ type: 'dir', name, children: [], parent })
const createNodeFromToken = (token, parent) => {
  if (token.type === 'dir') {
    return createDir(token.name, parent);
  }

  if (token.type === 'file') {
    return createFile(token.name, token.size, parent);
  }

  throw new Error("Unknown type");
};

const cd = (name, currentNode) => {
  if (name === '..') {
    return currentNode.name === '/' ? currentNode : currentNode.parent;
  }

  const child = currentNode.children.find(node => node.name === name);

  if (!child) {
    throw new Error(`I am not finding a child of ${currentNode.name} with the name ${name}`);
  }

  return child;
};

const parse = (history, currentIndex = 0) => {
  const rootNode = createDir('/', null);
  let currentNode = rootNode;
  let currentEl;

  const readUntilNext = (tokenType)  => {
    const tokens = [];

    for (; currentIndex < history.length; currentIndex++) {
      if (history[currentIndex].type !== tokenType) {
        tokens.push(history[currentIndex]);
      } else {
        break;
      }
    }

    return tokens;
  };

  for (; currentIndex < history.length; ){
    const currentEl = () => history[currentIndex];

    if (currentEl().type === 'command') {
      if (currentEl().name === 'cd') {

        currentNode = currentEl().arg === '/' ? rootNode : cd(currentEl().arg, currentNode);

        currentIndex++;
        continue;
      }

      if (currentEl().name === 'ls') {
        currentIndex++;
        const children = readUntilNext('command').map((el) => createNodeFromToken(el, currentNode));

        currentNode.children = children;

        // const entries = readUntil('command');
        continue;
      }
      // If cd, localize to that node
      // If ls, capture all nodes until next command
    }

    if (currentEl().type === 'file') {
      console.log("How did I get here?");
      currentIndex++;
    }
  }

  return rootNode;
};

const calculateSizesInTree = (tree) => {
  console.log("I am node", tree.name, tree.size, tree.children?.length);

  // Calculate the nodes, but also name them so we can run through them and keep only directories. flatten at end
  let total = 0;

  tree.children?.forEach((node) => {
    if (node.type ==='dir') {
      console.log("going into node", node.name);
      total += calculateSizesInTree(node);
      console.log("I'm back in node", tree.name);
    } else {
      total += node.size
    }
  });

  console.log(`The total for ${tree.name} is ${total}`);

  return total;
};

const appendSizesToDirs = (tree) => {
  tree.size = 0;

  tree.children?.forEach((node) => {
    if (node.type ==='dir') {
      appendSizesToDirs(node);
    }

    tree.size += node.size
  });

  return tree;
};

const printTree = (tree) => {
  console.log("I am node", tree.name, tree.size, tree.children?.length);

  tree.children?.forEach((node) => {
    if (node.type ==='dir') {
      console.log("going into node", node.name);
      printTree(node);
      console.log("I'm back in node", tree.name);
    } else {
      console.log("child node", node.name, node.size);
    }
  });

  return tree;
};

const findDirsUnder = (maxSize) => (tree) => {
  return tree.children.reduce((acc, node) => {
    if (node.type === 'dir') {
      return acc.concat(findDirsUnder(maxSize)(node));
    }

    return acc;
  }, tree.size <= maxSize ? [{ name: tree.name, size: tree.size}] : []);
};

const part1 = () => {
  const createFile = (name, size, parent) => ({ name, size, parent })
  const createDir = (name, parent) => ({ name, children: [], parent })
  const rootNode = createDir('/', null);

  const compute = () => {
    return pipe([
      tokenize,
      parse,
      appendSizesToDirs,
      findDirsUnder(100_000),
      map(node => node.size),
      sum
    ])(inputList);

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
