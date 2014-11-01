/*
* gets the right command for the object
*/
var newCommand = function(id) {
	//var commandId = id.substring(3);
	//return commands[commandId];
}

var MusicEditor = function() {
	game.musicOn = !game.musicOn;
	
	if(game.musicOn) {
		$("#id_btnMusicImg").attr("src", "img/btn_musicon.png");
		ToggleMusic(game.musicOn);
	}
	else {
		$("#id_btnMusicImg").attr("src", "img/btn_musicoff.png");
		ToggleMusic(game.musicOn);
	}
}

/* User pressed stop button
*/
var StopEditor = function() {
	//TODO
	CommandProcessor.Interrupt();
	game.resetCharacter();
};

/* clears the code panel
*/
var ClearEditor = function() {
	$('.class_code').each(function() {
		$(this).find("li").remove();
	});

	console.log(CommandProcessor.hasInterrupt);
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
			var parameters;
			
			var arr_SelectedItems = current.find(":selected").map(function() {
				return $(this).text();
			});
			
			if(arr_SelectedItems.length == 3) {
				parameters = arr_SelectedItems[0] + ";" + arr_SelectedItems[1] + ";" + arr_SelectedItems[2];
			}
			else
				parameters = current.find("input").val();
			
			// Retrieve the id of the elements on the code panel and the corresponding steps, consider them as Request
			listOfCurrentCommands.push(current.attr('id') + ";" + parameters);
		});
		
		if(listOfCurrentCommands.length <= 0)
			return;
		
		// else append reset of character after execution
		listOfCurrentCommands.push("id_" + CMD_RESET_POSITION);
		
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