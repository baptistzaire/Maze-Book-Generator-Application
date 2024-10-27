import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { 
  Pencil, Square, Circle, Type, Image as ImageIcon, 
  Eraser, Move, Layers, Palette, Sliders 
} from 'lucide-react';

interface CanvasEditorProps {
  width: number;
  height: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeMode, setActiveMode] = useState<string>('select');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        isDrawingMode: false
      });

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [width, height]);

  const setMode = (mode: string) => {
    if (!canvas) return;

    setActiveMode(mode);
    canvas.isDrawingMode = mode === 'draw';

    if (mode === 'draw') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = brushColor;
    }
  };

  const addShape = (type: 'rect' | 'circle') => {
    if (!canvas) return;

    const options = {
      left: 100,
      top: 100,
      fill: brushColor,
      opacity,
      width: 100,
      height: type === 'rect' ? 100 : undefined,
      radius: type === 'circle' ? 50 : undefined
    };

    const shape = type === 'rect' 
      ? new fabric.Rect(options)
      : new fabric.Circle(options);

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fill: brushColor,
      opacity
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;

      fabric.Image.fromURL(event.target.result.toString(), (img) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };

  const tools = [
    { icon: <Move />, mode: 'select', label: 'Select' },
    { icon: <Pencil />, mode: 'draw', label: 'Draw' },
    { icon: <Square />, mode: 'rect', label: 'Rectangle' },
    { icon: <Circle />, mode: 'circle', label: 'Circle' },
    { icon: <Type />, mode: 'text', label: 'Text' },
    { icon: <ImageIcon />, mode: 'image', label: 'Image' },
    { icon: <Eraser />, mode: 'eraser', label: 'Eraser' }
  ];

  return (
    <div className="flex">
      {/* Tools Panel */}
      <div className="w-16 bg-white border-r border-gray-200 p-2 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.mode}
            onClick={() => {
              if (tool.mode === 'rect') addShape('rect');
              else if (tool.mode === 'circle') addShape('circle');
              else if (tool.mode === 'text') addText();
              else if (tool.mode === 'image') {
                document.getElementById('imageUpload')?.click();
              } else setMode(tool.mode);
            }}
            className={`w-full p-2 rounded ${
              activeMode === tool.mode ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Palette className="w-4 h-4 inline mr-1" /> Color
          </label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => {
              setBrushColor(e.target.value);
              if (canvas) {
                canvas.freeDrawingBrush.color = e.target.value;
              }
            }}
            className="w-full h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Sliders className="w-4 h-4 inline mr-1" /> Size
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setBrushSize(size);
              if (canvas) {
                canvas.freeDrawingBrush.width = size;
              }
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Layers className="w-4 h-4 inline mr-1" /> Opacity
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={clearCanvas}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Canvas
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-50 p-4">
        <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
      </div>
    </div>
  );
};

export default CanvasEditor;