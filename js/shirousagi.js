var text        = 'JACK COGDILL';

var normal      = '#5CFF5C';
var brighter    = '#8F8';
var brightest   = '#AFA';
var opaque      = 0.045;

var alpha       = '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
var hspce       = 1.1; // Horizontal spacing between glyphs
var vspce       = 1.2; // Vertical spacing between glyphs
var fsize       = 14;  // Fontsize
var font_family = 'Anonymous Pro';
var font        = fsize + 'pt ' + font_family + ', monospace';

var speed       = 34;
var stop        = false;
var pause       = 1337;

function complete() {
	info.style.zIndex = "2";
	src.style.zIndex  = "2";

	info.style.opacity = "1";
	src.style.opacity  = "1";
}

window.onload = setTimeout(function(){
	var drops = []; // Array for raindrops
	var perma = []; // Array of boolean values, is raindrop column for text
	var finsh = []; // Array of boolean values, signal if raindrop is done permanently

	var w = q.width  = window.innerWidth;
	var h = q.height = window.innerHeight;
	var ctx = q.getContext('2d');

	// Modify canvas to be high DPI
	// Lovingly adapted from http://stackoverflow.com/a/15666143/1313757
	var dpr = window.devicePixelRatio          || 1;
	var bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio ||
	          ctx.msBackingStorePixelRatio     || ctx.oBackingStorePixelRatio   ||
	          ctx.backingStorePixelRatio       || 1;
	var ratio = dpr / bsr;
	q.width  = w * ratio;
	q.height = h * ratio;
	q.style.width  = w + "px";
	q.style.height = h + "px";
	ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

	var glyph_w = (fsize * hspce); // Width  of one glyph
	var glyph_h = (fsize * vspce); // Height of one glyph
	var total_drops = Math.floor( w / (fsize * hspce) ); // Total number of raindrops

	function is_even(n) {
		return n % 2 == 0;
	}
	// XOR: true if different, false if same
	if (is_even(total_drops) ^ is_even(text.length)) {
		total_drops--;
	}
	var unused = w - total_drops * glyph_w; // Unused (horizontal) canvas space
	// Using this to center the text on the screen

	var hmiddle = Math.floor( total_drops / 2 ); // Horizontal middle of the screen (in glyphs)
	var half_t  = Math.floor( text.length / 2 );
	var left    = hmiddle - half_t;                 // Raindrop column index to start text
	var right   = hmiddle + (text.length - half_t); // Raindrop column index to end   text

	var vspot = Math.floor( h / glyph_h / 3 ); // Vertical location on screen for text (in glyphs)
	                                           // Putting at 1/3 of the screen's height
	vspot *= glyph_h; // Put in y coords

	for (var i = 0; i < total_drops; i++) {
		drops[i] = Math.floor( Math.random() * -h ); // Start randomly above screen
		perma[i] = (i >= left && i < right);
		finsh[i] = false;
	}

	function reset_shadow() {
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
	}

	// Redraw the text characters
	function draw_perma() {
		ctx.font = font;
		reset_shadow();
		ctx.fillStyle = normal;

		drops.map(function(y, i){
			if (perma[i]) {
				ctx.fillText(
					text.charAt(i - left),    // Glyph
					unused / 2 + i * glyph_w, // x coord
					y                         // y coord
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
		complete(); // Run synchronously with black()
	}

	function fade() {
		var i = 0;
		var clean = setInterval(function(){
			reset_shadow();
			ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
			ctx.fillRect(0, 0, w, h);
			draw_perma();

			if (++i == 25) {
				clearInterval(clean);
				blacken();
			}
		}, speed);
	}

	var rain = setInterval(function(){
		// Check all boolean values in array
		if (finsh.every(function(v){
				return v;
		})) {
			clearInterval(rain);
			fade();
		}

		reset_shadow();
		ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
		ctx.fillRect(0, 0, w, h);

		ctx.font = font;
		ctx.fillStyle = normal;

		drops.map(function(y, i){
			// Since raindrops start randomly above screen, almost zero chance it
			// will hit it exactly on the first rain. This allows a few seconds of
			// raining before forming the text
			if (perma[i] && Math.abs(y - vspot) < 0.0001) {
				var sum = 0;
				finsh.forEach(function(v){
					if (v) {
						sum++;
					}
				});
				// Signal to stop the raining once half the text has formed
				if (sum >= Math.floor( text.length / 3 )) {
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
					ctx.fillStyle = brighter;
				}

				finsh[i] = true;

				ctx.fillText(
					text.charAt(i - left),    // Glyph
					unused / 2 + i * glyph_w, // x coord
					y                         // y coord
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
					unused / 2 + i * glyph_w, // x coord
					y                         // y coord
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
}, pause / 3);
