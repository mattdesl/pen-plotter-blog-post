import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const rect = (x, y, size) => {
    const path = [
      [ x - size, y - size ],
      [ x + size, y - size ],
      [ x + size, y + size ],
      [ x - size, y + size ]
    ];
    path.push(path[0]); // close the path
    return path;
  };

  const cx = width / 2;
  const cy = height / 2;

  const lines = [];
  for (let i = 0; i < 12; i++) {
    const size = i + 1;
    const margin = 0.25;
    lines.push(rect(cx, cy, size));
    lines.push(rect(cx, cy, size + margin));
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
