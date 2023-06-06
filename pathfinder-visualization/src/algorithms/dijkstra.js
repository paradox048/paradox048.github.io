export function dijkstra(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
  
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
  
    startNode.distance = 0;
  
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const nearestNode = unvisitedNodes.shift();
  
      if (nearestNode.isWall) continue;
  
      if (nearestNode.distance === Infinity) return visitedNodesInOrder;
  
      nearestNode.isVisited = true;
      visitedNodesInOrder.push(nearestNode);
  
      if (nearestNode === finishNode) return visitedNodesInOrder;
  
      updateUnvisitedNeighbors(nearestNode, grid);
    }
  
    return visitedNodesInOrder;
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function getAllNodes(grid) {
    return grid.flat();
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const { col, row } = node;
    const neighbors = [];
  
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  