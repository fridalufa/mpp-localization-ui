
export default class PositionCalculator {
	calculatePosition(distances, baseNodes) {
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
}