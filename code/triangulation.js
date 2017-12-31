import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const pointCount = 6000;
  const positions = newArray(pointCount).map(() => {
    // Margin from print edge in centimeters
    const margin = 2;
    // Return a random 2D point inset by this margin
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });
  const cells = triangulate(positions);

  const lines = cells.map(cell => {
    // Get vertices for this cell
    const triangle = cell.map(i => positions[i]);
    // Close the path
    triangle.push(triangle[0]);
    return triangle;
  });

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

    // Turn on debugging if you want to see the random points
    if (debug) {
      positions.forEach(p => {
        context.beginPath();
        context.arc(p[0], p[1], 0.2, 0, Math.PI * 2);
        context.strokeStyle = 'red';
        context.stroke();
      });
    }
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
