import {PARAMS} from "./params.js";
import {generateFishes, updatePosition} from "./2D.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

let customResize, gameId;

const resize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	customResize?.();
}

window.addEventListener('resize', resize);

const main2d = () => {
	const privateId = `${Math.random() * Number.MAX_SAFE_INTEGER}`;
	gameId = privateId;
	const ctx = canvas.getContext('2d');
	let fishes = generateFishes(PARAMS.NB_FISH);
	customResize = () => {
		ctx.fillStyle = '#444444';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	customResize();
	const draw = () => {
		if (privateId === gameId) window.requestAnimationFrame(draw);
		ctx.fillStyle = '#22222222';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		fishes = fishes.map(fish => {
			ctx.save();
			ctx.fillStyle = fish.color;
			ctx.translate(fish.position.x - 5, fish.position.y - 2);
			ctx.rotate(fish.orientation);
			ctx.fillRect(0, 0, 10, 4);
			ctx.restore();
			return updatePosition(fish, fishes.filter(f => {
				if (fish === f) return false;
				const distanceToFish = Math.sqrt((fish.position.x - f.position.x)**2 + (fish.position.y - f.position.y)**2);
				fish.distances[f.id] = distanceToFish;
				return (distanceToFish < PARAMS.MAX_VISION_DISTANCE);
			}));
		});
	}
	window.requestAnimationFrame(draw);
};
resize();

const play = (e) => {
	if (e.key !== 'p') return;
	if (PARAMS.DIMENSION === '2D') main2d();
}

document.addEventListener('keydown', play);
play({key: 'p'});