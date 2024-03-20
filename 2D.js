import { PARAMS } from './params.js';

export function generateFishes(n) {
	/**
	 * @type {Record<number, Record<number, any[]>>}
	 */
	const fishGrid = {};
	const fishes = [];
	for (let x = 0; x < window.innerWidth / PARAMS.MAX_VISION_DISTANCE; x++) {
		fishGrid[x] = {};
		for (let y = 0; y < window.innerHeight / PARAMS.MAX_VISION_DISTANCE; y++) {
			fishGrid[x][y] = [];
		}
	}
	for (let i = 0; i < n; i++) {
		const fish = {
			id: `_${window.crypto.getRandomValues(new Uint32Array(1))[0]}`,
			position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
			velocity: PARAMS.MAX_SPEED,
			orientation: Math.random() * 2 * Math.PI,
			distances: {},
			color: `rgb(${Math.floor(Math.random() * 200 + 56)},${Math.floor(Math.random() * 200 + 56)},${Math.floor(Math.random() * 200 + 56)})`,
		};
		// set its next position for later purposes, and its trajectory
		fish.nextPosition = { ...fish.position };
		fish.trajectory = getFishFunction(fish);
		// put it inside the grid
		fishGrid[Math.floor(fish.position.x / PARAMS.MAX_VISION_DISTANCE)][
			Math.floor(fish.position.y / PARAMS.MAX_VISION_DISTANCE)
		].push(fish);
		fishes.push(fish);
	}
	return { fishGrid, fishes };
}

function getFishFunction(fish) {
	const a = (fish.nextPosition.x - fish.position.x) / (fish.nextPosition.y - fish.position.y) || 0;
	const b = -a * fish.position.x + fish.position.y;
	return { a, b };
}

function getCollidePoint(f1, f2) {
	const deltaA = f1.trajectory.a - f2.trajectory.a;
	let x;
	if (deltaA === 0) {
		if (f1.trajectory.b !== f2.trajectory.b) return;
		x = (f1.position.x + f2.position.x) / 2;
	} else x = (f2.trajectory.b - f1.trajectory.b) / deltaA;
	const y = f1.trajectory.a * x + f1.trajectory.b;
	return { x, y };
}

function getAngle(A, B, C) {
	const crossProduct = (B.x - A.x) * (C.y - B.y) - (B.y - A.y) * (C.x - B.x);
	const dotProduct = (B.x - A.x) * (C.x - B.x) + (B.y - A.y) * (C.y - B.y);

	return Math.atan2(crossProduct, dotProduct);
}

function steerAway(me, fish) {
	const collidePoint = getCollidePoint(me, fish);
	// won't collide => don't steer
	if (!collidePoint) return;
	const angle =
		getAngle(me.position, collidePoint, fish.position) *
		(me.distances[fish.id] / PARAMS.MAX_VISION_DISTANCE) ** 2;
	if (Number.isNaN(angle)) return;
	me.steer.n++;
	me.steer.all -= angle;
}

export function updatePosition(f, others, current) {
	const fish = structuredClone(f);
	const oldPosition = { x: fish.position.x, y: fish.position.y };
	fish.position.x += fish.velocity * Math.cos(fish.orientation);
	fish.position.y += fish.velocity * Math.sin(fish.orientation);
	// temporary nextPosition
	fish.nextPosition.x = 2 * fish.position.x - oldPosition.x;
	fish.nextPosition.y = 2 * fish.position.y - oldPosition.y;
	fish.trajectory = getFishFunction(fish);
	fish.steer = { n: 0, all: 0 };
	for (const other of others) {
		steerAway(fish, other);
	}
	if (fish.steer.n !== 0 && fish.steer.all !== 0) {
		const avg = fish.steer.all / fish.steer.n;
		fish.orientation -=
			Math.abs(avg) < PARAMS.MAX_ROTATION ? avg : PARAMS.MAX_ROTATION * (avg < 0 ? -1 : 1);
		const lostSpeed = PARAMS.SPEED_LOSS * Math.abs(PARAMS.MAX_ROTATION / avg);
		fish.velocity -= lostSpeed;
	}
	if (current) {
		const angleAvg = ((fish.orientation - current.orientation) / 2 + 4 * Math.PI) % (2 * Math.PI);
		let n;
		if (angleAvg < Math.PI) {
			n = -Math.min(current.force, angleAvg);
		} else {
			n = Math.min(current.force, Math.abs(2 * Math.PI - angleAvg));
		}
		if (n !== 0) {
			const nextOrientation = fish.orientation + n;
			fish.orientation = (nextOrientation + 2 * Math.PI) % (2 * Math.PI);
		}
	}
	fish.velocity += PARAMS.ACCELERATION;
	fish.velocity = Math.min(Math.max(PARAMS.MIN_SPEED, fish.velocity), PARAMS.MAX_SPEED);
	// next position
	fish.nextPosition.x = 2 * fish.position.x - oldPosition.x;
	fish.nextPosition.y = 2 * fish.position.y - oldPosition.y;

	// constraint fishes to canvas
	fish.position.x = (fish.position.x + window.innerWidth) % window.innerWidth;
	fish.position.y = (window.innerHeight + fish.position.y) % window.innerHeight;
	fish.nextPosition.x = (fish.nextPosition.x + window.innerWidth) % window.innerWidth;
	fish.nextPosition.y = (window.innerHeight + fish.nextPosition.y) % window.innerHeight;
	// if (Number.isNaN(fish.position.x)) fish.position.x = oldPosition.x;
	// if (Number.isNaN(fish.position.y)) fish.position.y = oldPosition.y;
	return fish;
}
