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
RepeatCommand.prototype.getNumberOfRepeats = function() { return this.step }


//------------------------------------------------------------------------------------
//
//	IfCommand (Implements Command)
//
//	Description: Command that performs conditional checks before proceeding with 
//				 next function
//
//------------------------------------------------------------------------------------
var IfCommand = function(para1, para2, para3, para4, para5, nextCommandObj) {
	this.para1 = para1;
	this.para2 = para2;
	this.para3 = para3;
	this.para4 = para4;
	this.para5 = para5;		
	this.nextCommandObj = nextCommandObj;
}

IfCommand.prototype = Object.create(Command);
IfCommand.prototype.execute = function() {

	var getIfSelectEvaluators = function(s, para) {
		for(var i=0; i < IF_SELECTS[s].length; i++)
			if (para == IF_SELECTS[s][i])
				return IF_SELECTS_EVALUATOR[s][i];
	}
	
	var para1E = getIfSelectEvaluators(0,this.para1);
 	var para2E = getIfSelectEvaluators(1,this.para2);
 	var para3E = getIfSelectEvaluators(2,this.para3);
 	var para4E = getIfSelectEvaluators(3,this.para4);
 	var para5E = this.para5;
 	
 	var isStatementTrue = eval(para1E+para2E+"("+para3E+para4E+para5E+")");
 	
//  	var temp = eval(para1E);
//  	temp = temp.substring(0,temp.length-2);
//  	console.log("Temp: " + temp);

	//console.log("If statement evaluation: if " + eval(para1E) + para2E + eval(para3E) + " " + para4E + " " + para5E +  " is "  + isStatementTrue);
	
	if(isStatementTrue) {
	
		var nextObj = this.nextCommandObj;
		var timerInterval = setInterval( function() {
			
			nextObj.execute();
			if(StartGame.IsMusicOn()) {
				CommandProcessor.observers.forEach(function(entry) {
					entry.notify(nextObj);
				});
			}
			clearInterval(timerInterval);
		}, 1);
	}
}