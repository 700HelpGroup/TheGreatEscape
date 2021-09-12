import { sample } from "./helper";

const randomCells = (mazeObj) => {
  const nonWallCells = mazeObj.contents
    .flat(2)
    .filter((cell) => cell.value !== "#");
  const start = sample(
    nonWallCells.filter((cell) => cell.row > 5 && cell.col > 5)
  );
  const end = sample(
    nonWallCells.filter(
      (cell) => cell.row !== start.row && cell.col !== start.col
    )
  );
  return [start, end];
};

const findPath = (mazeObj, start, end) => {
  mazeObj.shortestBFS(end);
  const path = [];
  let currentCell = start;
  while (currentCell != end) {
    path.push({ row: currentCell.row, col: currentCell.col });
    // mazeObj.bfsTraverse(currentCell);
    currentCell = currentCell.getPred();
  }
  path.push({ row: end.row, col: end.col });

  let prevCell = null;
  const cellsToAdd = [];
  path.forEach((cell, index) => {
    if (prevCell && cell.row !== prevCell.row && cell.col !== prevCell.col) {
      const possibleCells = [
        { index, row: cell.row, col: prevCell.col },
        { index, row: prevCell.row, col: cell.col },
      ].filter((cell) => mazeObj.contents[cell.row][cell.col].value !== "#");
      cellsToAdd.push(sample(possibleCells));
    }
    prevCell = cell;
  });
  cellsToAdd.reverse().forEach(({ index, row, col }) => {
    path.splice(index, 0, { row, col });
  });

  mazeObj.clearSolution();
  return path;
};

/*
Generates path from start cell to end cell.
Start and end must be non-wall cells.
If start and/or end is null/undefined, will use random non-wall cell.
*/
export const generatePath = (mazeObj, start = null, end = null) => {
  const [randStart, randEnd] = randomCells(mazeObj);
  return findPath(mazeObj, start ?? randStart, end ?? randEnd);
};
