/*
function Command(type, param) {
	this.type = type;
	this.param = param;
}

Command.prototype.execute = function() {
	console.log(this.type + " has parameters " + this.param);
}
*/
//------------------------------------------------------------------------------------
//
//	Create HTML DOM Element
//
//------------------------------------------------------------------------------------

// Shorthand for $( document ).ready()

var arr_IElement = [];

$(function() {
	console.log("[init.js] Document ready");
});

function PlayButton(parentElementID) {
	var $input = $('<input type="button" class="btn btn-success" value="Play" id="btn_play"/>');
    $input.appendTo($(parentElementID));

    $("#btn_play").click(function() {
    	console.log("[btn_play] Clicked");

    	$('.class_code').each(function() {
    		console.log( $(this).text() );
    	});


    	/*
    	var ids = $("#draggablePanelList").sortable("toArray");
    	$( ids ).each(function( index ) {
		  console.log( index + ": " + $( this ).text() );
		});
		*/
    	//alert("Handle .click()");
    });
}


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
	move('.character_human')

		// move
		.x(50)
		.y(0)
		.duration('3s')
		
		.end();
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
		.then()
			.ease('in-out')
			.y(-100)
				.then()
					.ease('in-out')
					.y(100)
					.pop()
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
	console.log("Set Y Pos Command Executed. Set Y: " + this.step);
}