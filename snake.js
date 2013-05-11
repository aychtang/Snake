var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var size = 500; // Canvas size of square in px.
var gridSize = 10; // Size of each square in grid system.
canvas.width = canvas.height = size;
var snake;
var food;
var gameLoop;
var direction;

var makeSnake = function(length) {
	var snake = []; // Array that simulates snake.

	// Add a block to the snake until it matches the length.
	for (var i = length; i > 0; i--) {
		snake.push({x: i, y : 0});
	}

	return snake;
};

// Returns new food object at random position within gameBoard.
var makeFood = function() {
	return {
		x: ~~(Math.random() * (size - gridSize) / gridSize),
		y: ~~(Math.random() * (size - gridSize) / gridSize)
	};
};

// Renders board.
var drawBoard = function(boardSize) {
	context.fillStyle = "pink";
	context.fillRect(0, 0, boardSize, boardSize);
};

// Draws cell at grid coord passed in.
var drawCell = function(x, y) {
	context.fillStyle = 'blue';
	context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
};

var drawSnake = function() {
	for (var i = snake.length - 1; i > 0; i--) {
		drawCell(snake[i].x, snake[i].y);
	}
};

var move = function () {
	var nextX = snake[0].x;
	var nextY = snake[0].y;

	if (direction === 'right') nextX++;
	if (direction === "left")	{ nextX--; };
	if (direction === "up")   	{ nextY--; };
	if (direction === "down") 	{ nextY++; };

	// Moving and eating logic.
	if (nextX === food.x && nextY === food.y) {
		var tail = {x: nextX, y: nextY};
		makeFood();
	} else {
		var tail = snake.pop();
		tail.x = nextX;
		tail.y = nextY;
	}

	// Gameover.
	if (nextX < 0 || nextX > (size / gridSize) || nextY < 0 || nextY > (size / gridSize)) {
		initialise();
		return;
	}

	snake.unshift(tail); // Pop tail from end and put to front.
};

// Main gameloop.
var main = function() {
	drawBoard(size);
	drawCell(food.x, food.y);
	move();
	drawSnake();
};

// Initialise snake and food, and kick off gameloop.
var initialise = function() {
	direction = 'right';
	drawBoard(size);
	snake = makeSnake(7);
	food = makeFood();

	// Handles gameloop ignition.
	if (gameLoop && gameLoop.constructor) {clearInterval(gameLoop);}
	gameLoop = setInterval(main, 18);
};

initialise();

$(document).keydown(function(e) {
	var key = e.which;
	if (key === 37 && direction !== "right") { direction = "left"; }
	if (key === 38 && direction !== "down") { direction = "up"; }
	if (key === 39 && direction !== "left") { direction = "right"; }
	if (key === 40 && direction !== "up") { direction = "down"; }
});
