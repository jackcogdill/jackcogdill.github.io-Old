var normal    = '#5CFF5C';
var brighter  = '#8F8';
var brightest = '#AFA';
var opaque    = 0.045;

var alpha     = '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
var hspce     = 1.25; // Horizontal spacing between glyphs
var vspce     = 1.2;  // Vertical spacing between glyphs
var fsize     = 14;   // Fontsize
var speed     = 34;

window.onload = setTimeout(function(){
	var drops = [];

	var w = q.width  = window.innerWidth;
	var h = q.height = window.innerHeight;
	var total_drops = Math.floor( w / (fsize * hspce) );

	var ctx = q.getContext('2d');
	function reset_shadow() {
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
	}

	for (var i = 0; i < total_drops; i++) {
		drops[i] = Math.floor( Math.random() * -h ); // Start randomly above screen
	}

	var rain = setInterval(function(){
		ctx.font = fsize + 'pt Roboto Mono, sans-serif';
		reset_shadow();

		ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = normal;

		drops.map(function(y, i){
			// Add random glowing glyphs
			// (~5% chance)
			if (Math.random() > 0.95) {
				// Glowing white glyphs (white shadow)
				if (Math.random() > 0.5) {
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
			drops[i] = (y > h + Math.random() * h * 2 / 3 )
				? 0                    // Reset raindrops at top of screen
				: y + (fsize * vspce); // Advance down the screen
		});
	}, speed);
}, 1337);
