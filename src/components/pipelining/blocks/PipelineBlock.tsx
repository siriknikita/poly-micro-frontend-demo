import React from 'react';
import { BlockInstance } from '@/types/pipeline';

interface PipelineBlockProps {
  block: BlockInstance;
  isSimulating: boolean;
  onMove: (instanceId: string, newPosition: { x: number; y: number }) => void;
  onClick: () => void;
}

export const PipelineBlock: React.FC<PipelineBlockProps> = ({
  block,
  isSimulating,
  onMove,
  onClick
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const IconComponent = block.icon;

  const handleDragStart = (e: React.DragEvent) => {
    if (isSimulating) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return;
    
    const parent = (e.target as HTMLElement).parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid (40px grid size)
    const snapToGrid = (coord: number) => Math.round(coord / 40) * 40;
    
    onMove(block.instanceId, {
      x: snapToGrid(x),
      y: snapToGrid(y)
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable={!isSimulating}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`absolute p-4 rounded-lg border-2 bg-white dark:bg-gray-800 shadow-lg
        ${isDragging ? 'opacity-50' : ''}
        ${isSimulating ? 'cursor-not-allowed' : 'cursor-move hover:border-indigo-500 dark:hover:border-indigo-400'}
        border-gray-200 dark:border-gray-700`}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: '200px'
      }}
    >
      <div className="flex items-center space-x-3">
        <IconComponent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {block.name}
          </h4>
          {Object.entries(block.config).length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {Object.entries(block.config).map(([key, value]) => (
                <div key={key} className="truncate">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
