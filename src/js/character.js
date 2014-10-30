//------------------------------------------------------------------------------------
//
//	IObject Interface & Its Implementable Class
//
//------------------------------------------------------------------------------------


var IObject = {
	x_position: 0,
	y_position: 0,
	initXPos:0,
	initYPos:0,
	image: "",
	elementID: "",

	showObject: function(bool) {},
	hideObject: function(bool) {},
	deleteObject: function() {},
	placeObject: function(x, y) {},
	setImage: function(image) {},
	setInitXY: function(x, y) { this.initXPos = this.x_position = parseInt(x,10); this.initYPos = this.y_position = parseInt(y,10);}
}

/* The actual character class */
var Character = function(elementId) {
	var me = this;
	this.elementID = elementId;

	this.target_x = this.x_position + 100;
	this.target_y = this.y_position;
	this.hasArrived = false;
	
	this.move = function(steps) {
		
		if (parseInt(steps*50, 10) >= 0 && 
				(parseInt(this.x_position ,10) + parseInt(steps*50, 10)) <= ($("#editorContainer").width() - 50)) {
			
					move('.' + this.elementID)
						.ease('.' + this.elementID)
						.add('margin-left', 50 * steps)
						.duration('1s')
					.end();
				this.x_position = (parseInt(this.x_position ,10) + parseInt(steps*50, 10));	
		}
    },
    this.jump = function(steps) {
		if (parseInt(steps*100, 10) >= 0 && 
				(parseInt(this.y_position ,10)  + parseInt(steps*100, 10)) <= ($("#editorContainer").height() - 50)) {
			// no change in x and y position inside the object.
    	move('.' + this.elementID)
			.add('margin-top', -100 * steps)
				.then()
					.ease('.' + this.elementID)
					.add('margin-top', 100 * steps)
				.pop()
			.duration('0.8s')
		.end();
		}
    },
	this.resetPosition = function() {
		this.x_position = this.initXPos;
		this.y_position = this.initYPos;
	}
}


Character.prototype = Object.create(IObject);

Character.prototype.showObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	//characterElement.setAttribute("style", "opacity:1.0");
	move("#" + this.elementID).set('opacity', 1.0).duration('0.5s').end();
}

Character.prototype.hideObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	//characterElement.setAttribute("style", "opacity:0.0");
	
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
		left: this.x_position + "px",
	});
}

Character.prototype.setImage = function(image) {
	console.log("Change image: " + image);
	this.image = image;
	var characterElement = document.getElementById(this.elementID);
	characterElement.src = image;
}

//------------------------------------------------------------------------------------
//
//	Goal Implementation
//
//------------------------------------------------------------------------------------

var Goal = function(elementId) {
	this.elementID = elementId;
	this.hasAchieved = false;
}

Goal.prototype = Object.create(IObject);

Goal.prototype.showObject = function(bool) {
	var goalElement = document.getElementById(this.elementID);
	goalElement.setAttribute("style", "opacity:1.0");
}

Goal.prototype.hideObject = function(bool) {
	var goalElement = document.getElementById(this.elementID);
	goalElement.setAttribute("style", "opacity:0.0");
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
	//console.log(this.elementID);
	$("#" + this.elementID).css({
		position: "absolute",
		top: this.y_position + "px",
		left: this.x_position + "px",
	});
}

Goal.prototype.setImage = function(image) {
	this.image = image;
	var goalElement = document.getElementById(this.elementID);
	goalElement.src = image;
}
