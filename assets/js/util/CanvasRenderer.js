export default class CanvasRenderer {
	constructor(canvas, baseNodes, distances) {

		this.canvas = canvas;
		this.baseNodes = baseNodes;
		this.distances = distances;
		this.position = null;
		this.lastTick = null;
		this.drawBubble = true;

		this.colors = {
			d1: '#e67e22',
			d2: '#9f60b9',
			d3: '#3498db'
		}

		window.requestAnimationFrame(this.draw.bind(this));
	}

	updateDistances(distances) {
		this.distances = distances;
	}

	setPosition(position) {
		this.position = position;
	}

	draw() {
		
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d');
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for (var node in this.baseNodes) {
    			var coords = this.baseNodes[node];
    			var dist = this.distances[node];
    			ctx.beginPath();
    			ctx.arc(coords[0], coords[1], dist, 0, Math.PI*2);
    			ctx.strokeStyle = this.colors[node];
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.arc(coords[0], coords[1], 10, 0, Math.PI*2);
    			ctx.fillStyle = this.colors[node];
    			ctx.fill();
    			ctx.fillStyle = "#ffffff";
    			ctx.fillText(node, coords[0]-5, coords[1]+4);
    		}

    		if (this.position) {
    			var now = Date.now();

				if (this.lastTick == null || (now - this.lastTick) > 500) {
					this.drawBubble = !this.drawBubble;
					this.lastTick = now;
				}

				if (this.drawBubble) {
					ctx.beginPath();
	        		ctx.arc(this.position[0], this.position[1], 6, 0, Math.PI*2);
	        		ctx.fillStyle = '#1abc9c';
	        		ctx.fill();
				}
    		}

			window.requestAnimationFrame(this.draw.bind(this));
		}
	}
}