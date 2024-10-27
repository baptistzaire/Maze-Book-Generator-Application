import React from 'react';
import { Sliders, Grid, Palette, Move, Target } from 'lucide-react';
import { BookSettings } from '../types';

interface SidebarProps {
  settings: BookSettings;
  onSettingsChange: (settings: BookSettings) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (key: keyof BookSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      {/* Book Settings Section */}
      <section>
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4" />
          Book Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Size
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => handleChange('pageSize', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="8.5x11">Letter (8.5" x 11")</option>
              <option value="6x9">Trade (6" x 9")</option>
              <option value="5x8">Digest (5" x 8")</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin (mm)
            </label>
            <input
              type="number"
              value={settings.margin}
              onChange={(e) => handleChange('margin', parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              max="50"
            />
          </div>
        </div>
      </section>

      {/* Grid Settings Section */}
      <section>
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Grid className="w-4 h-4" />
          Grid Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grid Alignment
            </label>
            <select
              value={settings.gridAlignment}
              onChange={(e) => handleChange('gridAlignment', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="center">Center</option>
              <option value="top-left">Top Left</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {settings.gridAlignment === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Offset (px)
                </label>
                <input
                  type="number"
                  value={settings.gridOffsetX}
                  onChange={(e) => handleChange('gridOffsetX', parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Offset (px)
                </label>
                <input
                  type="number"
                  value={settings.gridOffsetY}
                  onChange={(e) => handleChange('gridOffsetY', parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cell Padding (px)
            </label>
            <input
              type="number"
              value={settings.cellPadding}
              onChange={(e) => handleChange('cellPadding', parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              max="10"
            />
          </div>
        </div>
      </section>

      {/* Wall Settings Section */}
      <section>
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Move className="w-4 h-4" />
          Wall Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wall Style
            </label>
            <select
              value={settings.wallStyle}
              onChange={(e) => handleChange('wallStyle', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wall Thickness
            </label>
            <input
              type="number"
              value={settings.wallThickness}
              onChange={(e) => handleChange('wallThickness', parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              max="5"
            />
          </div>
        </div>
      </section>

      {/* Start/End Points Section */}
      <section>
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Target className="w-4 h-4" />
          Start/End Points
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Point
            </label>
            <select
              value={settings.startPoint}
              onChange={(e) => handleChange('startPoint', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="top-left">Top Left</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {settings.startPoint === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start X
                </label>
                <input
                  type="number"
                  value={settings.customStartPoint.x}
                  onChange={(e) => handleChange('customStartPoint', { 
                    ...settings.customStartPoint, 
                    x: parseInt(e.target.value) 
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Y
                </label>
                <input
                  type="number"
                  value={settings.customStartPoint.y}
                  onChange={(e) => handleChange('customStartPoint', { 
                    ...settings.customStartPoint, 
                    y: parseInt(e.target.value) 
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Point
            </label>
            <select
              value={settings.endPoint}
              onChange={(e) => handleChange('endPoint', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="top-right">Top Right</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {settings.endPoint === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End X
                </label>
                <input
                  type="number"
                  value={settings.customEndPoint.x}
                  onChange={(e) => handleChange('customEndPoint', { 
                    ...settings.customEndPoint, 
                    x: parseInt(e.target.value) 
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Y
                </label>
                <input
                  type="number"
                  value={settings.customEndPoint.y}
                  onChange={(e) => handleChange('customEndPoint', { 
                    ...settings.customEndPoint, 
                    y: parseInt(e.target.value) 
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Appearance Section */}
      <section>
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4" />
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Color
            </label>
            <input
              type="color"
              value={settings.lineColor}
              onChange={(e) => handleChange('lineColor', e.target.value)}
              className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;