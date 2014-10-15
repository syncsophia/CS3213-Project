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
    var me = this;
    this.elementID = elementId;
    this.x_position = $("#editorContainer").width() / 2;
    this.y_position = $("#editorContainer").height() / 2;

    this.target_x = this.x_position + 100;
    this.target_y = this.y_position;
    this.hasArrived = false;

    this.moveLeft = function (steps) {
        if (0 < (this.x_position + steps * 20))
            this.x_position -= steps * 20;

        $("#" + elementId).css({
            position: "absolute",
            top: this.y_position + "px",
            left: this.x_position + "px",
        });
    },
        this.moveRight = function (steps) {
            if (($("#editorContainer").width() - 50) > (this.x_position + steps * 20))
                this.x_position += steps * 20;

            $("#" + elementId).css({
                position: "absolute",
                top: this.y_position + "px",
                left: this.x_position + "px",
            });

        },
        this.moveUp = function (steps) {
            // it's "-" instead of "+" because the coordinates are different
            if (20 < (this.y_position + steps * 20))
                this.y_position -= steps * 20;

            $("#" + elementId).css({
                position: "absolute",
                top: this.y_position + "px",
                left: this.x_position + "px",
            });
        },
        this.moveDown = function (steps) {
            // it's "+" instead of "-" because the coordinates are different
            if (($("#editorContainer").height() - 110) > (this.y_position + steps * 20))
                this.y_position += steps * 20;

            $("#" + elementId).css({
                position: "absolute",
                top: this.y_position + "px",
                left: this.x_position + "px",
            });
        },
    this.jump = function (height) {

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
	if (x >= 0 && x <= ($("#editorContainer").width()-50))
		{this.x_position = x;};
	if (y >= 0 && y <= ($("#editorContainer").height()-50))
		{this.y_position = y;};
		console.log(this.elementID);
	$("#" + this.elementID).css({
	    position : "absolute",
		top : this.y_position + "px",
		left : this.x_position + "px",
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