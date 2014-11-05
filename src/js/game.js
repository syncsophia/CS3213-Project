//------------------------------------------------------------------------------------
//
//	StartGame Class
//
//	Description: To initialize the Visual IDE
//
//------------------------------------------------------------------------------------
//	Constant variables for each command
var COLLIDE_MIN = 80;

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
var GOAL_MAX_X = 480;
var GOAL_MIN_X = 0;

COMMANDS.push( CMD_MOVE_RIGHT);
COMMANDS.push( CMD_MOVE_LEFT);
COMMANDS.push( CMD_SET_X); 
COMMANDS.push( CMD_SET_Y); 
COMMANDS.push( CMD_JUMP);
COMMANDS.push( CMD_HIDE);
COMMANDS.push( CMD_SHOW);
COMMANDS.push( CMD_REPEAT);
COMMANDS.push( CMD_REPEAT_FOREVER);
COMMANDS.push( CMD_IF);
COMMANDS.push( CMD_RESET_POSITION);

var IF_SELECT_PARA1_CHAR_X = "Character.X";
var IF_SELECT_PARA1_CHAR_Y = "Character.Y";

var IF_SELECT_PARA2_LESSER = "<";
var IF_SELECT_PARA2_GREATER = ">";
var IF_SELECT_PARA2_EQUAL = "=";

var IF_SELECT_PARA3_GOAL_X = "Goal.X";
var IF_SELECT_PARA3_GOAL_Y = "Goal.Y";
var IF_SELECT_PARA3_RIGHTMOST = "RightMost";
var IF_SELECT_PARA3_LEFTMOST = "LeftMost";

var IF_SELECT_PARA4_PLUS = "+";
var IF_SELECT_PARA4_MINUS = "-";
var IF_SELECT_PARA4_TIMES = "*";
var IF_SELECT_PARA4_DIVIDE = "/";

var IF_SELECTS = [
	[IF_SELECT_PARA1_CHAR_X, IF_SELECT_PARA1_CHAR_Y],
	[IF_SELECT_PARA2_LESSER,IF_SELECT_PARA2_GREATER,IF_SELECT_PARA2_EQUAL],
	[IF_SELECT_PARA3_GOAL_X,IF_SELECT_PARA3_GOAL_Y],
	[IF_SELECT_PARA4_PLUS,IF_SELECT_PARA4_MINUS,IF_SELECT_PARA4_TIMES,IF_SELECT_PARA4_DIVIDE]
];

var IF_SELECT_PARA1_CHAR_X_EVALUATOR = "game.character.getCurrentXPosition()";
var IF_SELECT_PARA1_CHAR_Y_EVALUATOR = "game.character.getCurrentYPosition()";

var IF_SELECT_PARA2_LESSER_EVALUATOR = "<";
var IF_SELECT_PARA2_GREATER_EVALUATOR = ">";
var IF_SELECT_PARA2_EQUAL_EVALUATOR = "==";

var IF_SELECT_PARA3_GOAL_X_EVALUATOR = "game.goal_object.getCurrentXPosition()";
var IF_SELECT_PARA3_GOAL_Y_EVALUATOR = "game.goal_object.getCurrentYPosition()";

var IF_SELECTS_EVALUATOR = [
	[IF_SELECT_PARA1_CHAR_X_EVALUATOR,IF_SELECT_PARA1_CHAR_Y_EVALUATOR],
	[IF_SELECT_PARA2_LESSER_EVALUATOR,IF_SELECT_PARA2_GREATER_EVALUATOR,IF_SELECT_PARA2_EQUAL_EVALUATOR],
	[IF_SELECT_PARA3_GOAL_X_EVALUATOR,IF_SELECT_PARA3_GOAL_Y_EVALUATOR],
	[IF_SELECT_PARA4_PLUS,IF_SELECT_PARA4_MINUS,IF_SELECT_PARA4_TIMES,IF_SELECT_PARA4_DIVIDE]
];

var bgAudio;

