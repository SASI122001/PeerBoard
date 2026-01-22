import React from 'react';
import './Toolbar.css';

const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  clearCanvas,
}) => {
  return (
    <div className="toolbar">
      <button onClick={() => setTool('pen')} className={tool === 'pen' ? 'active' : ''}>✏️</button>
      <button onClick={() => setTool('line')} className={tool === 'line' ? 'active' : ''}>📏</button>
      <button onClick={() => setTool('rect')} className={tool === 'rect' ? 'active' : ''}>▭</button>
      <button onClick={() => setTool('circle')} className={tool === 'circle' ? 'active' : ''}>⚪</button>
      <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'active' : ''}>🧽</button>
      
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Color"
      />
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(e.target.value)}
        title="Brush size"
      />
      <button onClick={clearCanvas}>🧼</button>
    </div>
  );
};

export default Toolbar;
