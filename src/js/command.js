//------------------------------------------------------------------------------------
//
//	Command (Inteface) Class
//
//	Description: Interface for other commands to implement the execute function
//				 In general, the execute function animates the character
//
//------------------------------------------------------------------------------------
var Command = {
	execute: function() {}
}


//------------------------------------------------------------------------------------
//
//	MoveCommand (Implements Command)
//
//	Description: Command to move the character Left/Right given the step value
//
//------------------------------------------------------------------------------------
var MoveCommand = function(step) {
	this.step = step;
}
MoveCommand.prototype = Object.create(Command);
MoveCommand.prototype.execute = function() {    	
	game.character.move(this.step)
	//console.log("[command.js] MoveCommand.execute():  Moving: " + this.step);
}


//------------------------------------------------------------------------------------
//
//	JumpCommand (Implements Command)
//
//	Description: Command to move the character upwards given the step value
//
//------------------------------------------------------------------------------------
var JumpCommand = function(step) {
	this.step = step;
}
JumpCommand.prototype = Object.create(Command);
JumpCommand.prototype.execute = function() {
	game.character.jump(this.step);
	//console.log("[command.js] JumpCommand.execute():   Jumping: " + this.step);
}


//------------------------------------------------------------------------------------
//
//	SetXPosCommand (Implements Command)
//
//	Description: Command to set the x position/coordinates of the character
//
//------------------------------------------------------------------------------------
var SetXPosCommand = function(step) {
	this.step = step;
}
SetXPosCommand.prototype = Object.create(Command);
SetXPosCommand.prototype.execute = function() {
	game.character.placeObject(this.step, game.character.y_position);
	//console.log("[command.js] SetXPosCommand.execute(): Set X: " + this.step);
}


//------------------------------------------------------------------------------------
//
//	SetYPosCommand (Implements Command)
//
//	Description: Command to set the y position/coordinates of the character
//
//------------------------------------------------------------------------------------
var SetYPosCommand = function(step) {
	this.step = step;
}
SetYPosCommand.prototype = Object.create(Command);
SetYPosCommand.prototype.execute = function() {
	game.character.placeObject(game.character.x_position, this.step);
	//console.log("[command.js] SetYPosCommand.execute():  Set Y: " + this.step);
}


//------------------------------------------------------------------------------------
//
//	SetToOriginCommand (Implements Command)
//
//	Description: Command to set the character to the origin @ coordinates (0,0)
//				 w.r.t. the top left hand corner of the editor
//
//------------------------------------------------------------------------------------
var SetToOriginCommand = function() {

}
SetToOriginCommand.prototype = Object.create(Command);
SetToOriginCommand.prototype.execute = function() {
	game.character.resetPosition();
	//console.log("[command.js] SetToOriginCommand.execute():  Set to origin.");
}


//------------------------------------------------------------------------------------
//
//	HideCommand (Implements Command)
//
//	Description: Command to hide the character
//
//------------------------------------------------------------------------------------
var HideCommand = function() { 

}
HideCommand.prototype = Object.create(Command);
HideCommand.prototype.execute = function() {
	game.character.hideObject();
	//console.log("[command.js] HideCommand.execute():  Hide character");
}


//------------------------------------------------------------------------------------
//
//	ShowCommand (Implements Command)
//
//	Description: Command to display/unhide the character
//
//------------------------------------------------------------------------------------
var ShowCommand = function() {

}
ShowCommand.prototype = Object.create(Command);
ShowCommand.prototype.execute = function() {
	game.character.showObject();
	//console.log("[command.js] ShowCommand.execute():  Show character");
}


//------------------------------------------------------------------------------------
//
//	RepeatForeverCommand (Implements Command)
//
//	Description: Command to loop the given list of commands infinitely
//
//------------------------------------------------------------------------------------
var RepeatForeverCommand = function(list_CommandObjects) {
	this.cmdList = list_CommandObjects;
	this.numRepeatCommands = list_CommandObjects.length;
	this.hasBeenInterrupted = false;
}
RepeatForeverCommand.prototype = Object.create(Command);
RepeatForeverCommand.prototype.execute = function() {
	hasBeenInterrupted = false;
	
	var delay = 1500;
	var i = 0;
	
	var cmdList = this.cmdList;
	
	// setInterval has no clue of this class's variables. i.e. cmdList
	var t1 = setInterval( function() {
		CommandProcessor.notify(cmdList[i]);
		cmdList[i].execute();
		i++;
		if(i >= cmdList.length) { i = 0; }
		if(hasBeenInterrupted) { clearInterval(t1); }
	}, delay);		
}
RepeatForeverCommand.prototype.Interrupt = function() { hasBeenInterrupted = true; }


