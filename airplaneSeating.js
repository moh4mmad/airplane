const isLeftBlock = (blockIndex) => blockIndex === 0;
const isLeftCol = (colIndex) => colIndex === 0;
const isRightBlock = (blocksLength, blockIndex) =>
  blockIndex === blocksLength - 1;
const isRightCol = (colLength, colIndex) => colIndex === colLength - 1;
const isMiddleBlock = (isLeftBlock, isRightBlock) =>
  !isLeftBlock && !isRightBlock;

const isWindowSeat = (blockIndex, colIndex, blocksLength, colLength) => {
  return (
    (isLeftBlock(blockIndex) && isLeftCol(colIndex)) ||
    (isRightBlock(blocksLength, blockIndex) && isRightCol(colLength, colIndex))
  );
};

const isAisleSeat = (blockIndex, colIndex, blocksLength, colLength) => {
  const rightCol = isRightCol(colLength, colIndex);
  const leftBlock = isLeftBlock(blockIndex);
  const rightBlock = isRightBlock(blocksLength, blockIndex);
  const leftCol = isLeftCol(colIndex);
  const middleBlock = isMiddleBlock(leftBlock, rightBlock);

  return (
    (leftBlock && rightCol) ||
    (rightBlock && leftCol) ||
    (middleBlock && (leftCol || rightCol))
  );
};

const isMiddleSeat = (blockIndex, colIndex, blocksLength, colLength) => {
  return (
    !isWindowSeat(blockIndex, colIndex, blocksLength, colLength) &&
    !isAisleSeat(blockIndex, colIndex, blocksLength, colLength)
  );
};

const arrangeSeat = (
  blocks,
  arrangeFunction,
  currentCount,
  largestRowCount,
  passengers
) => {
  const blocksLength = blocks.length;
  let count = currentCount;
  let arranged = false;

  for (let rowIndex = 0; rowIndex < largestRowCount && !arranged; rowIndex++) {
    for (
      let blockIndex = 0;
      blockIndex < blocksLength && !arranged;
      blockIndex++
    ) {
      if (!blocks[blockIndex][rowIndex]) continue;
      const colLength = blocks[blockIndex][rowIndex].length;

      for (let colIndex = 0; colIndex < colLength && !arranged; colIndex++) {
        if (arrangeFunction(blockIndex, colIndex, blocksLength, colLength)) {
          if (count <= passengers) {
            blocks[blockIndex][rowIndex][colIndex] = ++count;
          } else {
            arranged = true;
          }
        }
      }
    }
  }

  return count;
};

function airplaneSeating(seats, passengers) {
  if (!Array.isArray(seats) || !seats.every(Array.isArray)) {
    throw new Error("Invalid seat input. Expected 2d array of numbers.");
  }

  passengers = Number(passengers);
  if (!Number.isInteger(passengers) || passengers < 0) {
    throw new Error(
      "Invalid number of passengers. Expected a non-negative integer."
    );
  }

  const blocks = seats.map(([cols, rows]) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => null))
  );

  let count = 0;
  const rowCounts = blocks.map((rows) => rows.length);
  const largestRowCount = Math.max(...rowCounts);
  count = arrangeSeat(blocks, isAisleSeat, count, largestRowCount, passengers);
  count = arrangeSeat(blocks, isWindowSeat, count, largestRowCount, passengers);
  count = arrangeSeat(blocks, isMiddleSeat, count, largestRowCount, passengers);
  return blocks;
}

module.exports = airplaneSeating;
