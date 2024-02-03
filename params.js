// Custom parameter to change most parameters at the same time
const DEPTH_PERCEPTION = 1;

export const PARAMS = {
	// maybe one day I'll try 3D ?
	DIMENSION: '2D',
	// number of fish
	NB_FISH: 200 / DEPTH_PERCEPTION,
	// Maximum angle a fish can turn for a single frame
	MAX_ROTATION: 2 * Math.PI / 200,
	// Maximum speed lost by a fish for a single frame
	SPEED_LOSS: .05 * DEPTH_PERCEPTION,
	// Speed constantly gained by a fish each frame
	ACCELERATION: .1 * DEPTH_PERCEPTION,
	// Minimum speed a fish can have
	MIN_SPEED: .5 * DEPTH_PERCEPTION,
	// Maximum speed a fish can have
	MAX_SPEED: 2 * DEPTH_PERCEPTION,
	// Radius of vision for a fish: It only checks collisions with other fishes in that radius
	MAX_VISION_DISTANCE: 50 * DEPTH_PERCEPTION,
};