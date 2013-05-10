$(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");
	var width = document.width - 25;
	var height = document.height - 25;
	canvas.width = width;
	canvas.height = height;

	// Game state variables.
	var cw = 10; // Cell width.
	var direction; // Direction of snake.
	var food;
	var score;
	var gameLoop;

	var snakeArray; // Array of cells which make the snake.

	// Initialises a snake
	var makeSnake = function() {
		var snakeLength = 7;
		snakeArray = [];

		for (var i = 0; i < snakeLength; i++) {
			snakeArray.push({x: i, y: 0});
		}
	};

	// Places food at random position within game bounds.
	var makeFood = function() {
		food = {
			x : ~~(Math.random() * (width - cw) / cw),
			y : ~~(Math.random() * (height - cw) / cw)
		};
	};

	var paintCell = function(x, y, head) {
		var head = head || false;
		context.fillStyle = 'turquoise';
		if (head) {context.fillStyle = 'red';
		context.fillRect(x * cw, y * cw, cw, cw);
	};

	var render = function() {
		// Renders game board
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		var nextX = snakeArray[0].x;
		var nextY = snakeArray[0].y;
		if (direction === "right") nextX++;
		if (direction === "left") nextX--;
		if (direction === "up") nextY--;
		if (direction === "down") nextY++;

		// If eaten food, add another block to snake, otherwise move as normal.
		if (nextX === food.x && nextY === food.y) {
			var tail = {x: nextX, y: nextY};
			score++;
			makeFood();
		} else {
			var tail = snakeArray.pop();
			tail.x = nextX; 
			tail.y = nextY;
		}

		// Put tail to front.
		snakeArray.unshift(tail);

		// Game over.
		if (nextX < 0 || nextX >= (canvas.width / cw) || nextY < 0 || nextY >= (canvas.height / cw)) {
			alert('You ate ' + score + ' breakfasts!');
			initialise();
			return;
		}

		for (var i = 0; i < snakeArray.length; i++) {
			paintCell(snakeArray[i].x, snakeArray[i].y, snakeArray[i] === snakeArray[0]);
		}

		paintCell(food.x, food.y);
	};

	// Sets initial direction + score, creates first snake + food.
	var initialise = function() {
		direction = 'right';
		makeSnake();
		makeFood();
		score = 0;

		// Kicks off game loop.
		if (typeof gameLoop != "undefined") {clearInterval(gameLoop);}
		gameLoop = setInterval(render, 60);
	};

	initialise();

	$(document).keydown(function(e) {
		var key = e.which;
		if (key === 37 && direction !== "right") direction = "left";
		if (key === 38 && direction !== "down") direction = "up";
		if (key === 39 && direction !== "left") direction = "right";
		if (key === 40 && direction !== "up") direction = "down";
	});

});
