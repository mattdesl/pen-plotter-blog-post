// Import some penplot utilities
import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { clipPolylinesToBox } from 'penplot/util/geom';

// Export orientation of your print
export const orientation = Orientation.LANDSCAPE;

// Export [ width, height ] dimensions in centimetres
export const dimensions = PaperSize.LETTER;

// The plot function takes care of setup & rendering
export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  let lines = [];

  // ... Your algorithmic code usually goes here. ...
  // Draw some circles expanding outward
  const steps = 5;
  const count = 20;
  const spacing = 1;
  const radius = 2;
  for (let j = 0; j < count; j++) {
    const r = radius + j * spacing;
    const circle = [];
    for (let i = 0; i < steps; i++) {
      const t = i / Math.max(1, steps - 1);
      const angle = Math.PI * 2 * t;
      circle.push([
        width / 2 + Math.cos(angle) * r,
        height / 2 + Math.sin(angle) * r
      ]);
    }
    lines.push(circle);
  }

  // Clip all the lines to a margin
  const margin = 1.5;
  const box = [ margin, margin, width - margin, height - margin ];
  lines = clipPolylinesToBox(lines, box);

  // Return some settings for penplot
  return {
    draw,
    print,
    background: 'white',
    animate: false,
    clear: true
  };

  // For the browser and PNG export, draw the plot to a Canvas2D context
  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  // For SVG export, returns a string that makes up the SVG file contents
  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
