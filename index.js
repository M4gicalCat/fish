import { PARAMS } from './params.js';
import { generateFishes, updatePosition } from './2D.js';
import { current, isInCurrent } from './current2D.js';

document.getElementById('options').addEventListener('click', e => e.stopPropagation());
document
	.getElementById('force')
	.addEventListener('input', e => (current.force = (+e.target.value || 0) / 100));
document
	.getElementById('angle')
	.addEventListener('input', e => (current.orientation = (+e.target.value / 180) * Math.PI));

const drawFunctions = new Map();
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

/**
 * @type {HTMLCanvasElement}
 */
const interactiveCanvas = document.getElementById('interactive_canvas');

/**
 * @type {HTMLCanvasElement}
 */
const currentCanvas = document.getElementById('transparent_canvas');
let customResize;

function onRightClick() {
	current.clear();
}

function onLeftClick(e) {
	current.addPoint(e.clientX, e.clientY);
}

function resize() {
	for (const c of [canvas, interactiveCanvas, currentCanvas]) {
		c.width = window.innerWidth;
		c.height = window.innerHeight;
	}
	customResize?.();
	current.update();
}

window.addEventListener('resize', resize);
window.addEventListener('contextmenu', e => {
	e.preventDefault();
	onRightClick(e);
});

interactiveCanvas.addEventListener('mousedown', onLeftClick);

const interactiveCtx = interactiveCanvas.getContext('2d');

const main2d = () => {
	const ctx = canvas.getContext('2d');

	let fishes = generateFishes(PARAMS.NB_FISH);
	(customResize = () => {
		ctx.fillStyle = '#444444';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	})();

	function drawFishes() {
		ctx.fillStyle = '#22222222';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		fishes = fishes.map(fish => {
			ctx.save();
			ctx.fillStyle = fish.color;
			ctx.translate(fish.position.x - 5, fish.position.y - 2);
			ctx.rotate(fish.orientation);
			ctx.fillRect(0, 0, 10, 4);
			ctx.restore();
			const inside = isInCurrent(fish.position);
			return updatePosition(
				fish,
				fishes.filter(f => {
					if (fish === f) return false;
					const distanceToFish = Math.sqrt(
						(fish.position.x - f.position.x) ** 2 + (fish.position.y - f.position.y) ** 2,
					);
					fish.distances[f.id] = distanceToFish;
					return distanceToFish < PARAMS.MAX_VISION_DISTANCE;
				}),
				inside ? current : undefined,
			);
		});
	}

	drawFunctions.set('draw2D', drawFishes);
};
resize();

function drawCurrent() {
	if (current.points.length < 2) return;
	interactiveCtx.fillStyle = '#FF000022';
	interactiveCtx.save();
	interactiveCtx.beginPath();
	interactiveCtx.moveTo(current.points[0].x, current.points[0].y);
	for (const { x, y } of current.points) {
		interactiveCtx.lineTo(x, y);
	}
	interactiveCtx.closePath();
	interactiveCtx.fill();
	interactiveCtx.restore();
}

function draw() {
	window.requestAnimationFrame(draw);
	interactiveCtx.clearRect(0, 0, interactiveCtx.canvas.width, interactiveCtx.canvas.height);
	drawFunctions.forEach(f => f());
}

window.requestAnimationFrame(draw);

const onKeyDown = e =>
	({
		p() {
			if (PARAMS.DIMENSION === '2D') main2d();
		},
		c() {
			if (drawFunctions.has('current')) drawFunctions.delete('current');
			else drawFunctions.set('current', drawCurrent);
		},
	})[e.key]?.();

document.addEventListener('keydown', onKeyDown);
