import React from 'react';
import { Cell } from '../utils/mazeGenerator';

interface MazeProps {
  grid: Cell[][];
  cellSize: number;
  lineColor: string;
  wallStyle: 'solid' | 'dashed' | 'dotted';
  wallThickness: number;
  cellPadding: number;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

const Maze: React.FC<MazeProps> = ({
  grid,
  cellSize,
  lineColor,
  wallStyle,
  wallThickness,
  cellPadding,
  startPoint,
  endPoint,
}) => {
  const width = grid[0].length * cellSize;
  const height = grid.length * cellSize;
  
  const getDashArray = () => {
    switch (wallStyle) {
      case 'dashed':
        return '8,8';
      case 'dotted':
        return '2,4';
      default:
        return 'none';
    }
  };

  const effectiveCellSize = cellSize - cellPadding * 2;

  return (
    <svg 
      width={width} 
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="start-marker"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="green" />
        </marker>
        <marker
          id="end-marker"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="red" />
        </marker>
      </defs>

      {/* Grid background */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke={lineColor}
        strokeWidth="1"
        strokeDasharray={getDashArray()}
        opacity="0.1"
      />

      {/* Maze cells */}
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <g 
            key={`${x}-${y}`} 
            transform={`translate(${x * cellSize + cellPadding},${y * cellSize + cellPadding})`}
          >
            {/* Cell walls */}
            {cell.walls[0] && (
              <line
                x1="0"
                y1="0"
                x2={effectiveCellSize}
                y2="0"
                stroke={lineColor}
                strokeWidth={wallThickness}
                strokeDasharray={getDashArray()}
              />
            )}
            {cell.walls[1] && (
              <line
                x1={effectiveCellSize}
                y1="0"
                x2={effectiveCellSize}
                y2={effectiveCellSize}
                stroke={lineColor}
                strokeWidth={wallThickness}
                strokeDasharray={getDashArray()}
              />
            )}
            {cell.walls[2] && (
              <line
                x1="0"
                y1={effectiveCellSize}
                x2={effectiveCellSize}
                y2={effectiveCellSize}
                stroke={lineColor}
                strokeWidth={wallThickness}
                strokeDasharray={getDashArray()}
              />
            )}
            {cell.walls[3] && (
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={effectiveCellSize}
                stroke={lineColor}
                strokeWidth={wallThickness}
                strokeDasharray={getDashArray()}
              />
            )}
          </g>
        ))
      )}

      {/* Start and End markers */}
      <circle
        cx={startPoint.x * cellSize + cellSize / 2}
        cy={startPoint.y * cellSize + cellSize / 2}
        r={cellSize / 4}
        fill="green"
        opacity="0.6"
      />
      <circle
        cx={endPoint.x * cellSize + cellSize / 2}
        cy={endPoint.y * cellSize + cellSize / 2}
        r={cellSize / 4}
        fill="red"
        opacity="0.6"
      />
    </svg>
  );
};

export default Maze;