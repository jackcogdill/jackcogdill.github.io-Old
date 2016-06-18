<?php
header('Content-Type: text/html; charset=utf-8');
?>

<html><head>
<style>

html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    overflow: hidden;
}

#q {
	margin: 0 auto;
	display: block;
}
</style>
</head><body>
<canvas id='q'></canvas>
<script type='text/javascript'>

normal    = '#5CFF5C',
brighter  = '#8F8',
brightest = '#AFA';
opaque    = 0.045;

// Full width
// alpha     = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// alpha     = '０１２３４５６７８９アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
// apart     = 1.5; // Space between raindrops (multiple of single drop width)
// f         = 12; // Fontsize
// speed     = 27;

// Half width
alpha     = '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
apart     = 1.25;
f         = 14; // Fontsize
speed     = 34;

window.onload = setTimeout(draw = function() {
	drops = [];

	w = q.width  = window.innerWidth  - 4;
	h = q.height = window.innerHeight - 4;
	total_drops = w / (f * apart);

	ctx = q.getContext('2d');
	function reset_shadow() {
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
	}

	for (i = 0; i < total_drops; i++) {
		// drops[i] = Math.floor(Math.random() * ((i % 3 == 0) ? h: -h));
		drops[i] = Math.floor(Math.random() * -h); // start randomly above screen
	}

	rain = setInterval(function(){
		ctx.font = f + 'pt sans-serif';
		reset_shadow();

		ctx.fillStyle = 'rgba(0, 0, 0, '+ opaque +')';
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = normal;

		drops.map(function(v, i){
			if (i > 0 && i % (9 + Math.floor(Math.random() * (drops.length - 9) +1)) == 0) {
				if (i % 2 == 0) {
					ctx.shadowColor = '#fff';
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 12;
					ctx.fillStyle = brightest;
				}
				else {
					reset_shadow();
					ctx.fillStyle = brighter;
				}
			}
			else {
				reset_shadow();
				ctx.fillStyle = normal;
			}
			
			ctx.fillText(alpha.charAt(Math.floor(Math.random() * alpha.length)), i * (f * apart), v);
			max = h/opaque*0.03,
			min = h/opaque*0.0225;
			drops[i] = (
				v > (min+ Math.floor(Math.random() * (max - min) +1) + Math.random() * (h/opaque/2))
			) ? 0: v + (f * 1.15);
		});
	}, speed);
}, 1337);

</script>
</body></html>
