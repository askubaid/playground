# Homogeneous Transformation Playground

An interactive web application for visualizing and understanding **homogeneous transformations** in both 2D and 3D space. Built as a learning tool for Computer Vision concepts.

🔗 **Live Demo:** [https://askubaid.github.io/playground](https://askubaid.github.io/playground)

---

## About

This application provides a visual, hands-on approach to learning homogeneous coordinate transformations — a foundational concept in Computer Vision, Robotics, and Computer Graphics. Users can interactively manipulate transformation matrices and observe their effects on geometric shapes in real time.

### Features

- **2D Transformations** — Define a shape using homogeneous coordinates (x, y, w) and apply a 3×3 transformation matrix (H) with interactive sliders and knobs for rotation, scaling, and translation.
- **3D Transformations** — Extend to 3D with a 4×4 transformation matrix supporting Euler angle rotations (Alpha, Beta, Gamma), scaling, and translation, with isometric projection visualization.
- **Real-Time Visualization** — See original and transformed shapes side-by-side on an interactive SVG canvas with panning support.
- **Matrix Editor** — Directly edit transformation matrix values or use intuitive controls (rotation knobs, scale sliders).
- **Dynamic Shape Building** — Add/remove points to build custom shapes.
- **Transformed Output Display** — View the resulting transformed matrix (X') values in real time.

---

## Technology Stack

- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **Lucide React** — Icon library
- **SVG** — Canvas rendering
- **GitHub Pages** — Deployment

---

## Developed By

**Ubaid Ur Rehman**  
MS Scholar — Subject: Computer Vision  
Institute of Space Technology (IST), Islamabad

### Supervised By

**Dr. Benish Amin**  
Institute of Space Technology (IST), Islamabad

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/askubaid/playground.git
cd playground

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## License

This project is developed for academic purposes at the Institute of Space Technology, Islamabad.
