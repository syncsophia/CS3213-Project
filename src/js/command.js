//------------------------------------------------------------------------------------
//
//	Command Interface & Its Implementable Class
//
//------------------------------------------------------------------------------------
var Command = {
	execute: function() {}
}

var MoveCommand = function(step) {
	this.step = step;
}
MoveCommand.prototype = Object.create(Command);
MoveCommand.prototype.execute = function() {
	if (this.step > 0)
    {
        move('.character_human')

            // move
            .ease('.character_human')
            .add('margin-left', 50 * this.step)
            .duration('2s')
            .end();
    }
	else if (this.step < 0)
    {
        move('.character_human')

            // move
            .ease('.character_human')
            .add('margin-right', 50 * this.step)
            .duration('2s')
            .end();
    }
	//console.log("[command.js] MoveCommand.execute():  Moving: " + this.step);
}

var JumpCommand = function(step) {

}
JumpCommand.prototype = Object.create(Command);
JumpCommand.prototype.execute = function() {
	move('.character_human')
			.add('margin-top', -100 * this.step)
				.then()
					.ease('.character_human')
					.add('margin-top', 100 * this.step)
				.pop()
		.end();
	//console.log("[command.js] JumpCommand.execute():   Jumping: " + this.step);
}

var SetXPosCommand = function(step) {
	this.step = step;
}
SetXPosCommand.prototype = Object.create(Command);
SetXPosCommand.prototype.execute = function() {
	game.character.placeObject(this.step, game.character.y_position);
	//console.log("[command.js] SetXPosCommand.execute(): Set X: " + this.step);
}

var SetYPosCommand = function(step) {
	this.step = step;
}
SetYPosCommand.prototype = Object.create(Command);
SetYPosCommand.prototype.execute = function() {
	game.character.placeObject(game.character.x_position, this.step);
	//console.log("[command.js] SetYPosCommand.execute():  Set Y: " + this.step);
}

var SetToOriginCommand = function() {

}
SetToOriginCommand.prototype = Object.create(Command);
SetToOriginCommand.prototype.execute = function() {
	game.character.placeObject(0, 0);
	//console.log("[command.js] SetToOriginCommand.execute():  Set to origin.");
}

var HideCommand = function() { 

}
HideCommand.prototype = Object.create(Command);
HideCommand.prototype.execute = function() {
	game.character.hideObject();
	//console.log("[command.js] HideCommand.execute():  Hide character");
}

var ShowCommand = function() {

}
ShowCommand.prototype = Object.create(Command);
ShowCommand.prototype.execute = function() {
	game.character.showObject();
	//console.log("[command.js] ShowCommand.execute():  Show character");
}