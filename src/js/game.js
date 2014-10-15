var StartGame = function() {
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
	},
	
	this.isEndOfGame = function() {
		if (Math.abs($("#character_human").css("left") - goal_object.x_position) < 50 &&
			Math.abs($("#character_human").css("top") - goal_object.y_position) < 50)
			return true;
		return false;
	}
}
