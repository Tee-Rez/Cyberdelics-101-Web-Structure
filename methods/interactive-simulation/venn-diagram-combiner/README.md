# Venn Diagram Combiner Engine

A reusable interactive visualization engine for exploring concept merging through Venn diagrams.

## Features

- **Two Visualization Modes**:
  - **Combined**: Circles merge into one unified concept
  - **Vesica Piscis**: Circles overlap creating sacred geometry
- **Interactive Controls**: Drag circles or use slider to control merge progress
- **Particle Effects**: Animated particles orbiting concepts
- **Etymology Boxes**: Contextual information floating beside circles
- **Data-Driven**: Fully configurable via manifest.json

## Usage

### In a Lesson Manifest

```json
{
  "type": "interactive-simulation",
  "content": {
    "engine": "VennDiagramCombiner",
    "params": {
      "mode": "combined",
      "data": {
        "leftCircle": {
          "label": "CYBER",
          "color": "#00D9FF",
          "etymology": { /* ... */ }
        },
        "rightCircle": { /* ... */ },
        "merged": { /* ... */ }
      }
    }
  }
}
```

### Standalone Demo

Open `demo-venn-diagram.html` in a browser to see examples of both modes.

## Configuration Options

### Visualization Settings

- `mode`: "combined" or "vesica-piscis"
- `circleRadius`: Size of circles (default: 70)
- `maxDistance`: Maximum separation (default: 0.45)
- `particleCount`: Number of orbiting particles (default: 20)

### Data Structure

See `example-data.js` for complete data format examples.

## Dependencies

- D3.js v7
- method-base.js (Cyberdelics 101 framework)
- interactive-simulation.js (host framework)
- Google Fonts: Orbitron, Space Mono
