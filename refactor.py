import sys

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Make Workspace2D.jsx
ws2_content = content.replace('export default function App() {', 'export default function Workspace2D() {')
ws2_content = ws2_content.replace('  const [activeTab, setActiveTab] = useState(\'2D\');\n\n', '')

start_str = '    <div className="main-wrapper">\n      <div className="tabs-header">'
start_idx = ws2_content.find(start_str)

end_str = "      {activeTab === '2D' ? (\n"
end_idx = ws2_content.find(end_str) + len(end_str)

if start_idx != -1 and end_idx != -1:
    ws2_content = ws2_content[:start_idx] + ws2_content[end_idx:]

end_remove = """      ) : (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>3D Workspace</h2>
            <p>A blank screen, ready for the next dimension.</p>
          </div>
        </div>
      )}
    </div>"""

ws2_content = ws2_content.replace(end_remove, '')

with open('src/Workspace2D.jsx', 'w') as f:
    f.write(ws2_content)

print('Workspace2D.jsx created')
