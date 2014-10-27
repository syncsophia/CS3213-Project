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
	game.character.placeObject(0, 0);
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

var RepeatForeverCommand = function(list_CommandObjects) {
	this.cmdList = list_CommandObjects;
}
RepeatForeverCommand.prototype = Object.create(Command);
RepeatForeverCommand.prototype.execute = function() {
	// Handle Infinite repeating request
	console.log("You should not see this");
}




/*
var JumpCommand = function(step) {
	this.step = step;
}
JumpCommand.prototype = Object.create(Command);
JumpCommand.prototype.execute = function() {
	game.character.jump(this.step);
	//console.log("[command.js] JumpCommand.execute():   Jumping: " + this.step);
}
*/
var RepeatCommand = function(step, list_CommandObjects) {
	this.step = step;
	this.cmdList = list_CommandObjects;
	this.numRepeatCommands = list_CommandObjects.length;
}
RepeatCommand.prototype = Object.create(Command);
RepeatCommand.prototype.execute = function() {
		var delay = 1500;
		var n_Repeat = 0;
		var i = 0;
		
		var numIterations = this.step;
		var cmdList = this.cmdList;
		
		// setInterval has no clue of this class's variables. i.e.
		var t1 = setInterval( function() {
			cmdList[i].execute();
			i++;
			if(i >= cmdList.length) { i = 0; n_Repeat++; }
			if (n_Repeat > numIterations) clearInterval(t1);
			
		}, delay);
}
RepeatCommand.prototype.getNumRepeatCommands = function() { return this.numRepeatCommands; }