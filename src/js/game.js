//------------------------------------------------------------------------------------
//
//	StartGame Class
//
//	Description: To initialize the Visual IDE
//
//------------------------------------------------------------------------------------
//	Constant variables for each command
var COLLIDE_MIN = 85;

var COMMANDS = [];
var CMD_MOVE_RIGHT = "Move_Right";
var CMD_MOVE_LEFT = "Move_Left";
var CMD_SET_X = "Set_X";
var CMD_SET_Y = "Set_Y";
var CMD_RESET_POSITION = "Reset_Position";
var CMD_JUMP = "Jump";
var CMD_HIDE = "Hide";
var CMD_SHOW = "Show";
var CMD_REPEAT = "Repeat";
var CMD_REPEAT_FOREVER = "Repeat_Forever";
var CMD_IF = "If";

var CHARACTER_MAX_Y = 430;
var CHARACTER_MIN_Y = 0;
var CHARACTER_MAX_X = 440;
var CHARACTER_MIN_X = 0;

var GOAL_MAX_Y = 510;
var GOAL_MIN_Y = 0;
var GOAL_MAX_X = 380;
var GOAL_MIN_X = 480;

COMMANDS.push( CMD_MOVE_RIGHT);
COMMANDS.push( CMD_MOVE_LEFT);
COMMANDS.push( CMD_JUMP);
COMMANDS.push( CMD_HIDE);
COMMANDS.push( CMD_SHOW);
COMMANDS.push( CMD_REPEAT);
COMMANDS.push( CMD_REPEAT_FOREVER);
COMMANDS.push( CMD_IF);
COMMANDS.push( CMD_RESET_POSITION);

var IF_SELECT_PARA1_CHAR_X = "Character.X";

var IF_SELECT_PARA2_LESSER = "<";
var IF_SELECT_PARA2_GREATER = ">";
var IF_SELECT_PARA2_EQUAL = "=";

var IF_SELECT_PARA3_GOAL_X = "Goal.X";
var IF_SELECT_PARA3_RIGHTMOST = "RightMost";
var IF_SELECT_PARA3_LEFTMOST = "LeftMost";

var IF_SELECTS = [
	[IF_SELECT_PARA1_CHAR_X],
	[IF_SELECT_PARA2_LESSER,IF_SELECT_PARA2_GREATER,IF_SELECT_PARA2_EQUAL],
	[IF_SELECT_PARA3_GOAL_X,IF_SELECT_PARA3_RIGHTMOST,IF_SELECT_PARA3_LEFTMOST]
];

var IF_SELECT_PARA1_CHAR_X_EVALUATOR = "game.character.x_position";

var IF_SELECT_PARA2_LESSER_EVALUATOR = "<";
var IF_SELECT_PARA2_GREATER_EVALUATOR = ">";
var IF_SELECT_PARA2_EQUAL_EVALUATOR = "==";

var IF_SELECT_PARA3_GOAL_X_EVALUATOR = "game.goal_object.x_position";
var IF_SELECT_PARA3_RIGHTMOST_EVALUATOR = "CHARACTER_MAX_X";
var IF_SELECT_PARA3_LEFTMOST_EVALUATOR = "CHARACTER_MIN_X";

var IF_SELECTS_EVALUATOR = [
	[IF_SELECT_PARA1_CHAR_X_EVALUATOR],
	[IF_SELECT_PARA2_LESSER_EVALUATOR,IF_SELECT_PARA2_GREATER_EVALUATOR,IF_SELECT_PARA2_EQUAL_EVALUATOR],
	[IF_SELECT_PARA3_GOAL_X_EVALUATOR,IF_SELECT_PARA3_RIGHTMOST_EVALUATOR,IF_SELECT_PARA3_LEFTMOST_EVALUATOR]
];

var bgAudio;

var ToggleMusic = function(isMusicOn) {
	if(isMusicOn) {
		bgAudio.play();
	}
	else {
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}
}

