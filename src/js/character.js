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
	setInitXY: function(x, y) { initXPos = x; initYPos = y; }
}

/* The actual character class */
var Character = function(elementId) {
	var me = this;
	this.originPosition = [];
	this.elementID = elementId;

	this.target_x = this.x_position + 100;
	this.target_y = this.y_position;
	this.hasArrived = false;
	
	this.move = function(steps) {	
		move('.' + this.elementID)
			.ease('.' + this.elementID)
			.add('margin-left', 50 * steps)
			.duration('1s')
			.end();
    },
    this.jump = function(steps) {
    	move('.' + this.elementID)
			.add('margin-top', -100 * steps)
				.then()
					.ease('.' + this.elementID)
					.add('margin-top', 100 * steps)
				.pop()
			.duration('0.8s')
		.end();
    },
	this.moveUp = function(steps) {
		// it's "-" instead of "+" because the coordinates are different
		if (20 < (this.y_position + steps * 20))
			this.y_position -= steps * 20;

		$("#" + elementId).css({
			position: "absolute",
			top: this.y_position + "px",
			left: this.x_position + "px",
		});
	},
	this.moveDown = function(steps) {
		// it's "+" instead of "-" because the coordinates are different
		if (($("#editorContainer").height() - 110) > (this.y_position + steps * 20))
			this.y_position += steps * 20;

		$("#" + elementId).css({
			position: "absolute",
			top: this.y_position + "px",
			left: this.x_position + "px",
		});
	},
	this.resetPosition = function(steps) {
		
	},
	this.initPosition = function(x, y) {
		this.x_position = this.initXPos = x;
		this.y_position = this.initYPos = y;
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
	this.image = image;
	var characterElement = document.getElementById(this.elementID);
	characterElement.src = image;
}

Character.prototype.setInitPosition = function(x, y) {
	this.initXPos = x;
	this.initYPos = y;
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
	if (x >= 0 && x <= ($("#editorContainer").width() - 50)) {
		this.x_position = x;
	};
	if (y >= 0 && y <= ($("#editorContainer").height() - 50)) {
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
