import React, { useState } from 'react';
import { BookSettings } from '../types';
import Maze from './Maze';
import CanvasEditor from './CanvasEditor';
import { Pencil, Grid } from 'lucide-react';

interface EditorProps {
  settings: BookSettings;
  mazes: any[];
}

const Editor: React.FC<EditorProps> = ({ settings, mazes }) => {
  const [mode, setMode] = useState<'maze' | 'canvas'>('maze');

  const getPageDimensions = () => {
    switch (settings.pageSize) {
      case '8.5x11':
        return { width: '8.5in', height: '11in' };
      case '6x9':
        return { width: '6in', height: '9in' };
      case '5x8':
        return { width: '5in', height: '8in' };
      default:
        return { width: '8.5in', height: '11in' };
    }
  };

  const getGridTransform = () => {
    if (settings.gridAlignment === 'center') {
      return 'translate(-50%, -50%)';
    }
    if (settings.gridAlignment === 'custom') {
      return `translate(${settings.gridOffsetX}px, ${settings.gridOffsetY}px)`;
    }
    return 'translate(0, 0)';
  };

  const dimensions = getPageDimensions();
  const width = parseFloat(dimensions.width) * 96; // Convert inches to pixels
  const height = parseFloat(dimensions.height) * 96;

  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="bg-white border-b border-gray-200 p-2 flex space-x-2">
        <button
          onClick={() => setMode('maze')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            mode === 'maze' 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          Maze Editor
        </button>
        <button
          onClick={() => setMode('canvas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            mode === 'canvas' 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Pencil className="w-4 h-4" />
          Canvas Editor
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-8">
        <div
          id="maze-editor"
          className="bg-white shadow-xl transition-all relative mx-auto"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            margin: `${settings.margin}mm`,
            backgroundColor: settings.backgroundColor,
          }}
        >
          {mode === 'maze' ? (
            mazes.length > 0 ? (
              <div 
                className="w-full h-full grid grid-cols-1 gap-4"
                style={{
                  position: settings.gridAlignment !== 'top-left' ? 'absolute' : 'relative',
                  top: settings.gridAlignment === 'center' ? '50%' : '0',
                  left: settings.gridAlignment === 'center' ? '50%' : '0',
                  transform: getGridTransform(),
                  padding: '1rem'
                }}
              >
                {mazes.map((maze, index) => (
                  <div key={index} className="flex justify-center">
                    <Maze
                      grid={maze.grid}
                      cellSize={20}
                      lineColor={settings.lineColor}
                      wallStyle={settings.wallStyle}
                      wallThickness={settings.wallThickness}
                      cellPadding={settings.cellPadding}
                      startPoint={maze.startPoint}
                      endPoint={maze.endPoint}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Generate a maze to begin</p>
              </div>
            )
          ) : (
            <CanvasEditor width={width} height={height} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;