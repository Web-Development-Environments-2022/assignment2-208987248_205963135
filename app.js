var context;
var pacmanLocation = new Object();
var boardGame;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var curColor5;
var curColor15;
var curColor25;
var pacman;
var ghostsColors;
var ghostIndex = 0;
var ghostLocation;
var ghostsArray;


$(document).ready(function() {
	context = canvas.getContext("2d");
	$(window).keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
		}
	  });
	switchScreens("homeScreen")
	// Start();
	addK();
});

function Start() {
	boardGame = new Board(20, 20)
	board = boardGame.generateaBoard()
	startAgain();
}

function startAgain(){
	ghostsColors = ["ORANGE", "RED", "PINK", "GREEN"];
	ghostLocation = [[1,1], [1,18], [18,1], [18,18]];
	ghostsColors = ghostsColors.slice(0,curNumOfMonsters);
	ghostsArray = new Array();
	for(let i=0;i<curNumOfMonsters;i++){
		ghostsArray.push(new Ghost(ghostsColors[i], ghostLocation[i][0], ghostLocation[i][1]));
	}
	curColor5 = newColor5;
	curColor15 = newColor15;
	curColor25 = newColor25;
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	pacman = new Pacman();
	Draw();
	intervalGhost = setInterval(updateGhostPosition, 375);
	interval = setInterval(UpdatePosition, 125);
}

function GetKeyPressed() {
	if (keysDown[curKeyNumUp]) {
		return "UP";
	}
	if (keysDown[curKeyNumDown]) {
		return "DOWN";
	}
	if (keysDown[curKeyNumLeft]) {
		return "LEFT";
	}
	if (keysDown[curKeyNumRight]) {
		return "RIGHT";
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	canvas.style.border = '1px solid #000000'
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < boardGame.colNum; i++) {
		for (var j = 0; j < boardGame.rowNum; j++) {
			var center = new Object();
			center.x = i * 30 + 15;
			center.y = j * 30 + 15;
			if (board[i][j] == "Pacman") {
				pacmanLocation.i = i;
				pacmanLocation.j = j;
				pacman.drawPacman(center);
			} 
			else if (board[i][j] == "Food5") {
				context.beginPath();
				context.arc(center.x, center.y, 3, 0, 2 * Math.PI); // circle
				context.fillStyle = curColor5; //color
				context.fill();
			} 
			else if (board[i][j] == "Food15") {
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = curColor15; //color
				context.fill();
			}
			else if (board[i][j] == "Food25") {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle = curColor25; //color
				context.fill();
			}
			else if (board[i][j] == "Wall") {
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == "Ghost") {
				// console.log(monstersArray[ghostIndex]);
				// let newGhost = new Ghost(ghostsArray[ghostIndex++], center)
				// newGhost.drawGhost();
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30);
				context.fillStyle = "red"; //color
				context.fill();
				// let newGhost = new Ghost(ghostsArray[ghostIndex++], center)
				// newGhost.drawGhost();
			}
		}
	}
}

function updateGhostPosition(){
	for(let i=0;i<curNumOfMonsters;i++){
		newGhostLocation = ghostsArray[i].calculateDistance(pacmanLocation.i, pacmanLocation.j);
		board[ghostsArray[i].colPosition][ghostsArray[i].rowPosition] = ghostsArray[i].prevCellValue;
		console.log(newGhostLocation);
		ghostsArray[i].prevCellValue = board[newGhostLocation[0]][newGhostLocation[1]];
		ghostsArray[i].colPosition = newGhostLocation[0];
		ghostsArray[i].rowPosition = newGhostLocation[1];
		board[ghostsArray[i].colPosition][ghostsArray[i].rowPosition] = "Ghost";
	}
	Draw();
}

