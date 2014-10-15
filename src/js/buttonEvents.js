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

	$('.class_code').each(function() {
		$(this).find("li").each(function() {
			var current = $(this);
			if(current.children().size() > 0) {
				return true;
			}
			
			//create command class and perform commands after loop
			var command = new newCommand(current.attr('id'));
			listOfCurrentCommands.push(command);

			//rather than just push into array, we check if the command is a repeat command
			var str_commandType = current.attr("id") + " ";

			if(str_commandType.trim() == "id_" + CMD_REPEAT)
				isRepeatCommand = true;
			else
				isRepeatCommand = false;

			if(isRepeatCommand) {
				if(tempCmdString == "")
					finalCmdString = finalCmdString + finalCmdString;
				else
					finalCmdString += tempCmdString + tempCmdString;
				tempCmdString = "";
			}
			else {
				tempCmdString += str_commandType;
			}
		});
		
		if(tempCmdString != "")
			finalCmdString+=tempCmdString;

		//console.log("[dragdrop.html] PlayEditor(): Final Command String: " + finalCmdString);
		var cmdObjList = createCommands(finalCmdString);
		//console.log('[dragdrop.html] PlayEditor(): cmdObjList size:' + cmdObjList.length);

		for(var i=0; i < cmdObjList.length; i++) {
			cmdObjList[i].execute();
		}
		
		var goalAchieved = game.isEndOfGame();
		
		if (!goalAchieved) {
			// user didn't reach the goal: set character back to origin position.
			game.character.placeObject(origin_x_of_Character, origin_y_of_Character);
		}
		
		//then delete the list: otherwise it will be summed up?
		listOfCurrentCommands = [];
	});
}

var createCommands = function(cmdString) {
	var commandList = [];
	var str = cmdString.trim();
	var arr_commandString = str.split(" ");
	var commandIsValid = true;
	
	//console.log(arr_commandString.length);

	for(var i=0; i < arr_commandString.length; i++) {
		var temp = arr_commandString[i].trim().substring(3);
		
		if(temp == CMD_MOVE_RIGHT)
			commandList.push(new MoveCommand(1));
		else if (temp == CMD_MOVE_LEFT)
			commandList.push(new MoveCommand(-1));
		else if (temp == CMD_RESET_X)
			commandList.push(new SetXPosCommand(1));
		else if (temp == CMD_RESET_Y)
			commandList.push(new SetYPosCommand(1));
		else if (temp == CMD_RESET_POSITION)
			commandList.push(new SetToOriginCommand());
		else if (temp == CMD_JUMP)
			commandList.push(new JumpCommand(1));
		else if (temp == CMD_SHOW)
			commandList.push(new ShowCommand());
		else if (temp == CMD_HIDE)
			commandList.push(new HideCommand());
	}
	return commandList;	
}