/*
* gets the right command for the object
*/
var newCommand = function(id) {
	//var commandId = id.substring(3);
	//return commands[commandId];
}

/* User pressed stop button
*/
var StopEditor = function() {
	//TODO
	CommandProcessor.hasInterrupt = true;
};

/* clears the code panel
*/
var ClearEditor = function() {
	$('.class_code').each(function() {
		$(this).find("li").remove();
	});
}

/* User pressed play button */
var PlayEditor = function() {
	
	var characterElement = document.getElementById("character_human");
	
	var origin_x_of_Character = $("#character_human").css("left");
	var origin_y_of_Character = $("#character_human").css("top");
	
	//console.log("this is the origin of the character: " + origin_x_of_Character + "  " + origin_y_of_Character);
	
	var listOfCurrentCommands = [];
	
	var isRepeatCommand = false;
	var tempCmdString = "";
	var finalCmdString = "";

	var frontCtrl = new FrontControl();

	$('.class_code').each(function() {
		$(this).find("li").each(function() {
			var current = $(this);
			if(current.children().size() > 1) {
				return true;
			}
			//console.log(current.firstChild.find("input"));
			// Retrieve the id of the elements on the code panel and the correspoding steps, consider them as Request
			listOfCurrentCommands.push(current.attr('id') + ";" + current.find("input").val());
		});

		// ask the frontControl to deal with all Rquests
		frontCtrl.getCommand(listOfCurrentCommands);
		
		var goalAchieved = game.isEndOfGame();
		if (!goalAchieved) {
			// user didn't reach the goal: set character back to origin position.
			game.character.placeObject(origin_x_of_Character, origin_y_of_Character);
		}
		
		listOfCurrentCommands = [];
	});
}