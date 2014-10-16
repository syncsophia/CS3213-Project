var StartGame = function() {

	var addDragableCommands = function() {
		
		var dragDropElementTable = document.getElementById('allItems');
		
		for(text in COMMANDS) {
			var li_Element = document.createElement("li");
			li_Element.appendChild(document.createTextNode(COMMANDS[text]));
			li_Element.setAttribute("id", "id_" + COMMANDS[text]);
			li_Element.setAttribute("class", "class_" + COMMANDS[text]);
			dragDropElementTable.appendChild(li_Element);
		}
	}


	this.character = new Character("character_human");
	this.goal_object = new Goal("goal_object");

	this.init = function() {
		var randomInt1 = Math.floor((Math.random() * 500) + 1);
		var randomInt2 = Math.floor((Math.random() * 500) + 1);

		$("#" + "goal_object").css({
			position: "absolute",
			top: randomInt1 + "px",
			left: randomInt2 + "px",
		});
		
		goal_object.x_position = randomInt1;
		goal_object.y_position = randomInt2;

		var randomInt3 = Math.floor((Math.random() * 500) + 1);
		var randomInt4 = Math.floor((Math.random() * 500) + 1);

		if (Math.abs(randomInt1 - randomInt3) < 20 && Math.abs(randomInt2 - randomInt4) < 20) {
			// The difference between goal position and character position is too low
			var randomInt3 = Math.floor((Math.random() * 500) + 1) % 5;
			var randomInt4 = Math.floor((Math.random() * 500) + 1) % 3;
		}

		$("#character_human").css({
			position: "absolute",
			top: randomInt3 + "px",
			left: randomInt4 + "px",
		});


		addDragableCommands();
	},
	
	this.isEndOfGame = function() {
		if (Math.abs($("#character_human").css("left") - goal_object.x_position) < 50 &&
			Math.abs($("#character_human").css("top") - goal_object.y_position) < 50)
			return true;
		return false;
	}
	
	ChangeBackground("img/Background-wood.jpg");

	var mediaContentManager = new MediaContent();
	insertAllItemsIntoMenu(mediaContentManager);
}

var insertAllItemsIntoMenu = function(mediaContent) {
	insertHomeItemsIntoMenu(mediaContent);
	insertBackgroundItemsIntoMenu(mediaContent);
	insertCharacterItemsIntoMenu(mediaContent);
}

var insertCharacterItemsIntoMenu = function(mediaContent) {
	var characterMenuElement = document.getElementById('id_MenuCharacterSelect');
	var images = mediaContent.getArrCharacterImages();
}

var insertBackgroundItemsIntoMenu = function(mediaContent) {

}

var insertHomeItemsIntoMenu = function(mediaContent) {

}

function MediaContent() {
	this.arr_backgroundImages = [];
	this.arr_characterImages = [];
	this.arr_buttonImages = [];
	this.goalImage;

	this.arr_backgroundImages.push("img/Background-wood.jpg");
	this.arr_backgroundImages.push("img/Background-beach.jpg");
	this.arr_backgroundImages.push("img/Background-forrest.jpg"); 
	this.arr_backgroundImages.push("img/Background-heaven.jpg");
	this.arr_backgroundImages.push("img/Background-machu.jpg");
	this.arr_backgroundImages.push("img/Background-moai.jpg");

	this.arr_buttonImages.push("img/recycle.png");
	this.arr_buttonImages.push("img/stop.png");
	this.arr_buttonImages.push("img/play.png");

	this.arr_characterImages.push("img/snail_1.png");
	this.arr_characterImages.push("img/snail_2.png");
	this.arr_characterImages.push("img/snail_3.png");
	this.arr_characterImages.push("img/albert.png");

	this.goalImage = "img/goal.png";
}

MediaContent.prototype.getArrBackgroundImages = function() { return this.arr_backgroundImages; }
MediaContent.prototype.getArrCharacterImages = function() { return this.arr_characterImages; }
MediaContent.prototype.getArrButtonImages = function() { return this.arr_buttonImages; }
MediaContent.prototype.getGoalImages = function() { return this.goalImage; }
