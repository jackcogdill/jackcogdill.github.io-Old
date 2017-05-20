// Inner function(incr), callback function, max increment,
// initial delay, minimum delay, exponent, divisor
function ease(ifun, callback, max=100, init=100, mind=16.67, ex=Math.E, div=30) {
	var incr  = 0;
	var delay = init;

	var wait = function() {
		ifun(incr);

		// exial time function: get faster (delay -> 0)
		delay = -Math.pow(incr / div, ex) + init;

		if (delay < mind) {
			delay = mind;
		}
		incr++;

		if (incr <= max) {
			timeout = setTimeout(wait, delay);
		}
		else {
			callback();
		}
	}
	var timeout = setTimeout(wait, delay);
}

function setup_canvas() {
	window.w = canvas.width  = window.innerWidth;
	window.h = canvas.height = window.innerHeight;
	window.ctx = canvas.getContext('2d');

	// Modify canvas to be high DPI
	// Lovingly adapted from http://stackoverflow.com/a/15666143/1313757
	var dpr = window.devicePixelRatio || 1;
	var bsr =    ctx.webkitBackingStorePixelRatio
	          || ctx.mozBackingStorePixelRatio
	          || ctx.msBackingStorePixelRatio
	          || ctx.oBackingStorePixelRatio
	          || ctx.backingStorePixelRatio
	          || 1;
	var ratio = dpr / bsr;
	canvas.width  = w * ratio;
	canvas.height = h * ratio;
	canvas.style.width  = w + 'px';
	canvas.style.height = h + 'px';
	ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function rain(text, callback) {
	var normal      = '#5CFF5C';
	var bright      = '#43B943';
	var brighter    = '#8F8';
	var brightest   = '#AFA';

	var opaque      = 0.045;

	var alpha       = '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
	var hspce       = 1.1; // Horizontal spacing between glyphs
	var vspce       = 1.2; // Vertical spacing between glyphs
	var fsize       = 14;  // Fontsize
	var font_family = 'Anonymous Pro';
	var font        = fsize + 'pt ' + font_family + ', monospace';

	var speed         = 30; // Speed of rain iterations in milliseconds (smaller = faster)
	window.fade_speed = 34;
	var stop          = false;

	window.drops = []; // Array for raindrops
	window.perma = []; // Array of boolean values, is raindrop column for text
	window.finsh = []; // Array of boolean values, signal if raindrop is done permanently

	var glyph_w = (fsize * hspce); // Width  of one glyph
	var glyph_h = (fsize * vspce); // Height of one glyph
	var total_drops = Math.floor( w / glyph_w ); // Total number of raindrops

	// Both 'total_drops' and 'text.length' must be either even or odd to easily center
	if ( (total_drops + text.length) % 2 == 1 ) {
		total_drops--;
	}
	var unused = w - (total_drops * glyph_w); // Unused (horizontal) canvas space
	unused += fsize * (hspce - 1);
	// Using this to center the text on the screen

	var hmiddle = Math.floor( total_drops / 2 ); // Horizontal middle of the screen (in glyphs)
	var half_t  = Math.floor( text.length / 2 );
	var left    = hmiddle - half_t;                 // Raindrop column index to start text
	var right   = hmiddle + (text.length - half_t); // Raindrop column index to end   text

	var vspot = Math.floor( h / glyph_h / 2);
	// Vertical location on screen for text (in glyphs)
	// Putting at 50% of the screen's height

	vspot *= glyph_h; // Put in y coords

	for (var i = 0; i < total_drops; i++) {
		// Start randomly above screen
		drops[i] = -1 * Math.floor( Math.random() * (h / glyph_h) ) * glyph_h;
		drops[i] += 0.1337; // Add an offset so it will never align with the permanent letters
		                    // the first time
		perma[i] = (i >= left && i < right)
		           && (text.charAt(i - left) != ' '); // Spaces are not permanent letters
		finsh[i] = false;
	}

	function reset_shadow() {
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
	}

	var fall = setInterval(function(){
		// Check all boolean values in array
		if (finsh.every(function(v){
				return v;
		})) {
			clearInterval(fall);
			fade(); // Function to execute when finished
		}

		reset_shadow();
		ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
		ctx.fillRect(0, 0, w, h);

		ctx.font = font;
		ctx.fillStyle = normal;

		drops.map(function(y, i){
			// [No chance for raindrops to hit it exactly on the first rain becasue of
			//  the added offset. This allows a few seconds of raining before forming
			//  the text]
			// Check to see if the position equals the position of the permanent text.
			// If it does, draw the letter
			if (perma[i] && Math.abs(y - vspot) < 0.0001) {
				var sum = 0;
				finsh.forEach(function(v){
					if (v) {
						sum++;
					}
				});
				// Signal to stop the raining if half of the text has formed
				if (sum >= Math.floor( text.length / 2 )) {
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
				// (~3% chance)
				if (Math.random() > 0.97) {
					// 1/3 glowing white glyphs (white shadow)
					if (Math.random() > 0.67) {
						ctx.shadowColor = '#FFF';
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;
						ctx.shadowBlur = 12;
						ctx.fillStyle = brightest;
					}
					// 2/3 more subtle, slightly brighter glyphs that glow for a moment
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

				// Check if signalled to stop raining
				if (stop) {
					// Reset raindrop forever if it is not a permanent letter column and
					// it's past the bottom of the screen
					if (!perma[i] && y > h) {
						drops[i] = -glyph_h;
						finsh[i] = true;
					}
				}

				if (!finsh[i]) {
					// Reset if raindrop is some distance past bottom of screen
					if (y > h + Math.random() * h * 2 / 3) {
						drops[i] = 0; // Reset raindrops at top of screen
					}
					else {
						drops[i] = y + glyph_h; // Advance down the screen
					}
				}
			}
		});
	}, speed);

	// Redraw the text characters (keep them permanent)
	function draw_perma(fill=normal) {
		ctx.font = font;
		reset_shadow();
		ctx.fillStyle = fill;

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

	function fade() {
		var i = 0;
		var clean = setInterval(function(){
			reset_shadow();
			ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
			ctx.fillRect(0, 0, w, h);
			draw_perma();

			// 25 is about the number it takes to go completely black
			// Extra to stall so user can read text
			if (++i == 35) {
				clearInterval(clean);
				remove_perma();
			}
		}, fade_speed);
	}

	function remove_perma() {
		function getAllIndexes(arr, val) {
			var indices = [];
			var i = -1;
			while ( (i = arr.indexOf(val, i + 1)) != -1 ){
				indices.push(i);
			}
			return indices;
		}

		function setCharAt(str, index, chr) {
			if (index > str.length - 1) return str;
			return str.substr(0,index) + chr + str.substr(index + 1);
		}

		var alpha_real = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var blend = [
			'5CFF5C', '5AF95A', '57F257', '55EC55', '53E653', '51DF51',
			'4ED94E', '4CD24C', '4ACC4A', '48C648', '45BF45', '43B943'
		];
		// Blended normal -> bright
		// Courtesy of: http://meyerweb.com/eric/tools/color-blend/#5CFF5C:43B943:10:hex

		var max = 40;
		ease(
			// Inner function(incr)
			function(i){
				var truths = getAllIndexes(perma, true);

				var low  = 1;
				var high = truths.length / 2;
				for (
					var j = 0;
					j < Math.floor(low + Math.random() * (high - low));
					j++
				) {
					var r = Math.floor(Math.random() * truths.length);
					drops[ truths[r] ] += glyph_h;
					text = setCharAt(
						text,
						truths[r] - left,
						alpha_real.charAt( Math.floor(Math.random() * alpha_real.length) )
					);
				}

				var r = Math.floor(Math.random() * truths.length);
				// 33% chance, only if 1/3 of animation done
				if (i > max / 3 && Math.random() > 0.67) {
					perma[ truths[r] ] = false;
				}

				ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
				ctx.fillRect(0, 0, w, h);

				// Blend: normal -> bright
				var index = Math.round(i / (max / blend.length));
				var fill = '#' + blend[ (index >= 0) ? index : blend.length - 1 ];

				if (Math.random() > 0.67) { // 33% chance
					fill = '#000';
				}
				draw_perma(fill);
			},
			// Callback function
			function(){
				blacken(15, function(){}, callback);
			},
			max, // Max increment
			id=25 // Initial delay
		);
	}

	// Iterations, inner function, callback function
	function blacken(iter, inner, callback) {
		var step = (1 - opaque) / iter;
		var opacity = opaque;
		var black = setInterval(function(){
			ctx.fillStyle = 'rgba(0, 0, 0, '+ opacity +')';
			ctx.fillRect(0, 0, w, h);

			inner();

			opacity += step;
			if (opacity >= 1) {
				clearInterval(black);

				// Final iteration (pure black)
				ctx.fillStyle = '#000';
				ctx.fillRect(0, 0, w, h);

				callback(); // Done with black()
			}
		}, fade_speed);
	}
}

function complete_page() {
	canvas.style.opacity = '0';
	setTimeout(function(){
		canvas.style.zIndex = '-1';
		canvas.outerHTML = ''; // Remove the element from the document
	}, 700);

	wrap.style.zIndex  = '2';
	wrap.style.opacity = '1';
}

function enter() {
	var elem = document.getElementById('enter-text');
	elem.outerHTML = ''; // Remove the element from the document

	var text = 'JACK COGDILL // WELCOME';
	rain(text, complete_page);
}

window.onload = function () {
	setup_canvas();

	var wait = 2; // How long to wait (in seconds) before allowing activate().
	              // This is waiting 2 seconds for the delay and duration of
	              // the typing animation of #enter-text
	setTimeout(function(){

		var activate;
		// User touched screen on mobile
		window.addEventListener('touchstart', activate = function(){
			// Disable the function now, if either event happens
			document.onkeydown = null;
			window.removeEventListener('touchstart', activate, false);
			enter();
		}, false);

		document.onkeydown = function (e) {
			activate();
		};

	}, wait * 1000);
};
