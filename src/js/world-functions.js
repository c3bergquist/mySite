(function () {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById('world'),
	ctx = canvas.getContext('2d'),
	doc = $(document),
	width = window.innerWidth,
	height = window.innerHeight - 125,
	keys = [],
	friction = 0.9,
	gravity = 0.5,
	boxes = [],
	player = {
		x: 130,
		y: height - 125,
		width: 100,
		height: 100,
		speed: 7,
		jumpForce: 7,
		velX: 0,
		velY: 0,
		direction: 1, // 0 = left, 1 = right
		jumping: false,
		goingDownPipe: false,
		grounded: false,
		image: new Image()
	},
	pw = player.width,
	ph = player.height,
	sprite = {
		x: 538,
		y: 0,
		w: 100,
		h: 100
	},
	runTimer = 0;

player.image.src = './src/images/marioMe_sprites.png';

// Floor
boxes.push({
	x: -5,
	y: height,
	width: width+10,
	height: 10
});

var firstPipe = (width / 2) - 200;

// Pipes
boxes.push({
	x: firstPipe,
	y: height - 116,
	width: 96,
	height: 116
});
boxes.push({
	x: firstPipe + 250,
	y: height - 116,
	width: 96,
	height: 116
});
boxes.push({
	x: firstPipe + 500,
	y: height - 116,
	width: 96,
	height: 116
});
 
canvas.width = width;
canvas.height = height;

ctx.save();

function update() {
	if (!player.goingDownPipe) {
		checkKeys();
	}

	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
		
	player.grounded = false;
	
	setSprite();
	drawPlayer();
	
	drawBoxes();
	
	if (!player.goingDownPipe) {
		checkBoxes();
	}
	
	if (player.velX > 0.9 || player.velX < -0.9) {
		player.velX *= friction;
	} else {
		player.velX = 0;
	}
	
	if (player.grounded){
		player.velY = 0;
	} else {
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

function rebuildWorld() {
	var width = window.innerWidth,
		height = window.innerHeight - 125;
		
	// Floor
	boxes[0].x = -5;
	boxes[0].y = height;
	boxes[0].width = width + 10;
	boxes[0].height = 10;

	var firstPipe = (width / 2) - 200;
	
	// Pipes
	boxes[1].x = firstPipe;
	boxes[1].y = height - 116;
	boxes[1].width = 96;
	boxes[1].height = 116;
	
	boxes[2].x = firstPipe + 250;
	boxes[2].y = height - 116;
	boxes[2].width = 96;
	boxes[2].height = 116;

	boxes[3].x = firstPipe + 500;
	boxes[3].y = height - 116;
	boxes[3].width = 96;
	boxes[3].height = 116;	
}

function respawn() {
	player.x = 130;
	player.y = height - 125;
	player.direction = 1;
	player.grounded = false;
}

function checkKeys() {
	// Left or A
	if (keys[37] || keys[65]) {
		player.direction = 0;
		
		if (player.velX <= 0 && player.velX > -player.speed) {
			player.velX -= 1;
		}
	}
	
	// Right or D
	if (keys[39] || keys[68]) {
		player.direction = 1;
		
		if (player.velX >= 0 && player.velX < player.speed) {
			player.velX += 1;
		}
	}
	
	// Up or W 
	if (keys[38] || keys[87]) {
		if (!player.jumping && player.grounded) {
			player.jumping = true;
			player.grounded = false;
			player.velY = -player.jumpForce * 2;
		}
	}
}

function drawPlayer() {
	ctx.drawImage(player.image, sprite.x, 0, sprite.w, ph, player.x, player.y, pw, ph);
}

function drawBoxes() {
	for (var i = 0; i < boxes.length; i++) {
		if (i == 0) {
			boxes[i].y = height;
		} else {
			boxes[i].y = height - 116;
		}
	}
}

function checkBoxes() {
	for (var i = 0; i < boxes.length; i++) {
		var dir = colCheck(player, boxes[i]);

		if (dir === 'l' || dir === 'r') {
			player.velX = 0;
		}
		
		if (dir === 'b') {
			player.grounded = true;
			player.jumping = false;
			
			if(i > 0 && (keys[40] || keys[83])) {
				goDownPipe(i, boxes[i]);
			}
		}
		
		if (dir === 't') {
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
		if(player.velX > 0 && (keys[37] || keys[65])) { // Pressing left while moving right
			stopRight();
		} else if(player.velX > 1) { // Running right or slowing down facing right
			runRight();
		} else if(player.velX < -1 && (keys[39] || keys[68])) { // Pressing right while moving left
			stopLeft();
		} else if(player.velX < -1) { // Running left or slowing down facing left
			runLeft();
		} else { // No movement, check direction and set idle pose
			if(player.direction == 1) {
				idleRight();
			} else {
				idleLeft();
			}
			
			counter = 0;
		}
	} else {
		if(player.direction == 1) {
			sprite.x = 1375;
		}else {
			sprite.x = 0;
		}
	}
}

function idleRight() {
	sprite.x = 750;
}

function idleLeft() {
	sprite.x = 625;
}

function runRight() {
	if (counter < 150) {
		counter = counter + (1 * player.velX);
	} else { 
		counter = 0;
	}
	
	if (counter <= 50) {
		sprite.x = 875;
	} else if (counter > 50 && counter <= 100) {
		sprite.x = 1000;
	} else if (counter > 100 && counter <= 150) {
		sprite.x = 1125;
	}
}

function stopRight() {
	sprite.x = 125;
}

function runLeft() {
	if (counter < 150) {
		counter = counter - (1 * player.velX);
	} else { 
		counter = 0;
	}
	
	if (counter <= 50) {
		sprite.x = 500;
	} else if (counter > 50 && counter <= 100) {
		sprite.x = 375;
	} else if (counter > 100 && counter <= 150) {
		sprite.x = 250;
	}
}

function stopLeft() {
	sprite.x = 1250;
}

function goDownPipe(number, pipe) {
	player.goingDownPipe = true;
		
	var st = setInterval(function() {
			gravity = 0;
			player.goingDownPipe = true;
			player.x = player.x - ((player.x - pipe.x) / 10);
			player.y += 1;
		}, 10);

	if(number == '1') {
		setTimeout(function() {
				clearInterval(st);
				window.location.href = './about.html';
			}, 1150);
	}
	if(number == '2') {
		setTimeout(function() {
				clearInterval(st);
				window.location.href = './portfolio.html';
			}, 1150);
	}
	if(number == '3') {
		setTimeout(function() {
				clearInterval(st);
				window.location.href = './contact.html';
			}, 1150);
	}
}

canvas.addEventListener('click touch', function (e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    	
    for (var i = 1; i < boxes.length; i++) {
        if (clickedX > boxes[i].x && clickedX < boxes[i].x + boxes[i].width &&
			clickedY > boxes[i].y && clickedY < boxes[i].y + boxes[i].height) {
            if(i == 1) {
				window.location.href = './about.html';
			}
			if(i == 2) {
				window.location.href = './portfolio.html';
			}
			if(i == 3) {
				window.location.href = './contact.html';
			}
        }
    }
});

window.addEventListener('keydown', function (e) {
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 ||
	   e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68 || e.keyCode == 87) {
		e.preventDefault();
		keys[e.keyCode] = true;
		
		// Left or A
		if(e.keyCode == 37 || e.keyCode == 65) {
			keys[39] = false;
			keys[68] = false;
		}
		
		// Right or D
		if(e.keyCode == 39 || e.keyCode == 68) {
			keys[37] = false;
			keys[65] = false;
		}
		
		// Down or S
		if(e.keyCode == 40 || e.keyCode == 83) {
			keys[37] = false;
			keys[65] = false;
			
			keys[39] = false;
			keys[68] = false;
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
	rebuildWorld();
	respawn();

	width = window.innerWidth;
	height = window.innerHeight - 125;

	canvas.width = width;
	canvas.height = height;
});