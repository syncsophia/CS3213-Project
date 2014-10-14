//------------------------------------------------------------------------------------
//
//	IObject Interface & Its Implementable Class
//
//------------------------------------------------------------------------------------

var IObject = {
	x_position : 0,
	y_position : 0,
	image : "",
	elementID :"",
	
	showObject : function(bool){},
	hideObject : function(bool){},
	deleteObject : function(){},
	placeObject: function(x,y){},
	setImage: function(image){}
}

/* The actual character class */
var Character = function(elementId) {
	this.elementID = elementId;
	
	this.moveLeft = function(steps) {
		this.x_position += steps;
	},
	this.moveRight = function(steps) {
		this.x_position -= steps;
	},
	this.moveUp = function(steps) {
		this.y_position += steps;
	},
	this.moveDown = function(steps) {
		this.y_position -= steps;
	}
	this.jump = function(height) {
		
	}
}

Character.prototype = Object.create(IObject);

Character.prototype.showObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	characterElement.show();
}

Character.prototype.hideObject = function(bool) {
	var characterElement = document.getElementById(this.elementID);
	characterElement.hide();
}

Character.prototype.deleteObject = function() {
	var characterElement = document.getElementById(this.elementID);
	characterElement.remove();
}

Character.prototype.placeObject = function(x,y) {
	this.x_position = x;
	this.y_position = y;
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
	
	this.DisableDragable = function() {
		draggieObject.disable();
	}
}