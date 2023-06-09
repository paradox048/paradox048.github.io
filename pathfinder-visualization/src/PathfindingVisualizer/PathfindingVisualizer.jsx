import React, { useState, useEffect, useRef, useCallback} from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

// const START_NODE_ROW = 10;
// const START_NODE_COL = 15;
// const FINISH_NODE_ROW = 10;
// const FINISH_NODE_COL = 35;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const mouseIsPressed = useRef(false);
  const [START_NODE_ROW, setStartNodeRow] = useState(5);
  const [FINISH_NODE_ROW, setFinishNodeRow] = useState(5);
  const [START_NODE_COL, setStartNodeCol] = useState(5);
  const [FINISH_NODE_COL, setFinishNodeCol] = useState(45);
  const [running, setRunnning] = useState(false);


  useEffect(() => {
    const initialGrid = getInitialGrid(
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL
    );
    setGrid(initialGrid);
  }, [START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL]);
  

  const handleMouseDown = useCallback((row, col) => {
    if (!running) {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
      mouseIsPressed.current = true;
    }
  },[grid, running]);

  const handleMouseEnter = useCallback((row, col) => {
    if (!running && mouseIsPressed.current) {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  },[grid, running]);

  const handleMouseUp = useCallback(() => {
    mouseIsPressed.current = false;
  },[]);

  const visualizeDijkstra = async () => {
    setRunnning(true);
    const { visitedNodesInOrder, nodesInShortestPathOrder } = await animateDijkstra();
    animateShortestPath(nodesInShortestPathOrder);
    setRunnning(false);
  };

  /********** CLEARS THE GRID *************/
  const clearWall = () => {
    const initialGrid = getInitialGrid(START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
    setGrid(initialGrid);
  }
  
  const clearGrid = () => {
    if (!running) {
      const newGrid = grid.map((row) =>
        row.map((node) => {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
  
          if (node.isStart || node.isFinish) {
            return node;
          }
  
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish" &&
            nodeClassName !== "node node-wall"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
  
            // Reset node properties
            node.isVisited = false;
            node.isWall = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(FINISH_NODE_ROW - node.row) +
              Math.abs(FINISH_NODE_COL - node.col);
            node.previousNode = null; // Reset the previousNode property
          } else if (node.isStart) {
            // Reset start node properties
            node.isVisited = false;
            node.distance = 0;
            node.previousNode = null;
          }
          
          return node;
        })
      );
  
      setGrid(newGrid);
    }
  };
  
  
  

  const animateDijkstra = () => {
    return new Promise(resolve => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            resolve({ visitedNodesInOrder, nodesInShortestPathOrder });
          }, 10 * i);
        } else {
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const element = document.getElementById(`node-${node.row}-${node.col}`);
            if (element) {
              if (!node.isFinish && !node.isStart)
                element.className = 'node node-visited';
            }
          }, 10 * i);
        }
      }
    });
  };

  const animateShortestPath = nodesInShortestPathOrder => {
    for (let i = 1; i < nodesInShortestPathOrder.length-1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  };


  return (
    <>
      <button onClick={visualizeDijkstra}>Visualize Dijkstra's Algorithm</button>
      <button onClick={clearWall}>Clear Walls</button>
      <button onClick={clearGrid} >Clear Grid</button>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall} = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default PathfindingVisualizer;

const getInitialGrid = (startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) => {
  // Memoization cache
  const gridCache = getInitialGrid.cache || (getInitialGrid.cache = new Map());
  const cachedGrid = gridCache.get(finishNodeRow);
  if (cachedGrid) return cachedGrid;

  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(
        createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol)
      );
    }
    grid.push(currentRow);
  }

  return grid;
};


const createNode = (col, row, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    distanceToFinishNode:
              Math.abs(FINISH_NODE_ROW - row) +
              Math.abs(FINISH_NODE_COL - col),
    isVisited: false,
    isWall: false,
    previousNode: null,
    isNode: true,
  };
};

//
const getNewGridWithWallToggled = (grid, row, col) => {

  const newGrid = [...grid];
  const node = newGrid[row][col];
  const newNode = { ...node, isWall: !node.isWall };
  newGrid[row][col] = newNode;
  return newGrid;
};
