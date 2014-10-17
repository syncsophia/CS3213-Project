//------------------------------------------------------------------------------------
//
//	IObject Interface & Its Implementable Class
//
//------------------------------------------------------------------------------------


var IObject = {
	x_position: 0,
	y_position: 0,
	image: "",
	elementID: "",

	showObject: function(bool) {},
	hideObject: function(bool) {},
	deleteObject: function() {},
	placeObject: function(x, y) {},
	setImage: function(image) {}
}

/* The actual character class */
var Character = function(elementId) {
	var me = this;
	this.originPosition = [];
	this.elementID = elementId;

	this.target_x = this.x_position + 100;
	this.target_y = this.y_position;
	this.hasArrived = false;

	this.moveLeft = function(steps) {
		if (0 < (this.x_position + steps * 20))
			this.x_position -= steps * 20;

		$("#" + elementId).css({
			position: "absolute",
			top: this.y_position + "px",
			left: this.x_position + "px",
		});
	},
	this.moveRight = function(steps) {
		if (($("#editorContainer").width() - 50) > (this.x_position + steps * 20))
			this.x_position += steps * 20;

		$("#" + elementId).css({
			position: "absolute",
			top: this.y_position + "px",
			left: this.x_position + "px",
		});

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
	this.jump = function(height) {

	}
}

Character.prototype = Object.create(IObject);

Character.prototype.showObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	characterElement.setAttribute("style", "opacity:1.0");
}

Character.prototype.hideObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	characterElement.setAttribute("style", "opacity:0.0");
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
