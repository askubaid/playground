import sys

with open('src/Workspace2D.jsx', 'r') as f:
    content = f.read()

# Replace Component name
content = content.replace('Workspace2D', 'Workspace3D')

# Replace initial states
# hMatrix:
old_h = """  const [hMatrix, setHMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);"""
new_h = """  const [hMatrix, setHMatrix] = useState([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);"""
content = content.replace(old_h, new_h)

# xMatrix:
old_x = """  const [xMatrix, setXMatrix] = useState([
    [0],
    [0],
    [1]
  ]);"""
new_x = """  const [xMatrix, setXMatrix] = useState([
    [ 0,  1,  1,  0,  0,  1,  1,  0],
    [ 0,  0,  1,  1,  0,  0,  1,  1],
    [ 0,  0,  0,  0,  1,  1,  1,  1],
    [ 1,  1,  1,  1,  1,  1,  1,  1]
  ]);"""
content = content.replace(old_x, new_x)

# updateTransformation
old_upd = """  const updateTransformation = (deg, s_val) => {
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
  };"""
new_upd = """  const updateTransformation = (deg, s_val) => {
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    const newH = [...hMatrix];
    newH[0] = [...newH[0]];
    newH[1] = [...newH[1]];
    newH[2] = [...newH[2]];
    newH[3] = [...newH[3]];
    
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
  };"""
content = content.replace(old_upd, new_upd)

# resetHMatrix
old_reset = """  const resetHMatrix = () => {
    setTheta(0);
    setScaleVal(1);
    setHMatrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]);
  };"""
new_reset = """  const resetHMatrix = () => {
    setTheta(0);
    setScaleVal(1);
    setHMatrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  };"""
content = content.replace(old_reset, new_reset)

# add/remove XColumn
old_add = """  const addXColumn = () => {
    const newX = [...xMatrix];
    newX[0] = [...newX[0], 0];
    newX[1] = [...newX[1], 0];
    newX[2] = [...newX[2], 1];
    setXMatrix(newX);
  };"""
new_add = """  const addXColumn = () => {
    const newX = [...xMatrix];
    newX[0] = [...newX[0], 0];
    newX[1] = [...newX[1], 0];
    newX[2] = [...newX[2], 0];
    newX[3] = [...newX[3], 1];
    setXMatrix(newX);
  };"""
content = content.replace(old_add, new_add)

old_rem = """  const removeXColumn = () => {
    if (xMatrix[0].length <= 1) return;
    const newX = [...xMatrix];
    newX[0] = newX[0].slice(0, -1);
    newX[1] = newX[1].slice(0, -1);
    newX[2] = newX[2].slice(0, -1);
    setXMatrix(newX);
  };"""
new_rem = """  const removeXColumn = () => {
    if (xMatrix[0].length <= 1) return;
    const newX = [...xMatrix];
    newX[0] = newX[0].slice(0, -1);
    newX[1] = newX[1].slice(0, -1);
    newX[2] = newX[2].slice(0, -1);
    newX[3] = newX[3].slice(0, -1);
    setXMatrix(newX);
  };"""
content = content.replace(old_rem, new_rem)

# getPointsFromMatrix -> getPointsFromMatrix3D
helpers = """// Convert homogenous 4D matrix to array of 3D projected points
const getPointsFromMatrix3D = (matrix) => {
  const points = [];
  const cols = matrix[0].length;
  const angle = Math.PI / 6;
  for (let j = 0; j < cols; j++) {
    const w = matrix[3][j] === 0 ? 1 : matrix[3][j];
    const x = matrix[0][j] / w;
    const y = matrix[1][j] / w;
    const z = matrix[2][j] / w;
    const screenX = (x - z) * Math.cos(angle);
    const screenY = y - (x + z) * Math.sin(angle);
    points.push({ x: screenX, y: screenY });
  }
  return points;
};
"""
# replace the getPointsFromMatrix usage
content = content.replace('getPointsFromMatrix(xMatrix)', 'getPointsFromMatrix3D(xMatrix)')
content = content.replace('getPointsFromMatrix(hxMatrix)', 'getPointsFromMatrix3D(hxMatrix)')

# append the new helper before the component
content = content.replace('export default function Workspace3D() {', helpers + '\nexport default function Workspace3D() {')

# Left panel text modifications
content = content.replace('Updates H11, H12, H21, H22 dynamically', 'Updates H11, H13, H31, H33 dynamically (Y-Axis)')

# X Matrix row labels
old_x_label = "{r === 0 ? 'x' : r === 1 ? 'y' : 'w'}"
new_x_label = "{r === 0 ? 'x' : r === 1 ? 'y' : r === 2 ? 'z' : 'w'}"
content = content.replace(old_x_label, new_x_label)

old_hx_label = '{r === 0 ? "x\'" : r === 1 ? "y\'" : "w\'"}'
new_hx_label = '{r === 0 ? "x\'" : r === 1 ? "y\'" : r === 2 ? "z\'" : "w\'"}'
content = content.replace(old_hx_label, new_hx_label)

# H Matrix grid css
content = content.replace('className="matrix-h-grid"', 'className="matrix-h-grid matrix-h-grid-4"')

with open('src/Workspace3D.jsx', 'w') as f:
    f.write(content)

print('Workspace3D.jsx created')