var StartGame = function() {
	bgAudio = new Audio("audio/bg.m4a");
	bgAudio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	
	//bgAudio.play();
	
	
	this.character = new Character("character_human");
	this.goal_object = new Goal("goal_object");
	
	this.musicOn = true;
	
	this.moveCommandObserver = new MoveCommandObserver();
	this.jumpCommandObserver = new JumpCommandObserver();
	this.showHideCommandObserver = new ShowHideCommandObserver();
	
	/**
	 * Append all the dragable codes to the elements panel
	 */
	var addDragableCommands = function() {

		var dragDropElementTable = document.getElementById('allItems');
		for (text in COMMANDS) {
			var li_Element = document.createElement("li");
			li_Element.appendChild(document.createTextNode(COMMANDS[text]));
			li_Element.setAttribute("id", "id_" + COMMANDS[text]);
			li_Element.setAttribute("class", "class_" + COMMANDS[text]);
			dragDropElementTable.appendChild(li_Element);
			
		}
	}
	
	/**
	 * Generate a random integer between min and max
	 * @param min: minimum number. default value is 1
	 *		  max: maximum number. default value is 500
	 * @return a random integer point number
	 */
	var getRandomInteger = function(minValue, maxValue) {
		return Math.floor((Math.random() * maxValue) + minValue);
	}

	/**
	*  Creates random positions for any object
	*/	
	var setRandomObjectPosition = function(inObj, inObjID, minX, maxX, minY, maxY) {
		
		var randomX = getRandomInteger(0, maxX-minX) + minX;
		var randomY = getRandomInteger(0, maxY-minY) + minY;
		
		// Render the character according to the position		
		$("#" + inObjID).css({
			position: "absolute",
			top:  randomY + "px",
			left: randomX + "px"
		});
		
		inObj.setInitXY(randomX, randomY);
	}
	
	/**
	* Does the positioning of character and goal and 
	* adds all possible Commands to the element List (Library of commands).
	*/
	this.init = function() {
		setRandomObjectPosition(this.character, this.character.elementID, CHARACTER_MIN_X, CHARACTER_MAX_X, CHARACTER_MAX_Y-2, CHARACTER_MAX_Y);
		setRandomObjectPosition(this.goal_object, this.goal_object.elementID, GOAL_MIN_X, GOAL_MAX_X, GOAL_MIN_Y, GOAL_MAX_Y);
		addDragableCommands();
	},

	/**
	 * Checks if the character manage to reach the goal flag object
	 * @return: true if the character reaches the goal,
	 *			otherwise false
	 */
	this.isEndOfGame = function() {
          if(CountDistance() <= COLLIDE_MIN) {
              return true;
          }
        return false;



//		if (Math.abs($("#character_human").css("left") - goal_object.x_position) < 50 &&
//			Math.abs($("#character_human").css("top") - goal_object.y_position) < 50)
//			return true;
//		return false;
	}

	this.resetCharacter = function() {
		this.character.resetPosition();
		this.character.showObject();
	}

	var mediaContentManager = new MediaContent();

	// Randomize the sprite for both background and character
	ChangeBackground(mediaContentManager.getArrBackgroundImages()[getRandomInteger(0, 6)]);
	ChangeCharacterCostume(mediaContentManager.getArrCharacterImages()[getRandomInteger(0, 4)]);
}

var CountDistance = function()
{
    var goal_x = game.goal_object.getCurrentXPosition();
    var goal_y = game.goal_object.getCurrentYPosition();
    var char_x = game.character.getCurrentXPosition();
    var char_y = game.character.getCurrentYPosition();

    var resultX = char_x - goal_x;
    var resultY = char_y - goal_y;

    resultX *= resultX;
    resultY *= resultY;

    var distance = Math.sqrt(resultX+resultY);

    console.log("currX:"+ game.character.getCurrentXPosition());
    console.log("currY:"+ game.character.getCurrentYPosition());

    console.log("GoalX:" + game.goal_object.getCurrentXPosition());
    console.log("GoalY:" + game.goal_object.getCurrentYPosition());
    console.log("Distance: " + distance);

    return Math.round(distance);
}



//------------------------------------------------------------------------------------
// (Future Expansion) The functions below is meant to added menu items into the html 
// via javascript 
//------------------------------------------------------------------------------------
var insertAllItemsIntoMenu = function(mediaContent) {
	insertHomeItemsIntoMenu(mediaContent);
	insertBackgroundItemsIntoMenu(mediaContent);
	insertCharacterItemsIntoMenu(mediaContent);
}

var insertCharacterItemsIntoMenu = function(mediaContent) {
	var characterMenuElement = document.getElementById('id_MenuCharacterSelect');
	var images = mediaContent.getArrCharacterImages();
}

var insertBackgroundItemsIntoMenu = function(mediaContent) {

}

var insertHomeItemsIntoMenu = function(mediaContent) {

}

//------------------------------------------------------------------------------------
//
//	MediaContent Class
//
//	Description: To store the location for all media content such as image and
//				 audio files
//				 This is meant for future expansion where DOM elements are added 
//				 dynamically through javascript as well as references for other 
//				 classes
//------------------------------------------------------------------------------------

	function MediaContent() {
		this.arr_backgroundImages = [];
		this.arr_characterImages = [];
		this.arr_buttonImages = [];
		this.arr_soundEffects = [];
		this.goalImage;

		this.arr_backgroundImages.push("img/Background-wood.jpg");
		this.arr_backgroundImages.push("img/Background-beach.jpg");
		this.arr_backgroundImages.push("img/Background-forrest.jpg");
		this.arr_backgroundImages.push("img/Background-heaven.jpg");
		this.arr_backgroundImages.push("img/Background-machu.jpg");
		this.arr_backgroundImages.push("img/Background-moai.jpg");

		this.arr_buttonImages.push("img/recycle.png");
		this.arr_buttonImages.push("img/stop.png");
		this.arr_buttonImages.push("img/play.png");

		this.arr_characterImages.push("img/snail_1.png");
		this.arr_characterImages.push("img/snail_2.png");
		this.arr_characterImages.push("img/snail_3.png");
		this.arr_characterImages.push("img/albert.png");

		this.goalImage = "img/goal.png";

		this.arr_soundEffects.push("audio/cartoonhop,mp3");
		this.arr_soundEffects.push("audio/cartoonwalk.mp3");
	}

MediaContent.prototype.getArrBackgroundImages = function() {
	return this.arr_backgroundImages;
}
MediaContent.prototype.getArrCharacterImages = function() {
	return this.arr_characterImages;
}
MediaContent.prototype.getArrButtonImages = function() {
	return this.arr_buttonImages;
}
MediaContent.prototype.getSoundEffects = function() {
	return this.arr_soundEffects;
}
MediaContent.prototype.getGoalImages = function() {
	return this.goalImage;
}
