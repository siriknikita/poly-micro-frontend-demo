import React, { useState, useRef } from 'react';
import { PipelineBlock as Block } from './blocks/PipelineBlock';
import { BlockConfigModal } from './BlockConfigModal';
import { PipelineBlock, BlockInstance } from '@/types/pipeline';

interface PipelineCanvasProps {
  showGrid: boolean;
  isSimulating: boolean;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  showGrid,
  isSimulating
}) => {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockInstance | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockData = JSON.parse(e.dataTransfer.getData('application/json')) as PipelineBlock;
    
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid (40px grid size)
    const snapToGrid = (coord: number) => Math.round(coord / 40) * 40;
    
    const newBlock: BlockInstance = {
      ...blockData,
      instanceId: `${blockData.id}_${Date.now()}`,
      position: { x: snapToGrid(x), y: snapToGrid(y) },
      config: {}
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
    setShowConfigModal(true);
  };

  const handleBlockMove = (instanceId: string, newPosition: { x: number; y: number }) => {
    setBlocks(prev => prev.map(block => 
      block.instanceId === instanceId
        ? { ...block, position: newPosition }
        : block
    ));
  };

  const handleConfigSave = (instanceId: string, config: Record<string, any>) => {
    setBlocks(prev => prev.map(block =>
      block.instanceId === instanceId
        ? { ...block, config }
        : block
    ));
    setShowConfigModal(false);
    setSelectedBlock(null);
  };

  const handleBlockClick = (block: BlockInstance) => {
    setSelectedBlock(block);
    setShowConfigModal(true);
  };

  return (
    <>
      <div 
        ref={canvasRef}
        className={`w-full h-full overflow-auto bg-white dark:bg-gray-800 relative
          ${showGrid ? 'bg-grid-light dark:bg-grid-dark' : ''}`}
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: showGrid 
            ? `linear-gradient(to right, rgb(243 244 246 / 0.1) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(243 244 246 / 0.1) 1px, transparent 1px)`
            : 'none'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="min-h-full min-w-full p-8">
          {blocks.map(block => (
            <Block
              key={block.instanceId}
              block={block}
              isSimulating={isSimulating}
              onMove={handleBlockMove}
              onClick={() => handleBlockClick(block)}
            />
          ))}
          
          {blocks.length === 0 && !isSimulating && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              Drag and drop blocks here to build your pipeline
            </div>
          )}
        </div>
      </div>

      {showConfigModal && selectedBlock && (
        <BlockConfigModal
          block={selectedBlock}
          onSave={handleConfigSave}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedBlock(null);
          }}
        />
      )}
    </>
  );
};
