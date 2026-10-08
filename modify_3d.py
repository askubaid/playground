import sys

with open('src/Workspace3D.jsx', 'r') as f:
    content = f.read()

# 1. Replace state
old_state = """  const [theta, setTheta] = useState(0);
  const [scaleVal, setScaleVal] = useState(1);

  const updateTransformation = (deg, s_val) => {
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    const newH = [...hMatrix];
    for(let i=0; i<4; i++) newH[i] = [...newH[i]];
    
    // Y-axis rotation
    newH[0][0] = (s_val * c).toFixed(3);
    newH[0][1] = 0;
    newH[0][2] = (s_val * s).toFixed(3);
    
    newH[1][0] = 0;
    newH[1][1] = s_val.toFixed(3);
    newH[1][2] = 0;
    
    newH[2][0] = (s_val * -s).toFixed(3);
    newH[2][1] = 0;
    newH[2][2] = (s_val * c).toFixed(3);
    
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
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  };"""

new_state = """  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [scaleVal, setScaleVal] = useState(1);

  const updateTransformation = (a, b, c, s_val) => {
    const radA = (a * Math.PI) / 180;
    const radB = (b * Math.PI) / 180;
    const radC = (c * Math.PI) / 180;
    
    const cosA = Math.cos(radA), sinA = Math.sin(radA);
    const cosB = Math.cos(radB), sinB = Math.sin(radB);
    const cosC = Math.cos(radC), sinC = Math.sin(radC);

    const newH = [...hMatrix];
    for(let i=0; i<4; i++) newH[i] = [...newH[i]];
    
    newH[0][0] = (s_val * (cosB * cosC)).toFixed(3);
    newH[0][1] = (s_val * (sinA * sinB * cosC - cosA * sinC)).toFixed(3);
    newH[0][2] = (s_val * (cosA * sinB * cosC + sinA * sinC)).toFixed(3);
    
    newH[1][0] = (s_val * (cosB * sinC)).toFixed(3);
    newH[1][1] = (s_val * (sinA * sinB * sinC + cosA * cosC)).toFixed(3);
    newH[1][2] = (s_val * (cosA * sinB * sinC - sinA * cosC)).toFixed(3);
    
    newH[2][0] = (s_val * (-sinB)).toFixed(3);
    newH[2][1] = (s_val * (sinA * cosB)).toFixed(3);
    newH[2][2] = (s_val * (cosA * cosB)).toFixed(3);
    
    setHMatrix(newH);
  };

  const handleAlphaChange = (val) => {
    const deg = parseFloat(val) || 0;
    setAlpha(deg);
    updateTransformation(deg, beta, gamma, scaleVal);
  };

  const handleBetaChange = (val) => {
    const deg = parseFloat(val) || 0;
    setBeta(deg);
    updateTransformation(alpha, deg, gamma, scaleVal);
  };

  const handleGammaChange = (val) => {
    const deg = parseFloat(val) || 0;
    setGamma(deg);
    updateTransformation(alpha, beta, deg, scaleVal);
  };

  const handleScaleChange = (val) => {
    const s_val = parseFloat(val) || 0;
    setScaleVal(s_val);
    updateTransformation(alpha, beta, gamma, s_val);
  };

  const resetHMatrix = () => {
    setAlpha(0);
    setBeta(0);
    setGamma(0);
    setScaleVal(1);
    setHMatrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  };"""

content = content.replace(old_state, new_state)


# 2. Replace UI
old_ui = """            {/* Rotation */}
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
            </div>"""

new_ui = """            {/* Rotations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', textAlign: 'center', color: 'var(--text-main)' }}>Alpha (X)</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Knob value={alpha} onChange={(val) => handleAlphaChange(val)} />
                  <input 
                    type="number" 
                    value={alpha} 
                    onChange={(e) => handleAlphaChange(e.target.value)} 
                    className="slider-value-input" 
                    style={{ width: '60px', fontSize: '12px', padding: '4px' }}
                  />
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', textAlign: 'center', color: 'var(--text-main)' }}>Beta (Y)</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Knob value={beta} onChange={(val) => handleBetaChange(val)} />
                  <input 
                    type="number" 
                    value={beta} 
                    onChange={(e) => handleBetaChange(e.target.value)} 
                    className="slider-value-input" 
                    style={{ width: '60px', fontSize: '12px', padding: '4px' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', textAlign: 'center', color: 'var(--text-main)' }}>Gamma (Z)</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Knob value={gamma} onChange={(val) => handleGammaChange(val)} />
                  <input 
                    type="number" 
                    value={gamma} 
                    onChange={(e) => handleGammaChange(e.target.value)} 
                    className="slider-value-input" 
                    style={{ width: '60px', fontSize: '12px', padding: '4px' }}
                  />
                </div>
              </div>
            </div>"""

content = content.replace(old_ui, new_ui)

content = content.replace('Updates H11, H13, H31, H33 dynamically (Y-Axis)', 'Updates H rotation & scale matrices dynamically')

with open('src/Workspace3D.jsx', 'w') as f:
    f.write(content)
print('Workspace3D updated')
