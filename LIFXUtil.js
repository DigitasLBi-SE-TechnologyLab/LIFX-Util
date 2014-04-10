/* global require,console */
var lifx = require('lifx');
var lx = lifx.init();

lx.on('bulb', function(bulb) {
	queueLights([
		[255, 255, 255],
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 255, 0],
		[0, 255, 255],
		[255, 0, 255]
	], 1000, 2000);
});

function queueLights(lights, fade, delay) {
	function f(r, g, b, fade, delay) {
		setTimeout(function() {
			setRgb(r, g, b, fade);
		}, delay);
	}

	for (var i = 0; i < lights.length; i++) {
		var l = lights[i];
		f(l[0], l[1], l[2], fade, delay * i);
	}
}

function setRgb(r, g, b, fade, kelvin) {
	fade = fade || 0;
	kelvin = kelvin || 0xffff;
	var hsl = rgbToHsl(r, g, b);

	var maxval = 0xffff;
	console.log((hsl.h / 360) * maxval, (hsl.s / 100) * maxval, (hsl.l / 100) * maxval, kelvin, fade);
	lx.lightsColour(parseInt((hsl.h / 360) * maxval, 10), parseInt((hsl.s / 100) * maxval, 10), parseInt((hsl.l / 100) * maxval, 10), kelvin, fade);
}

function test(r, g, b) {
	console.log([r, g, b].toString() + ' : ' + JSON.stringify(rgbToHsl(r, g, b)));
}

function rgbToHsl(R, G, B) {
	var r = R / 255;
	var g = G / 255;
	var b = B / 255;

	var cmax = Math.max(r, g, b);
	var cmin = Math.min(r, g, b);

	var delta = cmax - cmin;

	var h;
	switch (cmax) {
		case r:
			h = ((6 + ((g - b) / delta)) % 6) || 0;
			break;
		case g:
			h = ((b - r) / delta) + 2;
			break;
		case b:
			h = ((r - g) / delta) + 4;
			break;
	}
	h *= 60;

	var l = (cmax + cmin) / 2;

	var s = (delta === 0) ? 0 : delta / (1 - Math.abs(2 * l - 1));

	return {
		h: h,
		s: s * 100,
		l: l * 100
	};
}