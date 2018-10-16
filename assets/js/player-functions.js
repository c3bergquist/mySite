(function () {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	doc = $(document),
	keys = [],
	friction = 0.9,
	gravity = 0.4,
	boxes = [],
	player = {
		x: 130,
		y: height-125,
		width: 75,
		height: 100,
		speed: 7,
		velX: 0,
		velY: 0,
		direction: 1, // 0 = left, 1 = right
		jumping: false,
		grounded: false,
		image: new Image()
	},
	pw = player.width,
	ph = player.height,
	sprite = {
		x: 538,
		y: 0,
		w: 82,
		h: 100
	},
	runTimer = 0;
	
player.image.src = 'assets/images/marioMe_sprites.png';

function update() {
	checkKeys();

	player.velX *= friction;

	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	
	drawText();
	if(height > 600) {
		ctx.drawImage(menuImg, (width/2)-(height/3), 100, (height/1.5), (height/3));
	}
	else {
		ctx.drawImage(menuImg, 75, 100, (height/1.5), (height/3));
	}
	
	//player.grounded = false;
	
	checkBoxes();
	
	setSprite();
	drawPlayer();
	

	
	if(player.grounded){
		player.velY = 0;
	}
	else {
		player.velY += gravity;
		player.y += player.velY;
	}
	player.x += player.velX;
	if (player.x >= width-player.width) {
		player.x = width-player.width;
	}
	else if (player.x <= 0) {
		player.x = 0;
	}
	
	requestAnimationFrame(update);
}

function checkKeys() {
	// A
	if (keys[65]) {
		player.direction = 0;

		if (player.velX > -player.speed) {
			player.velX -= 1;
		}
	}
	
	// D
	if (keys[68]) {
		player.direction = 1;
		
		if (player.velX < player.speed) {
			player.velX += 1;
		}
	}
	
	// W
	if (keys[87]) {
		if (!player.jumping && player.grounded) {
			player.jumping = true;
			player.grounded = false;
			player.velY = -player.speed * 2;
		}
	}
}

function drawText() {
	ctx.fillStyle = '#fff';
	ctx.font = 'bold 1.75em sans-serif';
	ctx.textBaseline = 'bottom';
	
	ctx.fillText('A/D = Left/Right', 50, 75);
	ctx.fillText('W = Jump', (width/2) - 75, 75);
	ctx.fillText('S = Crouch', width - 225, 75);
	
	ctx.font = 'bold 2.0em sans-serif';
	
	ctx.fillText('About', boxes[1].x, boxes[1].y - 100);
	ctx.fillText('Portfolio', boxes[2].x - 20, boxes[2].y - 100);
	ctx.fillText('Contact', boxes[3].x - 15, boxes[3].y - 100);
}

function drawPlayer() {
	ctx.drawImage(player.image, sprite.x, 0, sprite.w, ph, player.x, player.y, pw, ph);
}

function checkBoxes() {
	for (var i = 0; i < boxes.length; i++) {
		if(i == 0) {
			boxes[i].y = height;
		} else {
			boxes[i].y = height-116;
		}
		
		ctx.drawImage(pipeImg, boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

		var dir = colCheck(player, boxes[i]);

		if (dir === 'l' || dir === 'r') {
			player.velX = 0;
			player.jumping = false;
		}
		else if (dir === 'b') {
			player.grounded = true;
			player.jumping = false;
			
			if(i > 0 && keys[83]) {
				goDownPipe(i);
			}
		}
		else if (dir === 't') {
			player.velY *= -1;
		}
	}
}
 
function colCheck(shapeA, shapeB) {
	// get the vectors to check against
	var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
		vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
		// add the half widths and half heights of the objects
		hWidths = (shapeA.width / 2) + (shapeB.width / 2),
		hHeights = (shapeA.height / 2) + (shapeB.height / 2),
		colDir = null;
 
	// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
		// figures out on which side we are colliding (top, bottom, left, or right)
		var oX = hWidths - Math.abs(vX),
			oY = hHeights - Math.abs(vY);
		
		if (oX >= oY) {
			if (vY > 0) {
				colDir = 't';
				shapeA.y += oY;
			}
			else {
				colDir = 'b';
				shapeA.y -= oY;
			}
		}
		else {
			if (vX > 0) {
				colDir = 'l';
				shapeA.x += oX;
			}
			else {
				colDir = 'r';
				shapeA.x -= oX;
			}
		}
	}
	return colDir;
}

function setSprites() {
	sprites.push();
}


var counter = 0;

function setSprite() {
	if(!player.jumping) {
		if((Math.round(player.velX) > 0) || ((Math.round(player.velX) > 0) && (keys[68]))) { // Running right or slowing down facing right
			runRight();
		} else if((Math.round(player.velX) > 0) && (keys[65])) { // Pressing left while moving right
			stopRight();
		} else if((Math.round(player.velX) < 0) || ((Math.round(player.velX) > 0) && (keys[65]))) { // Running left or slowing down facing left
			runLeft();
		} else if((Math.round(player.velX) < 0) && (keys[68])) { // Pressing right while moving left
			stopLeft();
		} else { // No movement, check direction and set idle pose
			if(player.direction == 1) {
				sprite.x = 538;
			}else {
				sprite.x = 456;
			}
			
			counter = 0;
		}
	} else {
		if(player.direction == 1) {
			sprite.x = 968;
		}else {
			sprite.x = 0;
		}
	}
}

function runRight() {
	sprite.x = 620;
}

function stopRight() {
	sprite.x = 128;
}

function runLeft() {
	sprite.x = 374;
}

function stopLeft() {
	sprite.x = 866;
}

function goDownPipe(pipe) {
	var st = setInterval(function() {
			if(player.height > 0) {
				ph -= 1;
				player.height -= 1;
			}
		}, 10);

	if(pipe == '1') {
		setTimeout(function() {
				clearInterval(st);
				$('#about').goTo();
			}, 1150);
	}
	if(pipe == '2') {
		setTimeout(function() {
				clearInterval(st);
				$('#portfolio').goTo(); 
			}, 1150);
	}
	if(pipe == '3') {
		setTimeout(function() {
				clearInterval(st);
				$('#contact').goTo(); 
			}, 1150);
	}
}

(function($) {
    $.fn.goTo = function() {
        if($(this).offset().top) {
			$('html, body').animate({
				scrollTop: $(this).offset().top
			}, 3000, 'swing');
		}
        return this;
    }
})(jQuery);

$(window).on('scroll wheel DOMMouseScroll mousewheel', function(e) {
    if (e.which > 0 ||
        e.type === 'mousedown' ||
        e.type === 'mousewheel') {
        $('html, body').stop();
    }
	
	if(player.height == 0 && doc.scrollTop() < height) {
		player.y = -500;
		ph = 100;
		player.height = ph;
	}
});

canvas.addEventListener('click', function (e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    	
    for (var i = 1; i < boxes.length; i++) {
        if (clickedX > boxes[i].x && clickedX < boxes[i].x + boxes[i].width &&
			clickedY > boxes[i].y && clickedY < boxes[i].y + boxes[i].height) {
            if(i == 1) {
				$('#about').goTo();
			}
			if(i == 2) {
				$('#portfolio').goTo();
			}
			if(i == 3) {
				$('#contact').goTo();
			}
        }
    }
});

window.addEventListener('keydown', function (e) {
	if(e.keyCode == 65 || e.keyCode == 68 || e.keyCode == 83 || e.keyCode == 87) {
		if(doc.scrollTop() < height) {
			e.preventDefault();
			keys[e.keyCode] = true;
			
			if(e.keyCode == 65) {
				keys[68] = false;
			}
			if(e.keyCode == 68) {
				keys[65] = false;
			}
			if(e.keyCode == 83) {
				keys[65] = false;
				keys[68] = false;
			}
		}
	}
});
 
window.addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});
 
window.addEventListener('load', function () {
	update();
});

window.addEventListener('resize', function() {
	player.y += window.innerHeight-125 - height;

	width = window.innerWidth-17;
	height = window.innerHeight-125;

	canvas.width = width;
	canvas.height = height;
});