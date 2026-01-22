import React from 'react';
import CanvasBoard from './components/CanvasBoard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <div className="pixcollab-header">
        <h1 className="pixcollab-title">PIXCOLLAB</h1>
      </div>

      {/* Canvas */}
      <CanvasBoard />
    </div>
  );
}

export default App;
