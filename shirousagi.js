var title     = 'HELLO WORLD';

var normal    = '#5CFF5C';
var brighter  = '#8F8';
var brightest = '#AFA';
var opaque    = 0.045;

var alpha     = '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
var hspce     = 1.25; // Horizontal spacing between glyphs
var vspce     = 1.2;  // Vertical spacing between glyphs
var fsize     = 14;   // Fontsize
var speed     = 34;

var stop = false;

window.onload = setTimeout(function(){
	var drops = []; // Array for raindrops
	var perma = [];
	var finsh = [];

	var w = q.width  = window.innerWidth;
	var h = q.height = window.innerHeight;
	var total_drops = Math.floor( w / (fsize * hspce) );

	var ctx = q.getContext('2d');
	function reset_shadow() {
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
	}

	var hmiddle = Math.floor( total_drops / 2 ); // Horizontal middle of the screen (in glyphs)
	var half_t  = Math.floor( title.length / 2 );
	var left    = hmiddle - half_t;
	var right   = hmiddle + (title.length - half_t);

	var glyph_h = (fsize * vspce);
	var vmiddle = Math.floor( h / glyph_h / 2 ); // Vertical   middle of the screen (in glyphs)
	vmiddle *= glyph_h; // Put in y coords

	for (var i = 0; i < total_drops; i++) {
		drops[i] = Math.floor( Math.random() * -h ); // Start randomly above screen
		// perma[i] = (i >= left && i < right) && !( /\s/.test(title.charAt(i - left)) ); // Not whitespace
		perma[i] = (i >= left && i < right);
		finsh[i] = false;
	}

	function draw_perma() {
		ctx.font = fsize + 'pt Roboto Mono, monospace';
		reset_shadow();
		ctx.fillStyle = normal;

		drops.map(function(y, i){
			if (perma[i]) {
				ctx.fillText(
					title.charAt(i - left), // Glyph
					i * (fsize * hspce),    // x coord
					y                       // y coord
				);
			}
		});
	}

	function blacken() {
		var step = (1 - opaque) / 15;
		var opacity = opaque;
		var black = setInterval(function(){
			ctx.fillStyle = 'rgba(0, 0, 0, '+ opacity +')';
			ctx.fillRect(0, 0, w, h);
			draw_perma();

			opacity += step;
			if (opacity > 1) {
				clearInterval(black);

				ctx.fillStyle = 'rgb(0, 0, 0)';
				ctx.fillRect(0, 0, w, h);
				draw_perma();
			}
		}, speed);
	}

	function fade() {
		var i = 0;
		var clean = setInterval(function(){
			reset_shadow();
			ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
			ctx.fillRect(0, 0, w, h);
			draw_perma();

			if (++i == 67) {
				clearInterval(clean);
				blacken();
			}
		}, speed);
	}

	var rain = setInterval(function(){
		if (finsh.every( (v) => v )) { // Check all boolean values in array
			clearInterval(rain);
			fade();
		}

		reset_shadow();
		ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
		ctx.fillRect(0, 0, w, h);

		ctx.font = fsize + 'pt Roboto Mono, monospace';
		ctx.fillStyle = normal;

		drops.map(function(y, i){
			if (perma[i] && Math.abs(y - vmiddle) < 0.0001) {
				var sum = 0;
				finsh.forEach( (v) => { v ? sum++ : 0; } );
				if (sum >= half_t) {
					stop = true;
				}

				if (!finsh[i]) {
					ctx.shadowColor = '#FFF';
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 12;
					ctx.fillStyle = brightest;
				}
				else {
					reset_shadow();
					ctx.fillStyle = normal;
				}

				finsh[i] = true;

				ctx.fillText(
					title.charAt(i - left), // Glyph
					i * (fsize * hspce),    // x coord
					y                       // y coord
				);
			}
			else {
				// Add random glowing glyphs
				// (~5% chance)
				if (Math.random() > 0.95) {
					// Glowing white glyphs (white shadow)
					if (Math.random() > 0.67) {
						ctx.shadowColor = '#FFF';
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;
						ctx.shadowBlur = 12;
						ctx.fillStyle = brightest;
					}

					// More subtle, slightly brighter glyphs that glow for a moment
					else {
						reset_shadow();
						ctx.fillStyle = brighter;
					}
				}
				else {
					reset_shadow();
					ctx.fillStyle = normal;
				}

				// Print letters
				ctx.fillText(
					alpha.charAt( Math.floor(Math.random() * alpha.length) ), // Glyph
					i * (fsize * hspce), // x coord
					y                    // y coord
				);

				// Reset if raindrop some distance past bottom of screen
				if (y > h + Math.random() * h * 2 / 3) {
					drops[i] = 0; // Reset raindrops at top of screen
				}
				else if (stop) {
					if (!perma[i] && y > h) {
						drops[i] = -glyph_h; // Reset raindrop forever
						finsh[i] = true;
					}
					else if (y >= 0) {
						drops[i] = y + glyph_h; // Advance down the screen
					}
				}
				else {
					drops[i] = y + glyph_h; // Advance down the screen
				}
			}
		});
	}, speed);
}, 1337);
