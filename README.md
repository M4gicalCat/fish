# FISH
## Production link
See this in production: [fish.pfaisand.fr](https://fish.pfaisand.fr)

This [YouTube video](https://www.youtube.com/watch?v=bqtqltqcQhw) inspired me to do this project from scratch

Fishes follow simple rules:
- They can't stop moving
- If they cross path with another fish, they turn to avoid that happening
- They can't turn too much at once
- Turning make them slow down otherwise they accelerate until a maximum speed is reached

# Installation

- Clone the repo:
```shell
git clone https://github.com/M4gicalCat/fish.git
```
- Serve the files and open the `index.html` in a web browser. Using [serve](https://www.npmjs.com/package/serve) is recommended, but right-click => open in browser should work as well.

# Settings
Have fun tweaking the params in `params.js`, you might get specific behaviours using different settings.


## Next steps
- try to steer towards other fishes AND towards where they're going to in order to add some randomness in the movement 
- collision detection
  - optimisation w/ a grid to see only near fishes/obstacles
- every connected people could be in real-time one next to another, fishes can disappear from one screen and appear on another
  - Everyone screen would be an item in a world-wide grid
  - Have a `visibility``offset on each screen (I can see x pixels more so that the fish behaviour doesn't change *that* much as it changes screen)
  - Have a tick rate distinct from the fps rate to get a semi-perfect render on every device
  - /!\ not every screen has the same ratio
- 3D everything

## Minor evolutions
- support for multiple currents
- angle input as a circle instead of a line
- better button images

## Ideas
- mess with the invisible canvas and colors to detect multiple colors at once