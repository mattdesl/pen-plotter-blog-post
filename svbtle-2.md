# Developing an Algorithm from the Ground Up

Now let's try something different and develop an algorithm that runs over time. I'm calling this algorithm "Patchwork," although I won't claim to have invented it since I'm sure many before me have discovered the same algorithm.

The algorithm we will try to implement works like so:

1. Start with a set of *N* initial points.
2. Select a cluster of points and draw the [convex hull](https://en.wikipedia.org/wiki/Convex_hull) that surrounds all of them.
3. Remove the points contained by the convex hull from our data set.
4. Repeat the process from step 2.

The "convex hull" is a convex polygon that encapsulates a set of points; it's a bit like if we hammered nails down at each point, and then tied a string around them to create a closed shape.

To select a cluster, we will use [k-means](https://en.wikipedia.org/wiki/K-means_clustering) to partition the data into N clusters, and then select whichever cluster has the least amount of points. There are likely many ways you can randomly select clusters, perhaps more optimally than with k-means.

Install the required libraries first, and then generate a new plot:

```sh
# install dependencies
npm install density-clustering convex-hull

# generate a new plot
penplot patchwork.js --write --open
```

Now, let's begin by adding the random points back in and stubbing out a `step` function for our algorithm. We also need to turn `animate` to true, so that `penplot` will start a render loop instead of just drawing one frame.

```js
// ...

import { PaperSize, Orientation } from 'penplot';
import { randomFloat } from 'penplot/util/random';
import newArray from 'new-array';
import clustering from 'density-clustering';
import convexHull from 'convex-hull';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  // A large point count will produce more defined results
  const pointCount = 500;
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
  setInterval(step, 1000 / 30);

  return {
    draw,
    print,
    background: 'white',
    animate: true // start a render loop
  };

  function step () {
    // Our generative algorithm...
  }

  // ... draw / print functions ...
}
```

You won't see anything if you run the code, that's because our `lines` array is empty. However, we can already visualize our random points:

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code7.png?token=ABUdgyEnUBNJh1IJWvZgMlPYu-4xtnlbks5aUk2MwA%3D%3D)

Let's make it so that each time `step` runs, it adds a new polyline to the array. The next step in our algorithm is to select a cluster of points from our data set. We will use the `density-clustering` module for this, filtering the result to ensure we select a cluster with at least 3 points. Then, we sort by ascending density to select the cluster with the least number of points (i.e. the first).

Like with `triangulate()`, the density clustering returns a list of *indices*, not points, so we need to map the indices to their corresponding positions.

```js
function step () {
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

  ...
}
```

Now that we have a cluster, we can find the convex hull of its points, and removes those points from our original data set. The `convexHull` module returns a list of `edges` (i.e. line segments), and by taking the first vertex in each edge, we can form a closed polyline (polygon) for that cluster.

```js
function step () {
  // Select a cluster
  ...

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
```

Below, we can see what it looks like when we find the convex hull of the set of blue points.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code8.png?token=ABUdgzqhvwNmzJ8wH6ipKvsvIYfVnXtaks5aUk36wA%3D%3D)

Once the points from that cluster are removed from the data set, we are left with a polygon in their place.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code9.png?token=ABUdgz-w5ziDsCn84KudcFCya_0g_ZXDks5aUk4ewA%3D%3D)

As we continue stepping the algorithm forward, we end up with more polygons filling in the empty space.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code13.png?token=ABUdg1p9nbXHb5Ifo8t5tYSzSj3pYTwqks5aUk4twA%3D%3D)

Until eventually the algorithm converges, and we can find no more suitable clusters.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code11.png?token=ABUdg8DlRboruIU_C_mXo_QsplZgK1Roks5aUk42wA%3D%3D)

Like in the triangulation example, let's increase our `pointCount` to get a more interesting output. With a high number, like 50,000 points, we will get more detail and smoother polygons.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/code12.png?token=ABUdg47FdYtZfpNlVXKRRaMl_CyTfAxsks5aUk5AwA%3D%3D)

<sup>✏️ See [here](https://google.com/) for the final source code of this print.</sup>

The real beauty in this algorithm comes from recursing it; after it converges, you can select a new polygon, fill it with points, and re-run the algorithm from step 2. After many iterations, you can end up with incredibly detailed patterns. 

Below are a few other examples after spending an evening refining and tweaking the algorithm. These particular outputs use Canvas2D `fill()`, thus aren't suitable for a pen plotter.

![code](https://raw.githubusercontent.com/mattdesl/penplotter-example/master/images/canvas-all.jpg?token=ABUdgxskFG_Xt85O4rCcPBv2nPZxTxC5ks5aUk6uwA%3D%3D)

The "Patchwork" algorithm can also be extended to 3D, potentially for use in parametric modelling. However, that's a subject for another blog post.