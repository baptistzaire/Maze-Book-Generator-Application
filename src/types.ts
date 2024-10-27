export interface BookSettings {
  pageSize: string;
  mazeCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  showSolution: boolean;
  lineColor: string;
  backgroundColor: string;
  margin: number;
  wallStyle: 'solid' | 'dashed' | 'dotted';
  wallThickness: number;
  gridAlignment: 'center' | 'top-left' | 'custom';
  gridOffsetX: number;
  gridOffsetY: number;
  cellPadding: number;
  startPoint: 'top-left' | 'bottom-left' | 'custom';
  endPoint: 'bottom-right' | 'top-right' | 'custom';
  customStartPoint: { x: number; y: number };
  customEndPoint: { x: number; y: number };
  shape: 'square' | 'circle' | 'triangle' | 'star' | 'custom';
  mazeType: 'perfect' | 'imperfect';
}

export interface GeneratedMaze {
  grid: import('./utils/mazeGenerator').Cell[][];
  width: number;
  height: number;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}