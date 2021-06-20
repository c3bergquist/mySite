(function () {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

// Get canvas and context, set canvas size
var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');

var canvasHeight = canvas.offsetHeight,
	canvasWidth = canvas.offsetWidth;

var controls = {
	goDownPipe: false,
	jump: false,
	left: false,
	right: false
};

var friction = 0.9,
	gravity = 0.5,
	boxes = [],
	player = {
		x: 0,
		y: 0,
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
	sprite = {
		height: 100,
		width: 100,
		x: 538,
		y: 0
	};

player.image.src = './images/marioMe_sprites.png';

// Floor
boxes.push({
	x: -5,
	y: canvasHeight - 125,
	width: canvasWidth + 10,
	height: 10
});

var firstPipe = (canvasWidth / 2) - 200;

// Pipes
boxes.push({
	x: firstPipe,
	y: canvasHeight - 116,
	width: 96,
	height: 116
});
boxes.push({
	x: firstPipe + 250,
	y: canvasHeight - 116,
	width: 96,
	height: 116
});
boxes.push({
	x: firstPipe + 500,
	y: canvasHeight - 116,
	width: 96,
	height: 116
});

function update() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawPlayer();

	if (!player.goingDownPipe) {
		if (controls.jump) {
			if (!player.jumping) {
				player.velY = -player.jumpForce * 2;
				player.jumping = true;
			}
		}

		if (controls.right) {
			player.direction = 1;

			if (player.velX < player.speed) {
				player.velX++;
			}
		}

		if (controls.left) {
			player.direction = 0;

			if (player.velX > -player.speed) {
				player.velX--;
			}
		}

		player.x += player.velX;
		player.y += player.velY;

		player.velX *= friction;
		player.velY += gravity;
	
		player.grounded = false;
		for (var i = 0; i < boxes.length; i++) {
			var direction = colliderCheck(boxes[i]);

			if (direction == "left" || direction == "right") {
				player.velX = 0;
			} else if (direction == "bottom") {
				player.jumping = false;
				player.grounded = true;

				if(i > 0 && controls.goDownPipe) {
					goDownPipe(i, boxes[i]);
				}
			} else if (direction == "top") {
				player.velY *= -1;
			}
		}

		if (player.grounded) {
			player.velY = 0;
		}

		if (player.x >= canvasWidth - player.width) {
			player.x = canvasWidth - player.width;
		}
		else if (player.x <= 0) {
			player.x = 0;
		}
	}

	requestAnimationFrame(update);
}

function rebuildWorld() {
	canvasHeight = canvas.offsetHeight;
	canvasWidth = canvas.offsetWidth;
	
	// Floor
	boxes[0].x = -5;
	boxes[0].y = canvasHeight;
	boxes[0].width = canvasWidth + 10;
	boxes[0].height = 10;

	var firstPipe = (canvasWidth / 2) - 200;
	
	// Pipes
	boxes[1].x = firstPipe;
	boxes[1].y = canvasHeight - 116;
	boxes[1].width = 96;
	boxes[1].height = 116;
	
	boxes[2].x = firstPipe + 250;
	boxes[2].y = canvasHeight - 116;
	boxes[2].width = 96;
	boxes[2].height = 116;

	boxes[3].x = firstPipe + 500;
	boxes[3].y = canvasHeight - 116;
	boxes[3].width = 96;
	boxes[3].height = 116;
	
	ctx.canvas.height = canvasHeight;
	ctx.canvas.width = canvasWidth;
}

function respawn() {
	player.x = 130;
	player.y = canvasHeight - 125;
	player.direction = 1;
	player.grounded = false;
}

function drawPlayer() {
	setSprite();
	ctx.drawImage(player.image, sprite.x, 0, sprite.width, sprite.height, player.x, player.y, player.width, player.height);
}
 
function colliderCheck(platform) {
	var vectorX = (player.x + (player.width/2)) - (platform.x + (platform.width/2));
	var vectorY = (player.y + (player.height/2)) - (platform.y + (platform.height/2));

	var halfWidths = (player.width/2) + (platform.width/2);
	var halfHeights = (player.height/2) + (platform.height/2);

	var collisionDirection = null;

	if(Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights){
		var offsetX = halfWidths - Math.abs(vectorX);
		var offsetY = halfHeights - Math.abs(vectorY);
		if(offsetX < offsetY){
			if (vectorX > 0){
				collisionDirection = "left";
				player.x += offsetX;
			} else {
				collisionDirection = "right";
				player.x -= offsetX;
			}
		} else {
			if (vectorY > 0){
				collisionDirection = "top";
				player.y += offsetY;
			} else {
				collisionDirection = "bottom";
				player.y -= offsetY;
			}
		}
	}

	return collisionDirection;
}

var counter = 0;

function setSprite() {
	if (!player.jumping) {
		if (player.velX > 0 && controls.left) { // Pressing left while moving right
			stopRight();
		} else if (player.velX > 1) { // Running right or slowing down facing right
			runRight();
		} else if (player.velX < -1 && controls.right) { // Pressing right while moving left
			stopLeft();
		} else if (player.velX < -1) { // Running left or slowing down facing left
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
		if (player.direction == 1) {
			sprite.x = 1375;
		} else {
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
				window.open('./resume.html', '_blank');
				window.location.reload(); 
			}, 1150);
	}
}

window.addEventListener('keydown', function (e) {
	if (e.code == 'KeyS' || e.code == 'ArrowDown') {
		e.preventDefault();

		controls.goDownPipe = true;
	}

	if (e.code == 'KeyW' || e.code == 'ArrowUp') {
		e.preventDefault();

		controls.jump = true;
	}

	if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
		e.preventDefault();

		controls.left = true;
	}

	if (e.code == 'KeyD' || e.code == 'ArrowRight') {
		e.preventDefault();

		controls.right = true;
	}
});
 
window.addEventListener('keyup', function (e) {
	if (e.code == 'KeyS' || e.code == 'ArrowDown') {
		controls.goDownPipe = false;
	}

	if (e.code == 'KeyW' || e.code == 'ArrowUp') {
		e.preventDefault();

		controls.jump = false;
	}

	if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
		e.preventDefault();

		controls.left = false;
	}

	if (e.code == 'KeyD' || e.code == 'ArrowRight') {
		e.preventDefault();

		controls.right = false;
	}
});
 
window.addEventListener('load', function () {
	rebuildWorld();
	
	respawn();
	update();
});

window.addEventListener('resize', function() {
	rebuildWorld();
	
	respawn();
});