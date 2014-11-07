//------------------------------------------------------------------------------------
//
//	StartGame Class
//
//	Description: To initialize the Visual IDE
//
//------------------------------------------------------------------------------------
//	Constant variables for each command
var COLLIDE_MIN = 150;
var GOAL_ACHIEVED = false;
var MAX_SCORE = 100;
var SCORE = 0;

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

var CHARACTER_MAX_Y = 470;
var CHARACTER_MIN_Y = 470;
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

    displayScore();

	this.musicOn = true;
	
	this.moveCommandObserver = new MoveCommandObserver();
	this.jumpCommandObserver = new JumpCommandObserver();
	this.showHideCommandObserver = new ShowHideCommandObserver();
	this.collisionObserver = new CollisionObserver();
	
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
		// Reset MAX_SCORE
		MAX_SCORE = 100;
		
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
	}

	/**
	 * Checks if the character manage to reach the goal flag object
     * default value of the third parameter should be Zero unless is jump command.
	 * @return: true if the character reaches the goal,
	 *			otherwise false
	 */
	this.isEndOfGame = function() {
        return isCollide(game.character, game.goal_object, 0);
	}

	this.resetCharacter = function() {
		this.character.resetPosition();
		this.character.showObject();
	}

	var mediaContentManager = new MediaContent();

	// Randomize the sprite for both background and character
	ChangeBackground(mediaContentManager.getArrBackgroundImages()[getRandomInteger(0, mediaContentManager.getNumBackgroundImages())]);
	ChangeCharacterCostume(mediaContentManager.getArrCharacterImages()[getRandomInteger(0, mediaContentManager.getNumCharacterImages())]);
}

// bounding Box collision detection.
var isCollide = function(player_obj, goal_obj, jump_step) {
    if (!GOAL_ACHIEVED) {

        var rect1 = {x: player_obj.getCurrentXPosition(), y: player_obj.getCurrentYPosition(), width: player_obj.getWidth(), height: player_obj.getHeight()}
        var rect2 = {x: goal_obj.getCurrentXPosition(), y: goal_obj.getCurrentYPosition(), width: goal_obj.getWidth() / 4, height: goal_obj.getHeight() / 4}

      /*  if(jump_step > 0) {
            for (i = 0; i < jump_step; i++) {
                rect1.y = player_obj.getYForJump(i+1);

                if (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.height + rect1.y > rect2.y) {
                    incrementScore(100);
                    console.log("Collided!!!")
                    return true;
                }
            }
                return false;
        }*/

        if(jump_step > 0)
            rect1.y = player_obj.getYForJump(jump_step);

        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            incrementScore();
            console.log("Collided!!!")
            return true;
        }
    }
        return false;
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
	this.arr_backgroundImages.push("img/Background-outerspace.jpg");
	this.arr_backgroundImages.push("img/Background-chess.jpg");
	this.arr_backgroundImages.push("img/Background-field.jpg");

	this.arr_buttonImages.push("img/recycle.png");
	this.arr_buttonImages.push("img/stop.png");
	this.arr_buttonImages.push("img/play.png");

	this.arr_characterImages.push("img/Character-bear.png");
	this.arr_characterImages.push("img/Character-snaillightblue.png");
	this.arr_characterImages.push("img/Character-snaildarkblue.png");
	this.arr_characterImages.push("img/Character-albert.png");

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
MediaContent.prototype.getNumBackgroundImages = function() { return this.arr_backgroundImages.length}
MediaContent.prototype.getNumCharacterImages = function() { return this.arr_characterImages.length}

var getScore = function()
{
    return SCORE;
}

var incrementScore = function()
{
    SCORE += MAX_SCORE;
}

var decreaseScore = function(value) {
	SCORE -= value;
	if(SCORE <= 0)
		SCORE = 0;
}

var increaseScore = function(value) {SCORE +=value;}

var decrementMaxScore = function(value)
{
	MAX_SCORE -= value;
}

var displayScore = function()
{
    var text = "Current Score: ";
    text += getScore();

    document.getElementById("score").innerHTML = text;
}

var respawnGoal = function()
{
    setRandomObjectPosition(game.goal_object, game.goal_object.elementID, GOAL_MIN_X, GOAL_MAX_X, GOAL_MIN_Y, GOAL_MAX_Y);
    GOAL_ACHIEVED = false;
    game.goal_object.showObject();
}

var promptNext = function() {
    var answer = confirm("Do you want to try again?");
    if (answer)
        respawnGoal();
    else {
        alert("Thank you for playing!");
        window.location="http://www.comp.nus.edu.sg";
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
