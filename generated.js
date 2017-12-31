import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';

// Export orientation of your print
export const orientation = Orientation.LANDSCAPE;

// Export [ width, height ] dimensions in centimetres
export const dimensions = PaperSize.SQUARE_POSTER;

// The plot function takes care of setup & rendering
export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const lines = [];
  // ... your algorithmic code, adding lines ...

  // Return some settings for penplot
  return {
    draw,
    print,
    background: 'white'
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
