//------------------------------------------------------------------------------------
//
//	IObject Interface & Its Implementable Class
//
//------------------------------------------------------------------------------------


var IObject = function(){
	this.x_position = 0,
	this.y_position = 0,
	this.imageWidth = 128,
	this.imageHeight =128,
	this.image = "",
	this.elementID= "",

	this.showObject= function(bool) {},
	this.hideObject= function(bool) {},
	this.deleteObject= function() {},
	this.placeObject= function(x, y) {},
	this.setImage= function(image) {},
	this.setInitXY= function(x, y) { this.initXPos = this.x_position = parseInt(x,10); this.initYPos = this.y_position = parseInt(y,10);}
    this.getWidth = function(){ return this.imageWidth; }
    this.getHeight = function(){ return this.imageHeight; }
}

/* The actual character class */
var Character = function(elementId) {
	var me = this;
	var margin_left = 0;
	this.elementID = elementId;
	
	this.getCurrentXPosition = function() {
		return (parseInt(this.x_position ,10) + margin_left);
	}
	
	this.getCurrentYPosition = function() {
		return (parseInt(this.y_position ,10));
	}
	
	this.move = function(steps) { 
		if ((this.getCurrentXPosition() + parseInt(steps*50, 10)) <= ($("#editorContainer").width() - this.getWidth()) && (this.getCurrentXPosition() + parseInt(steps*50, 10)) > 20) {
			if (parseInt(steps*50, 10) > 0)
			{
				move('.' + this.elementID)
				.ease('.' + this.elementID)
				.add('margin-left', 50 * steps)
				.duration('1s')
				.end();
				margin_left += 50*steps;
			}
			else {
				move('.' + this.elementID)
				.sub('margin-left', 50 * Math.abs(steps))
				.duration('1s')
				.end();
				margin_left -= 50*Math.abs(steps);
			}
		} else {
			if (parseInt(steps*50, 10) > 0)
			{
				var newsteps = ($("#editorContainer").width() - this.getWidth()) - this.getCurrentXPosition();
				move('.' + this.elementID)
				.ease('.' + this.elementID)
				.add('margin-left', newsteps)
				.duration('1s')
				.end();
				margin_left += newsteps;
			}
			else {
				move('.' + this.elementID)
				.sub('margin-left', this.getCurrentXPosition())
				.duration('1s')
				.end();
				margin_left -= this.getCurrentXPosition();
			}
		}
    },
	
    this.jump = function(steps) {
		// Important: the upper border of the editor is initialized with y=0
		if (parseInt(steps*100, 10) >= 0 && (this.getCurrentYPosition()  - parseInt(steps*100, 10)) >= -50) {
			// no change in x and y position inside the object.
    		move('.' + this.elementID)
				.add('margin-top', -100 * steps)
				.then()
				.ease('.' + this.elementID)
				.add('margin-top', 100 * steps)
				.pop()
				.duration('0.8s')
				.end();
		} else {
    		move('.' + this.elementID)
				.add('margin-top', -this.getCurrentYPosition())
				.then()
				.ease('.' + this.elementID)
				.add('margin-top', this.getCurrentYPosition())
				.pop()
				.duration('0.8s')
				.end();
		}
    },
	
	this.resetPosition = function() {
		// reset the margin left for origin position
		move('#' + this.elementID)
		  .set('margin-left',0)
		  .end();
		  
		margin_left=0;
	}
}


Character.prototype = new IObject();

Character.prototype.getYForJump = function(steps)
{
    return (parseInt(this.y_position ,10) - 100*Math.abs(steps));
}

Character.prototype.showObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	move("#" + this.elementID).set('opacity', 1.0).duration('0.5s').end();
}

Character.prototype.hideObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	move("#" + this.elementID).set('opacity', 0.0).duration('0.5s').end();
}

Character.prototype.deleteObject = function() {
	var characterElement = document.getElementById(this.elementID);
	characterElement.remove();
}

Character.prototype.placeObject = function(x, y) {
	if (parseInt(x, 10) >= 0 && parseInt(x, 10) <= ($("#editorContainer").width() - 50)) {
		this.x_position = x;
	};
	if (parseInt(y, 10) >= 0 && parseInt(y, 10) <= ($("#editorContainer").height() - 50)) {
		this.y_position = y;
	};
	$("#" + this.elementID).css({
		position: "absolute",
		top: this.y_position + "px",
		left: this.x_position + "px"
	});
}

Character.prototype.setImage = function(image) {
	this.image = image;
	var characterElement = document.getElementById(this.elementID);
	characterElement.src = image;
    this.imageHeight = characterElement.clientHeight;
    this.imageWidth = characterElement.clientWidth;
}

//------------------------------------------------------------------------------------
//
//	Goal Implementation
//
//------------------------------------------------------------------------------------

var Goal = function(elementId) {
    var me = this;
	var margin_left = 0;
	this.elementID = elementId;
    
	this.target_x = this.x_position + 100;
	this.target_y = this.y_position;
	this.hasArrived = false;
    this.goalAchieved = false;
	
	this.getCurrentXPosition = function() {
		return (parseInt(this.x_position ,10) + margin_left);
	}
	
	this.getCurrentYPosition = function() {
		return parseInt(this.y_position ,10);
	}
}

Goal.prototype = new IObject();

Goal.prototype.getCurrentXPosition = function() {
    return parseInt(this.x_position ,10);
}

Goal.prototype.getCurrentYPosition = function() {
    return parseInt(this.y_position ,10);
}

Goal.prototype.showObject = function(bool) {
	var goalElement = document.getElementById(this.elementID);
	move("#" + this.elementID).set('opacity', 1.0).rotate(-1080).scale(1.0).duration('0.1s').end();
}

Goal.prototype.hideObject = function(bool) {
	var goalElement = document.getElementById(this.elementID);
    move("#" + this.elementID)
    .rotate(1080)
    .scale(1.5)
    .then()
    .set('opacity', 0.0)
    .duration('0.5s')
    .pop()
    .end();
}

Goal.prototype.deleteObject = function() {
	var goalElement = document.getElementById(this.elementID);
	goalElement.remove();
}

Goal.prototype.placeObject = function(x, y) {
	if (parseInt(x, 10) >= 0 && parseInt(x, 10) <= ($("#editorContainer").width() - 50)) {
		this.x_position = x;
	};
	if (parseInt(y, 10) >= 0 && parseInt(y, 10) <= ($("#editorContainer").height() - 50)) {
		this.y_position = y;
	};
	$("#" + this.elementID).css({
		position: "absolute",
		top: this.y_position + "px",
		left: this.x_position + "px"
	});
}

Goal.prototype.setImage = function(image) {
	this.image = image;
	var goalElement = document.getElementById(this.elementID);
	goalElement.src = image;
}