var StartGame = function() {

	StartGame.ToogleMusic = function() {
		this.musicOn = !this.musicOn;
		if(this.musicOn) {
			//bgAudio.play();
		}
		else {
			bgAudio.pause();
			bgAudio.currentTime = 0;
		}
	
		return this.musicOn;
	}
	
	StartGame.IsMusicOn = function() { return this.musicOn; }

	bgAudio = new Audio("audio/bg.m4a");
	bgAudio.volume = 0.2;
	bgAudio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	
	//bgAudio.play();
	
	
	this.character = new Character("character_human");
	this.goal_object = new Goal("goal_object");
    //this.goalArray = [];
	
	this.musicOn = true;
	
	this.moveCommandObserver = new MoveCommandObserver();
	this.jumpCommandObserver = new JumpCommandObserver();
	this.showHideCommandObserver = new ShowHideCommandObserver();
	
	StartGame.ToogleMusic();
	
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
	 * @param min: minimum number.
	 *		  max: maximum number.
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
     *  Populates goalArray with random number (1-5) of goal objects
     */
//    var fillGoalArray = function() {
//        var goalArray = [];
//        var goalNum = getRandomInteger(1,5);
//    
//        for (i = 0; i < goalNum; i++) {
//            //goalArray.push(new Goal("goal_object_" + i.toString));
//            goalArray.push(new Goal("goal_object"));
//        }
//        return goalArray;
//    }
    
    var fillGoalArray = function(goalArray) {
        var goalNum = getRandomInteger(1,5);
        
        for (i = 0; i < goalNum; i++) {
            //goalArray.push(new Goal("goal_object_" + i.toString));
            goalArray.push(new Goal("goal_object"));
        }
    }
    
    /**
     *  Generate goals
     */
    var generateGoals = function(goalArray) {
        for (goal in goalArray) {
            //console.log(goal.elementID);
            setRandomObjectPosition(goal, goal.elementID,
                GOAL_MIN_X, GOAL_MAX_X, GOAL_MIN_Y, GOAL_MIN_Y);
        }
    }
    
    /**
    * Determines the position of the goal depending on position of the character.
    * @return an array of goal coordinates
    */
    var setGoalCoordinates = function(char_x, char_y) {
        var goalMinX = GOAL_MIN_X;
        var goalMinY = GOAL_MIN_Y;
        var goalMaxX = GOAL_MAX_X;
        var goalMaxY = GOAL_MAX_Y;
        
        // Check character.x_position and set goal_object.x_position away from character
        if (char_x < CHARACTER_MAX_X/2) {
            goalMinX = char_x + COLLIDE_MIN;
        } else {
            goalMaxX = char_x - COLLIDE_MIN;
        }
        
        // Check character.y_position and set goal_object.y_position away from character
        if (char_y < CHARACTER_MAX_Y/2) {
            goalMinY = char_y + COLLIDE_MIN;
        } else {
            goalMaxY = char_y - COLLIDE_MIN;
        }
        
        return [goalMinX, goalMaxX, goalMinY, goalMaxY];
    }
    
	/**
	* Does the positioning of character and goal(s) and
	* adds all possible Commands to the element List (Library of commands).
	*/
	this.init = function() {
		setRandomObjectPosition(this.character, this.character.elementID, CHARACTER_MIN_X, CHARACTER_MAX_X, CHARACTER_MAX_Y-2, CHARACTER_MAX_Y);
        
        //console.log(this.character.getCurrentXPosition(), this.character.getCurrentYPosition());
        
        var goalCoordArray = setGoalCoordinates(this.character.getCurrentXPosition(), this.character.getCurrentYPosition());
        
        setRandomObjectPosition(this.goal_object, this.goal_object.elementID,
            goalCoordArray[0], goalCoordArray[1], goalCoordArray[2],goalCoordArray[3]);

        
        //console.log(this.goal_object.getCurrentXPosition(), this.goal_object.getCurrentYPosition());
        //console.log(CountDistance());
        
        //this.goalArray = fillGoalArray();
        //fillGoalArray(this.goalArray);
        //generateGoals(this.goalArray);
        
		addDragableCommands();
	},

	/**
	 * Checks if the character manage to reach the goal flag object
	 * @return: true if the character reaches the goal,
	 *			otherwise false
	 */
	this.isEndOfGame = function() {
          if(CountDistance(this.character, this.goal_object, this.character.getCurrentYPosition()) <= COLLIDE_MIN) {
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

// the x and y position of IObject is reference to the coordinate of the "top left" corner of the object
// hence, by adding half of the width/height to the top left will get the coordinate of the center of the object.
// the additional "player_y" parameter is prepare for the usage of "jump command" only, because the coordinate cannot
// be updated during .move
var CountDistance = function(player_obj, goal_obj, player_y)
{
    var goal_x = goal_obj.getCurrentXPosition() + goal_obj.getWidth()/2;
    var goal_y = goal_obj.getCurrentYPosition() + goal_obj.getHeight()/2;
    var char_x = player_obj.getCurrentXPosition() + player_obj.getWidth()/2;
    var char_y = player_y + player_obj.getHeight()/2;

    var resultX = char_x - goal_x;
    var resultY = char_y - goal_y;

    resultX *= resultX;
    resultY *= resultY;

    var distance = Math.sqrt(resultX+resultY);

    console.log("currX:"+ char_x);
    console.log("currY:"+ char_y);
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

		this.goalImage = "img/star.png";//"img/goal.png";

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
