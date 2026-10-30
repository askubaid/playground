import React, { useState } from 'react';
import Workspace2D from './Workspace2D';
import Workspace3D from './Workspace3D';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('2D');

  return (
    <div className="main-wrapper">
      {/* IST Header */}
      <header className="app-header">
        <div className="header-left">
          <img
            src={`${import.meta.env.BASE_URL}ist-logo.svg`}
            alt="IST Logo"
            className="header-logo"
          />
          <div className="header-title-group">
            <h1 className="header-title">Homogeneous Transformation Playground</h1>
            <p className="header-subtitle">Institute of Space Technology, Islamabad</p>
          </div>
        </div>
        <div className="header-credits">
          <div><strong>Developed by:</strong> Ubaid Ur Rehman</div>
          <div>MS Scholar — Subject: Computer Vision</div>
          <div><strong>Supervised by:</strong> Dr. Benish Amin</div>
        </div>
      </header>

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
