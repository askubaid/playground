import React, { useState, useEffect, useRef } from 'react';
import { Settings2, Plus, Minus, Grid, Move, RotateCcw } from 'lucide-react';
import './index.css';

// Knob Component
const Knob = ({ value, onChange }) => {
  const knobRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent) => {
      if (!knobRef.current) return;
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      let mathAngle = Math.atan2(-dy, dx) * (180 / Math.PI);
      if (mathAngle < 0) mathAngle += 360; 
      onChange(Math.round(mathAngle));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={knobRef}
      onMouseDown={handleMouseDown}
      style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'rgba(0,0,0,0.05)', position: 'relative',
        cursor: 'grab', border: '1px solid var(--panel-border)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '50%', height: '2px', background: 'var(--accent)',
        transformOrigin: '0% 50%',
        transform: `translate(0, -50%) rotate(${-value}deg)`
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '12px', height: '12px', borderRadius: '50%',
        background: 'var(--bg-color)', border: '1px solid var(--accent)',
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
  );
};

// Helper for matrix multiplication
const multiplyMatrix = (A, B) => {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const result = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
};

// Convert homogenous matrix to array of 2D points
const getPointsFromMatrix = (matrix) => {
  const points = [];
  const cols = matrix[0].length;
  for (let j = 0; j < cols; j++) {
    const w = matrix[2][j] === 0 ? 1 : matrix[2][j]; // avoid div by zero safely
    points.push({
      x: matrix[0][j] / w,
      y: matrix[1][j] / w
    });
  }
  return points;
};

