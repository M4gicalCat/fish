import { PARAMS } from "./params.js";

export function generateFishes(n) {
	return new Array(n).fill(0).map(() => {
		const fish = {
			id: `_${window.crypto.getRandomValues(new Uint32Array(1))[0]}`,
			position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
			velocity: PARAMS.MAX_SPEED,
			orientation: Math.random() * 2 * Math.PI,
			distances: {},
			color: `rgb(${Math.floor(Math.random() * 200 + 56)},${Math.floor(Math.random() * 200 + 56)},${Math.floor(Math.random() * 200 + 56)})`,
		};
		fish.nextPosition = { ...fish.position };
		fish.trajectory = getFishFunction(fish);
		return fish;
	});
}

function getFishFunction(fish) {
	const a = ((fish.nextPosition.x - fish.position.x) / (fish.nextPosition.y - fish.position.y)) || 0;
	const b = -a * fish.position.x + fish.position.y;
	return { a, b };
}

function getCollidePoint(f1, f2) {
	const deltaA = (f1.trajectory.a - f2.trajectory.a);
	let x;
	if (deltaA === 0) {
		if (f1.trajectory.b !== f2.trajectory.b) return;
		x = (f1.position.x + f2.position.x) / 2
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
	const angle = getAngle(me.position, collidePoint, fish.position) * ((me.distances[fish.id] / PARAMS.MAX_VISION_DISTANCE) ** 2);
	me.steer.n++;
	me.steer.all -= angle;
}

export function updatePosition(f, others) {
	const fish = structuredClone(f);
	const oldPosition = {x: fish.position.x, y: fish.position.y};
	fish.position.x += fish.velocity * Math.cos(fish.orientation);
	fish.position.y += fish.velocity * Math.sin(fish.orientation);
	// temporary nextPosition
	fish.nextPosition.x = 2 * fish.position.x - oldPosition.x;
	fish.nextPosition.y = 2 * fish.position.y - oldPosition.y;
	fish.trajectory = getFishFunction(fish);
	fish.steer = {n: 0, all: 0};

	for (const other of others) {
		steerAway(fish, other);
	}
	if (fish.steer.n !== 0 && fish.steer.all !== 0) {
		const avg = fish.steer.all / fish.steer.n;
		fish.orientation -= Math.abs(avg) < PARAMS.MAX_ROTATION ? avg : PARAMS.MAX_ROTATION * (avg < 0 ? -1 : 1);
		const lostSpeed = PARAMS.SPEED_LOSS * (Math.abs(PARAMS.MAX_ROTATION / avg));
		fish.velocity -= lostSpeed;
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
	return fish;
}