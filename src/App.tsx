import React, { useState } from 'react';
import { Settings, Download, BookOpen, Palette, Grid } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { BookSettings } from './types';
import { MazeGenerator } from './utils/mazeGenerator';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const [settings, setSettings] = useState<BookSettings>({
    pageSize: '8.5x11',
    mazeCount: 1,
    difficulty: 'medium',
    showSolution: false,
    lineColor: '#000000',
    backgroundColor: '#ffffff',
    margin: 20,
    wallStyle: 'solid',
    wallThickness: 2,
    gridAlignment: 'center',
    gridOffsetX: 0,
    gridOffsetY: 0,
    cellPadding: 2,
    startPoint: 'top-left',
    endPoint: 'bottom-right',
    customStartPoint: { x: 0, y: 0 },
    customEndPoint: { x: 0, y: 0 },
    shape: 'square',
    mazeType: 'perfect'
  });

  const [mazes, setMazes] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const getMazeDimensions = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { width: 10, height: 10 };
      case 'medium':
        return { width: 15, height: 15 };
      case 'hard':
        return { width: 20, height: 20 };
      default:
        return { width: 15, height: 15 };
    }
  };

  const generateMazes = () => {
    const newMazes = [];
    const { width, height } = getMazeDimensions(settings.difficulty);

    for (let i = 0; i < settings.mazeCount; i++) {
      const generator = new MazeGenerator(width, height, settings);
      const grid = generator.generate();
      const startPoint = getStartPoint(width, height);
      const endPoint = getEndPoint(width, height);
      
      if (settings.showSolution) {
        generator.solveMaze(startPoint, endPoint);
      }
      
      newMazes.push({ 
        grid, 
        width, 
        height,
        startPoint,
        endPoint
      });
    }

    setMazes(newMazes);
  };

  const getStartPoint = (width: number, height: number) => {
    switch (settings.startPoint) {
      case 'top-left':
        return { x: 0, y: 0 };
      case 'bottom-left':
        return { x: 0, y: height - 1 };
      case 'custom':
        return settings.customStartPoint;
      default:
        return { x: 0, y: 0 };
    }
  };

  const getEndPoint = (width: number, height: number) => {
    switch (settings.endPoint) {
      case 'bottom-right':
        return { x: width - 1, y: height - 1 };
      case 'top-right':
        return { x: width - 1, y: 0 };
      case 'custom':
        return settings.customEndPoint;
      default:
        return { x: width - 1, y: height - 1 };
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('maze-editor');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const dimensions = settings.pageSize.split('x').map(Number);
      const pdf = new jsPDF({
        orientation: dimensions[0] > dimensions[1] ? 'landscape' : 'portrait',
        unit: 'in',
        format: [dimensions[0], dimensions[1]]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions[0], dimensions[1]);
      pdf.save('maze-book.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Maze Book Creator
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create beautiful maze books with custom settings
          </p>
        </div>
        <Sidebar settings={settings} onSettingsChange={setSettings} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={generateMazes}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Grid className="w-4 h-4" />
              Generate Maze
            </button>
            <button 
              onClick={toggleSidebar}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                showSidebar 
                  ? 'border-indigo-300 text-indigo-600 hover:bg-indigo-50' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              {showSidebar ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <Editor settings={settings} mazes={mazes} />
        </div>
      </div>
    </div>
  );
}

export default App;