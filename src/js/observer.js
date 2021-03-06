//------------------------------------------------------------------------------------
//
//	Observer (Inteface) Class
//
//	Description: Interface for other data observers to implement the notify function
//
//------------------------------------------------------------------------------------
var Observer = {
	notify: function() {}
}


//------------------------------------------------------------------------------------
//
//	MoveCommandObserver (Implements Observer)
//
//	Description: Observer to listen for any execution of MoveCommand 
//				 Plays 'Walking' sound effect when called upon
//
//------------------------------------------------------------------------------------
var MoveCommandObserver = function() {
	CommandProcessor.attachObserver(this);
	this.audio = new Audio("audio/walk.m4a");
}
MoveCommandObserver.prototype = Object.create(Observer);
MoveCommandObserver.prototype.notify = function(commandObject) { 
	if(commandObject instanceof MoveCommand && StartGame.IsMusicOn())
		this.audio.play();
}


//------------------------------------------------------------------------------------
//
//	CommandProcessor (Implements Observer)
//
//	Description: Observer to listen for any execution of JumpCommand 
//				 Plays 'Jumping' sound effect when called upon
//
//------------------------------------------------------------------------------------
var JumpCommandObserver = function() {
	CommandProcessor.attachObserver(this);
	this.audio = new Audio("audio/jump.m4a");
}
JumpCommandObserver.prototype = Object.create(Observer);
JumpCommandObserver.prototype.notify = function(commandObject) { 
	console.log("notified");   	
	if(commandObject instanceof JumpCommand && StartGame.IsMusicOn())
		this.audio.play();	
}


//------------------------------------------------------------------------------------
//
//	ShowHideCommandObserver (Implements Observer)
//
//	Description: Observer to listen for any execution of Show or Hide Command 
//				 Plays 'Popping' sound effect when called upon
//
//------------------------------------------------------------------------------------
var ShowHideCommandObserver = function() {
	CommandProcessor.attachObserver(this);
	this.audio = new Audio("audio/gumpop.m4a");
}
ShowHideCommandObserver.prototype = Object.create(Observer);
ShowHideCommandObserver.prototype.notify = function(commandObject) {
	if(commandObject instanceof ShowCommand || commandObject instanceof HideCommand)
		if (StartGame.IsMusicOn())
		this.audio.play();	
}

//------------------------------------------------------------------------------------
//
//	GameWonObserver (Implements Observer)
//
//	Description: Observer to listen for condition of game end
//				 Plays 'Cha Ching' sound effect when called upon
//
//------------------------------------------------------------------------------------
var GameWonObserver = function() {
	CommandProcessor.attachObserver(this);
	this.audio = new Audio("audio/chaching.wav");
}
GameWonObserver.prototype = Object.create(Observer);
GameWonObserver.prototype.notify = function() {
 	// as long as I'm called, I'll just play audio, so use me with caution
	if (StartGame.IsMusicOn())
	this.audio.play();	
}

var CollisionObserver = function() {
	CommandProcessor.attachObserver(this);
	this.audio = new Audio("audio/chaching.wav");
}
CollisionObserver.prototype = Object.create(Observer);
CollisionObserver.prototype.notify = function(commandObject) {
	
	if(commandObject instanceof SetToOriginCommand)
		return;
	var step = 0;
 	if(commandObject instanceof JumpCommand) {
 		step = commandObject.step;
 	}
	GOAL_ACHIEVED = isCollide(game.character, game.goal_object, step);
	
	if(GOAL_ACHIEVED) {
		var t2 = setInterval( function() {
			game.goal_object.hideObject();
			clearInterval(t2);
			CommandProcessor.notifyGameWon();
		}, 100);
		if (StartGame.IsMusicOn())
		this.audio.play();
	}
}
