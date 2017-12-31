# pen-plotter-blog-post

This repo contains the source code and images for a two-part blog post, _"Pen Plotter Art & Algorithms."_ You can read the posts on my blog:

- [Pen Plotter Art & Algorithms, Part 1](https://mattdesl.svbtle.com/pen-plotter-1)
- [Pen Plotter Art & Algorithms, Part 2](https://mattdesl.svbtle.com/pen-plotter-2)

## Usage

If you want to run from source, make sure you have `node@8.4.x` and `npm@5.3.x` or higher. Then clone this repo, `cd` into it, and `npm install` to grab the dependencies.

Once the dependencies are installed, you can run one of the demos:

```sh
# the default penplot print template
npx penplot code/test-print.js --open

# simple concentric squares
npx penplot code/squares.js --open

# Delaunay triangulation example
npx penplot code/triangulation.js --open

# Patchwork (fractures with convex hull + k-means clustering)
npx penplot code/patchwork.js --open
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/pen-plotter-blog-post/blob/master/LICENSE.md) for details.