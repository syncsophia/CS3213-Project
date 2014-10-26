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
	
	//TODO: should be moved to the character class !!!
	if (this.step > 0)
    {
        move('.' + game.character.elementID)

            // move
            .ease('.' + game.character.elementID)
            .add('margin-left', 50 * this.step)
            .duration('2s')
            .end();
    }
	else if (this.step < 0)
    {
        move('.' + game.character.elementID)

            // move
            .ease('.' + game.character.elementID)
            .add('margin-right', 50 * this.step)
            .duration('2s')
            .end();
    }
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
	
	// TODO: should be moved to the character class !!!
	move('.' + game.character.elementID)
			.add('margin-top', -100 * this.step)
				.then()
					.ease('.' + game.character.elementID)
					.add('margin-top', 100 * this.step)
				.pop()
		.end();
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

var RepeatForeverCommand = function() {

}
RepeatForeverCommand.prototype = Object.create(Command);
RepeatForeverCommand.prototype.execute = function() {
	// Handle Infinite repeating request
	console.log("You should not see this");
}