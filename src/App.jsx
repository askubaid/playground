import React, { useState } from 'react';
import Workspace2D from './Workspace2D';
import Workspace3D from './Workspace3D';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('2D');

  return (
    <div className="main-wrapper">
      <div className="tabs-header">
        <button 
          className={`tab-button ${activeTab === '2D' ? 'active' : ''}`}
          onClick={() => setActiveTab('2D')}
        >
          2D
        </button>
        <button 
          className={`tab-button ${activeTab === '3D' ? 'active' : ''}`}
          onClick={() => setActiveTab('3D')}
        >
          3D
        </button>
      </div>

      {activeTab === '2D' ? <Workspace2D /> : <Workspace3D />}
    </div>
  );
}
