const ctx = document
	.getElementById('transparent_canvas')
	.getContext('2d', { willReadFrequently: true });

/**
 * Max force = Math.abs(fish.orientation - current.orientation) % (Math.PI * 2) === Math.PI / 2
 * => The fish gets the current on the side;
 */
export const current = {
	points: [
		{ x: 200, y: 200 },
		{ x: 500, y: 200 },
		{ x: 500, y: 500 },
		{ x: 200, y: 500 },
		{ x: 150, y: 350 },
	],
	force: 0.02,
	orientation: 0,
	clear() {
		this.points = [];
		this.update();
	},
	addPoint(x, y) {
		this.points.push({ x, y });
		this.update();
	},
	update() {
		ctx.fillStyle = '#FF000001';
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if (this.points.length < 3) return;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for (const { x, y } of this.points) {
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	},
};

current.update();

export function isInCurrent(position) {
	return ctx.getImageData(position.x, position.y, 1, 1).data[0] === 255;
}