export default function Workspace2D() {
  // H Matrix state (3x3)
  const [hMatrix, setHMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);

  // X Matrix state (3xN)
  const [xMatrix, setXMatrix] = useState([
    [0],
    [0],
    [1]
  ]);

  const [drawX, setDrawX] = useState(true);
  const [drawHX, setDrawHX] = useState(true);
  const [showHXValues, setShowHXValues] = useState(true);

  // Viewport state for canvas
  const containerRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  // Panning state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Update viewport on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewport({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleHChange = (r, c, val) => {
    const newH = [...hMatrix];
    newH[r] = [...newH[r]];
    newH[r][c] = val;
    setHMatrix(newH);
  };

  const [theta, setTheta] = useState(0);
  const [scaleVal, setScaleVal] = useState(1);

  const updateTransformation = (deg, s_val) => {
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    const newH = [...hMatrix];
    newH[0] = [...newH[0]];
    newH[1] = [...newH[1]];
    
    newH[0][0] = (s_val * c).toFixed(3);
    newH[0][1] = (s_val * -s).toFixed(3);
    newH[1][0] = (s_val * s).toFixed(3);
    newH[1][1] = (s_val * c).toFixed(3);
    
    setHMatrix(newH);
  };

  const handleThetaChange = (val) => {
    const deg = parseFloat(val) || 0;
    setTheta(deg);
    updateTransformation(deg, scaleVal);
  };

  const handleScaleChange = (val) => {
    const s_val = parseFloat(val) || 0;
    setScaleVal(s_val);
    updateTransformation(theta, s_val);
  };

  const resetHMatrix = () => {
    setTheta(0);
    setScaleVal(1);
    setHMatrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]);
  };

  const handleXChange = (r, c, val) => {
    const newX = [...xMatrix];
    newX[r] = [...newX[r]];
    newX[r][c] = parseFloat(val) || 0;
    setXMatrix(newX);
  };

  const addXColumn = () => {
    const newX = [...xMatrix];
    newX[0] = [...newX[0], 0];
    newX[1] = [...newX[1], 0];
    newX[2] = [...newX[2], 1];
    setXMatrix(newX);
  };

  const removeXColumn = () => {
    if (xMatrix[0].length <= 1) return;
    const newX = [...xMatrix];
    newX[0] = newX[0].slice(0, -1);
    newX[1] = newX[1].slice(0, -1);
    newX[2] = newX[2].slice(0, -1);
    setXMatrix(newX);
  };

  // Derive points
  const xPoints = getPointsFromMatrix(xMatrix);
  const hxMatrix = multiplyMatrix(hMatrix, xMatrix);
  const hxPoints = getPointsFromMatrix(hxMatrix);

  // SVG parameters
  const scale = 50; // pixels per unit
  const cx = viewport.width / 2;
  const cy = viewport.height / 2;

  // Render SVG Path from points
  const createPath = (points) => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * scale} ${p.y * scale}`).join(' ');
  };

  // Grid lines generation
  const gridLines = [];
  const axisLabels = [];
  const startX = Math.floor(-(cx + offset.x) / scale) - 1;
  const endX = Math.ceil((viewport.width - (cx + offset.x)) / scale) + 1;
  const startY = Math.floor((cy + offset.y - viewport.height) / scale) - 1;
  const endY = Math.ceil((cy + offset.y) / scale) + 1;

  for (let i = startX; i <= endX; i++) {
    gridLines.push(<line key={`vx-${i}`} x1={i * scale} y1={startY * scale} x2={i * scale} y2={endY * scale} className="grid-line" />);
    if (i !== 0 && i % 5 === 0) {
      axisLabels.push(<text key={`xl-${i}`} x={i * scale + 4} y={16} className="label-text">{i}</text>);
    }
  }
  for (let i = startY; i <= endY; i++) {
    gridLines.push(<line key={`vy-${i}`} x1={startX * scale} y1={i * scale} x2={endX * scale} y2={i * scale} className="grid-line" />);
    if (i !== 0 && i % 5 === 0) {
      axisLabels.push(<text key={`yl-${i}`} x={4} y={-i * scale - 4} className="label-text">{i}</text>);
    }
  }

  return (
        <div className="app-container">
          {/* Left Panel */}
      <div className="left-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px' }}>
            <Move color="#8b5cf6" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Playground</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Homogeneous Transformations</p>
          </div>
        </div>

        {/* X Matrix Section */}
        <div className="panel-section">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Grid size={16} />
              Shape Matrix (X)
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={removeXColumn} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Minus size={16} />
              </button>
              <button onClick={addXColumn} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="matrix-x-container">
            {xMatrix.map((row, r) => (
              <div className="matrix-x-row" key={`x-row-${r}`}>
                <div style={{ width: '20px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  {r === 0 ? 'x' : r === 1 ? 'y' : 'w'}
                </div>
                {row.map((val, c) => (
                  <input
                    key={`x-${r}-${c}`}
                    className="matrix-x-input"
                    type="text"
                    value={val}
                    onChange={(e) => handleXChange(r, c, e.target.value)}
                  />
                ))}
              </div>
            ))}
          </div>
          <label className="checkbox-label" style={{ marginTop: '-4px' }}>
            <input
              type="checkbox"
              checked={drawX}
              onChange={(e) => setDrawX(e.target.checked)}
            />
            <div className="custom-checkbox"></div>
            Draw original shape (X)
            <div className="legend-color legend-x"></div>
          </label>
        </div>

        {/* H Matrix Section */}
        <div className="panel-section">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={16} />
              Transformation Matrix (H)
            </div>
            <button 
              onClick={resetHMatrix} 
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', textTransform: 'uppercase', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 8px var(--accent-glow)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
              title="Reset to Identity Matrix"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
          <div className="matrix-h-grid">
            {hMatrix.map((row, r) =>
              row.map((val, c) => (
                <div className="slider-group" key={`h-${r}-${c}`}>
                  <span className="slider-label">H{r+1}{c+1}</span>
                  <input
                    className="slider-value-input"
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleHChange(r, c, e.target.value)}
                  />
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={val}
                    onChange={(e) => handleHChange(r, c, e.target.value)}
                  />
                </div>
              ))
            )}
          </div>
          <label className="checkbox-label" style={{ marginTop: '-4px' }}>
            <input
              type="checkbox"
              checked={drawHX}
              onChange={(e) => setDrawHX(e.target.checked)}
            />
            <div className="custom-checkbox"></div>
            Draw transformed shape (H.X)
            <div className="legend-color legend-hx"></div>
          </label>
          <label className="checkbox-label" style={{ marginTop: '-4px' }}>
            <input
              type="checkbox"
              checked={showHXValues}
              onChange={(e) => setShowHXValues(e.target.checked)}
            />
            <div className="custom-checkbox"></div>
            Show transformed matrix values (X')
          </label>
        </div>

        {/* Transform Controls Section */}
        <div className="panel-section">
          <div className="section-title">
            <RotateCcw size={16} />
            Transform Controls
          </div>
          <div style={{ background: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Rotation */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', textAlign: 'center', color: 'var(--text-main)' }}>Rotation (Theta)</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <Knob value={theta} onChange={(val) => handleThetaChange(val)} />
                <input 
                  type="number" 
                  value={theta} 
                  onChange={(e) => handleThetaChange(e.target.value)} 
                  className="slider-value-input" 
                  style={{ width: '70px', fontSize: '14px', padding: '4px' }}
                />
              </div>
            </div>

            {/* Scale */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', textAlign: 'center', color: 'var(--text-main)' }}>Scale (s)</div>
              <div className="slider-group" style={{ flexDirection: 'row', border: 'none', background: 'none', padding: 0 }}>
                <input 
                  type="range" 
                  min="-5" 
                  max="5" 
                  step="0.1" 
                  value={scaleVal} 
                  onChange={(e) => handleScaleChange(e.target.value)} 
                />
                <input 
                  type="number" 
                  value={scaleVal} 
                  onChange={(e) => handleScaleChange(e.target.value)} 
                  className="slider-value-input" 
                  style={{ width: '60px', flexShrink: 0 }}
                />
              </div>
            </div>
            
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Updates H11, H12, H21, H22 dynamically
            </div>
          </div>
        </div>
      </div>

      {/* Right Canvas */}
      <div className="right-canvas" ref={containerRef}>
        {/* X' Matrix Overlay */}
        {showHXValues && (
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'var(--panel-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--panel-border)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: 'calc(100vw - 460px)',
            overflowX: 'auto'
          }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="legend-color legend-hx" style={{ margin: 0 }}></div>
            Transformed Matrix (X')
          </div>
          <div className="matrix-x-container" style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
            {hxMatrix.map((row, r) => (
              <div className="matrix-x-row" key={`hx-row-${r}`}>
                <div style={{ width: '20px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>
                  {r === 0 ? "x'" : r === 1 ? "y'" : "w'"}
                </div>
                {row.map((val, c) => {
                  let formattedVal = Number(val);
                  if (!Number.isInteger(formattedVal)) {
                    formattedVal = formattedVal.toFixed(2);
                  }
                  return (
                    <div
                      key={`hx-${r}-${c}`}
                      className="matrix-x-input"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.01)',
                        cursor: 'default',
                        userSelect: 'none'
                      }}
                    >
                      {formattedVal}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        )}

        <svg 
          className="graph-svg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Coordinate system transformation */}
          <g transform={`translate(${cx + offset.x}, ${cy + offset.y}) scale(1, -1)`}>
            
            {/* Grid */}
            <g>{gridLines}</g>
            
            {/* Axes */}
            <line x1={startX * scale} y1={0} x2={endX * scale} y2={0} className="axis-line" />
            <line x1={0} y1={startY * scale} x2={0} y2={endY * scale} className="axis-line" />
            
            {/* Axis labels mapped correctly for scale(1, -1) context */}
            <g transform="scale(1, -1)">
              {axisLabels}
            </g>

            {/* Original Shape (X) */}
            {drawX && xPoints.length > 0 && (
              <g>
                <path
                  className="shape-path"
                  d={createPath(xPoints)}
                  stroke="var(--shape-x)"
                />
                {xPoints.map((p, i) => (
                  <circle
                    key={`xp-${i}`}
                    cx={p.x * scale}
                    cy={p.y * scale}
                    r={5}
                    fill="var(--shape-x)"
                    className="shape-point"
                  />
                ))}
              </g>
            )}

            {/* Transformed Shape (H.X) */}
            {drawHX && hxPoints.length > 0 && (
              <g>
                <path
                  className="shape-path"
                  d={createPath(hxPoints)}
                  stroke="var(--shape-hx)"
                  strokeDasharray="8 4"
                />
                {hxPoints.map((p, i) => (
                  <circle
                    key={`hxp-${i}`}
                    cx={p.x * scale}
                    cy={p.y * scale}
                    r={6}
                    fill="var(--bg-color)"
                    stroke="var(--shape-hx)"
                    strokeWidth={2}
                    className="shape-point"
                  />
                ))}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>

  );
}
