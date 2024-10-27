import { BookSettings } from '../types';

export interface Cell {
  x: number;
  y: number;
  walls: boolean[];
  visited: boolean;
  inPath: boolean;
  previous: Cell | null;
}

export interface MazeShape {
  isValid: (x: number, y: number, width: number, height: number) => boolean;
}

const shapes: Record<string, MazeShape> = {
  square: {
    isValid: () => true
  },
  circle: {
    isValid: (x, y, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      return dx * dx + dy * dy <= radius * radius;
    }
  },
  triangle: {
    isValid: (x, y, width, height) => {
      const h = height;
      const w = width;
      const normalizedX = (x - w / 2) / (w / 2);
      const normalizedY = (y - h) / h;
      return normalizedY >= -1 && normalizedY <= 0 && 
             Math.abs(normalizedX) <= 1 + normalizedY;
    }
  },
  star: {
    isValid: (x, y, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const r = Math.sqrt(dx * dx + dy * dy);
      const theta = Math.atan2(dy, dx);
      const spikes = 5;
      const radius = Math.min(width, height) / 2;
      const minR = radius * 0.5;
      const maxR = radius;
      const angle = ((theta * spikes) / Math.PI) % 2;
      const shapeRadius = angle < 1 ? maxR : minR;
      return r <= shapeRadius;
    }
  }
};

export class MazeGenerator {
  private width: number;
  private height: number;
  private grid: Cell[][];
  private stack: Cell[];
  private shape: MazeShape;
  private settings: BookSettings;

  constructor(width: number, height: number, settings: BookSettings) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.stack = [];
    this.settings = settings;
    this.shape = shapes[settings.shape || 'square'];
    this.initializeGrid();
  }

  private initializeGrid() {
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        if (this.isValidCell(x, y)) {
          this.grid[y][x] = {
            x,
            y,
            walls: [true, true, true, true], // top, right, bottom, left
            visited: false,
            inPath: false,
            previous: null
          };
        } else {
          this.grid[y][x] = null;
        }
      }
    }
  }

  private isValidCell(x: number, y: number): boolean {
    return this.shape.isValid(x, y, this.width, this.height);
  }

  private getUnvisitedNeighbors(cell: Cell): { cell: Cell; wall: number }[] {
    const neighbors: { cell: Cell; wall: number }[] = [];
    const { x, y } = cell;
    const directions = [
      [0, -1, 0], // top
      [1, 0, 1],  // right
      [0, 1, 2],  // bottom
      [-1, 0, 3]  // left
    ];

    for (const [dx, dy, wall] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newY >= 0 && newY < this.height &&
        newX >= 0 && newX < this.width &&
        this.grid[newY][newX] &&
        !this.grid[newY][newX].visited
      ) {
        neighbors.push({ cell: this.grid[newY][newX], wall });
      }
    }

    return neighbors;
  }

  private removeWalls(current: Cell, next: Cell, wall: number) {
    current.walls[wall] = false;
    next.walls[(wall + 2) % 4] = false;
  }

  generate(): Cell[][] {
    const startCell = this.findValidStartCell();
    if (!startCell) return this.grid;

    startCell.visited = true;
    this.stack.push(startCell);

    while (this.stack.length > 0) {
      const current = this.stack[this.stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length === 0) {
        this.stack.pop();
      } else {
        const { cell: next, wall } = neighbors[Math.floor(Math.random() * neighbors.length)];
        next.visited = true;
        this.removeWalls(current, next, wall);
        this.stack.push(next);
      }
    }

    if (this.settings.mazeType === 'imperfect') {
      this.addImperfections();
    }

    return this.grid;
  }

  private findValidStartCell(): Cell | null {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x]) {
          return this.grid[y][x];
        }
      }
    }
    return null;
  }

  private addImperfections() {
    const imperfectionCount = Math.floor((this.width * this.height) * 0.1);
    
    for (let i = 0; i < imperfectionCount; i++) {
      const y = Math.floor(Math.random() * this.height);
      const x = Math.floor(Math.random() * this.width);
      
      if (this.grid[y][x]) {
        const wall = Math.floor(Math.random() * 4);
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        const [dx, dy] = directions[wall];
        const newX = x + dx;
        const newY = y + dy;
        
        if (
          newY >= 0 && newY < this.height &&
          newX >= 0 && newX < this.width &&
          this.grid[newY][newX]
        ) {
          this.grid[y][x].walls[wall] = false;
          this.grid[newY][newX].walls[(wall + 2) % 4] = false;
        }
      }
    }
  }

  solveMaze(startPoint: { x: number; y: number }, endPoint: { x: number; y: number }): boolean {
    if (!this.grid[startPoint.y][startPoint.x] || !this.grid[endPoint.y][endPoint.x]) {
      return false;
    }

    const start = this.grid[startPoint.y][startPoint.x];
    const end = this.grid[endPoint.y][endPoint.x];
    const stack: Cell[] = [start];
    
    // Reset path state
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell) {
          cell.visited = false;
          cell.inPath = false;
          cell.previous = null;
        }
      }
    }

    start.visited = true;

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (current === end) {
        // Trace back the path
        let pathCell: Cell | null = current;
        while (pathCell) {
          pathCell.inPath = true;
          pathCell = pathCell.previous;
        }
        return true;
      }

      const neighbors = this.getAccessibleNeighbors(current);
      for (const neighbor of neighbors) {
        if (!neighbor.visited) {
          neighbor.visited = true;
          neighbor.previous = current;
          stack.push(neighbor);
        }
      }
    }

    return false;
  }

  private getAccessibleNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;
    const directions = [
      [0, -1, 0], // top
      [1, 0, 1],  // right
      [0, 1, 2],  // bottom
      [-1, 0, 3]  // left
    ];

    for (const [dx, dy, wall] of directions) {
      if (!cell.walls[wall]) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newY >= 0 && newY < this.height &&
          newX >= 0 && newX < this.width &&
          this.grid[newY][newX]
        ) {
          neighbors.push(this.grid[newY][newX]);
        }
      }
    }

    return neighbors;
  }
}