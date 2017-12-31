import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat } from 'penplot/util/random';
import newArray from 'new-array';
import clustering from 'density-clustering';
import convexHull from 'convex-hull';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  // A large point count will produce more defined results
  const pointCount = 50000;
  let points = newArray(pointCount).map(() => {
    const margin = 2;
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });

  // We will add to this over time
  const lines = [];

  // The N value for k-means clustering
  // Lower values will produce bigger chunks
  const clusterCount = 3;

  // Run our generative algorithm at 30 FPS
  setInterval(update, 1000 / 30);

  return {
    draw,
    print,
    background: 'white',
    animate: true // start a render loop
  };

  function update () {
    // Not enough points in our data set
    if (points.length <= clusterCount) return;

    // k-means cluster our data
    const scan = new clustering.KMEANS();
    const clusters = scan.run(points, clusterCount)
      .filter(c => c.length >= 3);

    // Ensure we resulted in some clusters
    if (clusters.length === 0) return;

    // Sort clusters by density
    clusters.sort((a, b) => a.length - b.length);

    // Select the least dense cluster
    const cluster = clusters[0];
    const positions = cluster.map(i => points[i]);

    // Find the hull of the cluster
    const edges = convexHull(positions);

    // Ensure the hull is large enough
    if (edges.length <= 2) return;

    // Create a closed polyline from the hull
    let path = edges.map(c => positions[c[0]]);
    path.push(path[0]);

    // Add to total list of polylines
    lines.push(path);

    // Remove those points from our data set
    points = points.filter(p => !positions.includes(p));
  }

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.strokeStyle = debug ? 'blue' : 'black';
      context.stroke();
    });

    // Turn on debugging if you want to see the points
    if (debug) {
      points.forEach(p => {
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
