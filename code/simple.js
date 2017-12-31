import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  // Function to create a square
  const square = (x, y, size) => {
    // Define rectangle vertices
    const path = [
      [ x - size, y - size ],
      [ x + size, y - size ],
      [ x + size, y + size ],
      [ x - size, y + size ]
    ];
    // Close the path
    path.push(path[0]);
    return path;
  };

  // Get centre of the print
  const cx = width / 2;
  const cy = height / 2;

  // Create 12 concentric pairs of squares
  const lines = [];
  for (let i = 0; i < 12; i++) {
    const size = i + 1;
    const margin = 0.25;
    lines.push(square(cx, cy, size));
    lines.push(square(cx, cy, size + margin));
  }

  return {
    draw,
    print,
    background: 'white'
  };

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