//------------------------------------------------------------------------------------
//
//	RepeatCommand (Implements Command)
//
//	Description: Command to loop the given list of commands by n # of iterations
//
//------------------------------------------------------------------------------------
var RepeatCommand = function(step, list_CommandObjects) {
	this.step = step;
	this.cmdList = list_CommandObjects;
	this.numRepeatCommands = list_CommandObjects.length;
	this.hasBeenInterrupted = false;
}
RepeatCommand.prototype = Object.create(Command);
RepeatCommand.prototype.execute = function() {
		hasBeenInterrupted = false;

		var delay = 1500;
		var n_Repeat = 0;
		var i = 0;
		
		var numIterations = this.step;
		var cmdList = this.cmdList;
		
		// setInterval has no clue of this class's variables. i.e. step, cmdList
		var t1 = setInterval( function() {
			CommandProcessor.notify(cmdList[i]);
			cmdList[i].execute();
			i++;
			if(i >= cmdList.length) { i = 0; n_Repeat++; }
			if (n_Repeat > numIterations || hasBeenInterrupted) clearInterval(t1);
			
		}, delay);
}
RepeatCommand.prototype.getNumRepeatCommands = function() { return this.numRepeatCommands; }
RepeatCommand.prototype.Interrupt = function() { hasBeenInterrupted = true; }


//------------------------------------------------------------------------------------
//
//	IfCommand (Implements Command)
//
//	Description: Command that performs conditional checks before proceeding with 
//				 next function
//
//------------------------------------------------------------------------------------
var IfCommand = function(para1, para2, para3, nextCommandObj) {
	this.para1 = para1;
	this.para2 = para2;
	this.para3 = para3;
	
	//console.log(para1 + " " + para2 + " " + para3);
		
	this.nextCommandObj = nextCommandObj;
	//console.log(game.character.x_position);
	var getIfSelectEvaluators = function(s, para) {
		for(var i=0; i < IF_SELECTS[s].length; i++)
			if (para == IF_SELECTS[s][i])
				return IF_SELECTS_EVALUATOR[s][i];
	}
	
//	var ifBitMask = 0;
// 	var para1Bit = getBit(0,para1);
// 	var para2Bit = getBit(1,para2);
// 	var para3Bit = getBit(2,para3);
	
	var para1E = getIfSelectEvaluators(0,para1);
 	var para2E = getIfSelectEvaluators(1,para2);
 	var para3E = getIfSelectEvaluators(2,para3);
	console.log(eval(para1E+para2E+para3E));
	
	
	//this.conditionalCommand = nextCommandObj;
			
	//ifBitMask = para1Bit | (para2Bit << 2) | (para3Bit << 4);
	
	/*
	[IF_SELECT_PARA1_CHAR_X],
	[IF_SELECT_PARA2_LESSER 	IF_SELECT_PARA2_GREATER 	IF_SELECT_PARA2_EQUAL],
	[IF_SELECT_PARA3_GOAL_X 	IF_SELECT_PARA3_RIGHTMOST 	IF_SELECT_PARA3_LEFTMOST
	*/
	
	//00 00 00
	//00 01 00
	//00 10 00 
	//01 00 00
	//01 01 00
	//01 10 00
	//10 00 00
	//10 01 00 
	//10 10 00
	
// 	var charX = parseInt(game.character.x_position);
// 	console.log(charX + " " + CHARACTER_MIN_X);
// 	
// 	if (!(ifBitMask.toString(2) ^ "000000")) {
// 		console.log("Want: If Char X < GoalX");
// 		var goalX = game.goal_object.x_position;
// 		if(charX < goalX)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "000100"))  {
// 		console.log("Want: If Char X > GoalX");
// 		var goalX = game.goal_object.x_position;
// 		if(charX > goalX)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "001000"))  {
// 		console.log("Want: If Char X == GoalX");
// 		var goalX = game.goal_object.x_position;
// 		if(charX == goalX)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "010000"))  {
// 		console.log("Want: If Char X < RightMost");
// 		if(charX < CHARACTER_MAX_X)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "010100"))  {
// 		console.log("Want: If Char X > RightMost");
// 		if(charX > CHARACTER_MAX_X)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "011000"))  {
// 		console.log("Want: If Char X == RightMost");
// 		if(charX == CHARACTER_MAX_X)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "100000"))  {
// 		console.log("Want: If Char X < LeftMost");
// 		if(charX < CHARACTER_MIN_X)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "100100"))  {
// 		console.log("Want: If Char X > LeftMost");
// 		if(charX > CHARACTER_MIN_X)
// 			console.log("perform IF");
// 	}
// 	else if (!(ifBitMask.toString(2) ^ "101000"))  {
// 		console.log("Want: If Char X == LeftMost");
// 		if(charX == CHARACTER_MIN_X)
// 			console.log("perform IF");
// 	}
}

IfCommand.prototype = Object.create(Command);
IfCommand.prototype.execute = function() {

	

}