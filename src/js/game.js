//------------------------------------------------------------------------------------
//
//	StartGame Class
//
//	Description: To initialize the Visual IDE
//
//------------------------------------------------------------------------------------
//	Constant variables for each command
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

COMMANDS.push( CMD_MOVE_RIGHT);
COMMANDS.push( CMD_MOVE_LEFT);
COMMANDS.push( CMD_SET_X );
COMMANDS.push( CMD_SET_Y );
COMMANDS.push( CMD_RESET_POSITION);
COMMANDS.push( CMD_JUMP);
COMMANDS.push( CMD_HIDE);
COMMANDS.push( CMD_SHOW);
COMMANDS.push( CMD_REPEAT);
COMMANDS.push( CMD_REPEAT_FOREVER);
COMMANDS.push( CMD_IF);


var StartGame = function() {

	this.character = new Character("character_human");
	this.goal_object = new Goal("goal_object");
	
	/**
	 * Append all the dragable codes to the elements panel
	 */
	var addDragableCommands = function() {
		
		var dragDropElementTable = document.getElementById('allItems');
		for (text in COMMANDS) {
			if(COMMANDS[text] == CMD_SET_X || 
			   COMMANDS[text] == CMD_SET_Y || 
			   COMMANDS[text] == CMD_RESET_POSITION) {

			}
			else {
				var li_Element = document.createElement("li");
				li_Element.appendChild(document.createTextNode(COMMANDS[text]));
				li_Element.setAttribute("id", "id_" + COMMANDS[text]);
				li_Element.setAttribute("class", "class_" + COMMANDS[text]);
				dragDropElementTable.appendChild(li_Element);
			}
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
			left: randomX + "px",
		});
		
		inObj.setInitXY(randomX, randomY);
	}
	
	/**
	* Does the positioning of character and goal and 
	* adds all possible Commands to the element List (Library of commands).
	*/
	this.init = function() {
		setRandomObjectPosition(this.character, this.character.elementID, 0, 100, 0, 430);
		setRandomObjectPosition(this.goal_object, this.goal_object.elementID, 380, 480, 0, 510);

	},

	/**
	 * Checks if the character manage to reach the goal flag object
	 * @return: true if the character reaches the goal,
	 *			otherwise false
	 */
	this.isEndOfGame = function() {
		if (Math.abs($("#character_human").css("left") - goal_object.x_position) < 50 &&
			Math.abs($("#character_human").css("top") - goal_object.y_position) < 50)
			return true;
		return false;
	}

	this.resetCharacter = function() {
		this.character.resetPosition();
		
		$("#" + this.character.elementID).css({
			position: "absolute",
			top:  this.character.initYPos + "px",
			left: this.character.initXPos + "px",
		});
		this.character.showObject();
	}

	var mediaContentManager = new MediaContent();

	// Randomize the sprite for both background and character
	ChangeBackground(mediaContentManager.getArrBackgroundImages()[getRandomInteger(0, 6)]);
	ChangeCharacterCostume(mediaContentManager.getArrCharacterImages()[getRandomInteger(0, 4)]);
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
