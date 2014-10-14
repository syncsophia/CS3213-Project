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
	
	// private text to identify: Must not be changed
	var text = "Move Right One Step";
	this.getText = function() {
		return text;
	}
	console.log("Created new MoveCommand with param: " + step);
}
MoveCommand.prototype = Object.create(Command);
MoveCommand.prototype.execute = function() {
	if (this.step > 0)
		game.character.moveRight(this.step);
	if (this.step < 0)
		game.character.moveLeft(this.step);
	/*
	move('.character_human')

		// move
		.ease('.character_human')
		.add('margin-left', 50 * this.step)
		.duration('3s')
		
		.end();
	*/
	console.log("Move Command Executed. Moving: " + this.step);
}

var JumpCommand = function(step) {
	this.step = step;
	
	// private text to identify: Must not be changed
	var text = "Jump";
	this.getText = function() {
		return text;
	}
	console.log("Created new JumpCommand with param: " + step);
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
	console.log("Jump Command Executed. Jumping: " + this.step);
}

var SetXPosCommand = function(step) {
	this.step = step;
	
	// private text to identify: Must not be changed
	var text = "Set x position";
	this.getText = function() {
		return text;
	}
	console.log("Created new SetXPosCommand with param: " + step);
}
SetXPosCommand.prototype = Object.create(Command);
SetXPosCommand.prototype.execute = function() {
	game.character.placeObject(this.step, game.character.y_position);
	
	console.log("Set X Pos Command Executed. Set X: " + this.step);
}

var SetYPosCommand = function(step) {
	this.step = step;
	
	// private text to identify: Must not be changed
	var text = "Set y position";
	this.getText = function() {
		return text;
	}
	console.log("Created new SetYPosCommand with param: " + step);
}
SetYPosCommand.prototype = Object.create(Command);
SetYPosCommand.prototype.execute = function() {
	game.character.placeObject(game.character.x_position, this.step);
	console.log("Set Y Pos Command Executed. Set Y: " + this.step);
}

var SetToOriginCommand = function() {
	// private text to identify: Must not be changed
	var text = "Set to origin position";
	this.getText = function() {
		return text;
	}
	console.log("Created new SetToOriginCommand");
}
SetYPosCommand.prototype = Object.create(Command);
SetYPosCommand.prototype.execute = function() {
	game.character.placeObject(0, 0);
	console.log("Set to origin Command Executed.");
}