function UpdatePosition() {
	if (pacmanLocation.i==undefined || pacmanLocation.j==undefined){
		return
	}
	board[pacmanLocation.i][pacmanLocation.j] = "Empty";
	var x = GetKeyPressed();
	if (x == "UP") {
		pacman.direction = "UP";
		if (pacmanLocation.j > 0 && board[pacmanLocation.i][pacmanLocation.j - 1] != "Wall") {
			pacmanLocation.j--;
		}
	}
	if (x == "DOWN") {
		pacman.direction = "DOWN";
		if (pacmanLocation.j < (boardGame.rowNum - 1) && board[pacmanLocation.i][pacmanLocation.j + 1] != "Wall") {
			pacmanLocation.j++;
		}
	}
	if (x == "LEFT") {
		pacman.direction = "LEFT";
		if (pacmanLocation.i > 0 && board[pacmanLocation.i - 1][pacmanLocation.j] != "Wall") {
			pacmanLocation.i--;
		}
	}
	if (x == "RIGHT") {
		pacman.direction = "RIGHT";
		if (pacmanLocation.i < (boardGame.colNum - 1) && board[pacmanLocation.i + 1][pacmanLocation.j] != "Wall") {
			pacmanLocation.i++;
		}
	}
	if (board[pacmanLocation.i][pacmanLocation.j] == "Food5") {
		score += 5;
	}
	else if (board[pacmanLocation.i][pacmanLocation.j] == "Food15") {
		score += 15;
	}
	else if (board[pacmanLocation.i][pacmanLocation.j] == "Food25") {
		score += 25;
	}
	if (board[pacmanLocation.i][pacmanLocation.j] == "Ghost"){
		pacman.livesLeft--;
		score -= 10;
		board[pacmanLocation.i][pacmanLocation.j] = "Empty";
		console.log(pacman.livesLeft);
		window.clearInterval(interval);
		restartGame();
	}
	board[pacmanLocation.i][pacmanLocation.j] = "Pacman";
	
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }
	// TODO change the alert window in game over modal
	// if (time_elapsed > curMaxGameTime && score >= 100) { //todo change to num of total points
	// 	// window.clearInterval(interval);
	// 	window.alert("Winner");
	// 	window.clearInterval(interval);
	// 	switchScreens("settingScreen");
	// 	return;
	// }
	// else if(time_elapsed > curMaxGameTime && score < 100){
	// 	// window.clearInterval(interval);
	// 	window.alert("You are better than " + score + " points!");
	// 	window.clearInterval(interval);
	// 	switchScreens("settingScreen");
	// 	return;
	// }
	// else 
	if(pacman.livesLeft == 0){
		// window.clearInterval(interval);
		window.alert("Loser!");
		window.clearInterval(interval);
		switchScreens("settingScreen");
		return;
	}
	else {
		Draw();
	}
}

function switchScreens(screenId, settingScreen=false){
    // if (pacman != undefined){
    //     resetGame();
    // }
    hideScreens();
    $('#'+screenId).show();
    $('#'+screenId).focus();
	if(settingScreen){
		$('#settingScreen').show();
	}
};

function hideScreens(){
    $(".screen").hide();
}

function restartGame(){
	window.clearInterval(intervalGhost);
	window.clearInterval(interval);
	emptyCell = boardGame.getRandomEmptyCell();
	board[emptyCell[0]][emptyCell[1]] = "Pacman";
	restartGhost();
	startAgain();
}

function restartGhost(){
	ghostLocation = [[1,1], [1,18], [18,1], [18,18]];
	// ghostLocation = ghostLocation.slice(0, curNumOfMonsters);
	var index = 0;
	for (var i = 0; i < boardGame.colNum; i++) {
		for (var j = 0; j < boardGame.rowNum; j++) {
			if(board[i][j] == "Ghost"){
				board[i][j] = "Empty";
			}
			if(index < curNumOfMonsters && i == ghostLocation[index][0] && j == ghostLocation[index][1]){
				board[i][j] = "Ghost"; //ghost
				index++;
			}
		}
	}
}