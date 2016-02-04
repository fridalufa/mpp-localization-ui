
export default class PositionCalculator {

	constructor(error) {
		this.error = error;
	}

	calculatePositionOld(distances, baseNodes) {
		var d1_2 = Math.pow(distances['d1'], 2);
		var d2_2 = Math.pow(distances['d2'], 2);

		var p = baseNodes['d2'][0] - baseNodes['d1'][0];
		var x = (d1_2 - d2_2 + Math.pow(p, 2))/(2*p);
		//var diff = d1_2-d2_2+Math.pow(p, 2)
		var y = Math.sqrt(d1_2-Math.pow(x, 2));

		x += baseNodes['d1'][0];
		y += baseNodes['d1'][1];

		return [x, y];
	}

	calculatePosition(distances, baseNodes) {

		var maxX = 12;
		var maxY = 12;
		var resolution = 0.05;

		var x = 0.0;
		var y = 0.0;

		var validPositions = 0.0;

		for (var cX = 0.0; cX < maxX; cX += resolution) {
			for (var cY = 0.0; cY < maxY; cY += resolution) {
                if (this.isPossiblePosition(cX, cY, distances, baseNodes)) {
					x += cX;
					y += cY;
					validPositions++;
				}
			}
		}

		if (validPositions > 0) {
			x /= validPositions;
			y /= validPositions;
		}

		return [x, y, 0.25];
	}

	isPossiblePosition(x, y, distances, baseNodes) {

		for (var node in baseNodes) {
			var coords = baseNodes[node];
			var dist = distances[node];

			var error = this.calculateError(dist);

			var minDist = dist - error;
			var maxDist = dist + error;

			var disHelper = function (x1, y1, x2, y2) {
				return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
			}

			var rDis = disHelper(x, y, coords[0], coords[1]);

			if (rDis < minDist) {
				return false;
			}

			if (rDis > maxDist) {
				return false;
			}
		}

		return true;
	}

	calculateRangeCoords() {

		var coords = {
			min: {
				x: 0,
				y: 0
			},
			max: {
				x: Infinity,
				y: Infinity
			}
		};

		for (var node in this.baseNodes) {
			var nodeCoords = this.baseNodes[node];
			var dist = this.distances[node];

			var maxDist = dist + this.calculateError(dist);

			if (nodeCoords[0] + maxDist > coords.max.x) {
				coords.max.x = nodeCoords[0] + maxDist;
			}
			if (nodeCoords[1] + maxDist > coords.max.y) {
				coords.max.y = nodeCoords[1] + maxDist;
			}
		}

		return coords;
	}

	calculateError(value) {
		if(this.error.type == "absolute") {
			return this.error.value > value ? value : parseFloat(this.error.value);
		}

		return value * parseFloat(this.error.value);
	}
}
