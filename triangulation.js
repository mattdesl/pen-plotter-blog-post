import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const pointCount = 6000;
  const positions = newArray(pointCount).map(() => {
    // Margin from print edge in centimeters
    const margin = 2;
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });
  const cells = triangulate(positions);

  const lines = cells.map(cell => {
    const triangle = cell.map(i => positions[i]);
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
