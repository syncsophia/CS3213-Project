//------------------------------------------------------------------------------------
//
//	FrontControl Class
//
//	Description: To accept all income request.
//				 Its main client is buttonEvents and the form of requests pertains to
//				 creation of Command objects to animate the character
//------------------------------------------------------------------------------------

function FrontControl() {
	this.cmdHandler = new CommandHandler();
}

/**
 * Accepts the incoming request strings and pass to the CommandHandler to translate
 * the requests. It does a bit of processing by removing the 'id_' tag.
 *
 * @param commandString: string of requests by the client, i.e. from the PlayEditor
 */
FrontControl.prototype.getCommand = function(commandString) {
	var commandList = [];

	for(var i=0; i < commandString.length; i++)
		commandList.push( commandString[i].trim().substring(3) );

	this.cmdHandler.constructCommands(commandList);
};

//------------------------------------------------------------------------------------
//
//	CommandHandler Class
//
//	Description: To handle all income request.
//				 Its main client is buttonEvents and the general requests pertains to
//				 creation of Command objects to animate the character
//------------------------------------------------------------------------------------
function CommandHandler() {
	this.cmdPro = new CommandProcessor();
}

/**
 * Construct the Command Object based on the translated request.
 *
 * @param commandStrArray: string of requests delegated by the FrontControl
 */
CommandHandler.prototype.constructCommands = function(commandStrArray) {
	
	var commandList = [];
	var commandBeforeRepeat = [];
	for(var i=0; i < commandStrArray.length; i++) {
		var tuple = commandStrArray[i].split(";");
		var cmdType = tuple[0];
		var cmdStep = tuple[1];
		
		//console.log(cmdType + " " + cmdStep);
		
		if(cmdType == CMD_MOVE_RIGHT)
			commandBeforeRepeat.push(new MoveCommand(cmdStep));
		else if (cmdType == CMD_MOVE_LEFT)
			commandBeforeRepeat.push(new MoveCommand(-cmdStep));
		else if (cmdType == CMD_JUMP)
			commandBeforeRepeat.push(new JumpCommand(cmdStep));
		else if (cmdType == CMD_SHOW)
			commandBeforeRepeat.push(new ShowCommand());
		else if (cmdType == CMD_HIDE)
			commandBeforeRepeat.push(new HideCommand());
		else if (cmdType == CMD_REPEAT) {
			if(commandBeforeRepeat.length != 0) {
				var repeatCmd = new RepeatCommand(cmdStep, commandBeforeRepeat);
				commandBeforeRepeat = [];
				commandList.push(repeatCmd);
			}
			else { 
				var repeatCmd = new RepeatCommand(cmdStep, commandList);
				commandList = [];
				commandList.push(repeatCmd);
			}
		}
		else if (cmdType == CMD_REPEAT_FOREVER) {
			repeatCmdList = commandList;
			if(commandBeforeRepeat.length != 0) {
				for(var i=0; i < commandBeforeRepeat.length; i++) {
					repeatCmdList.push(commandBeforeRepeat[i]);
				}
			}
			commandBeforeRepeat = [];
			commandList = [];
			commandList.push(new RepeatForeverCommand(repeatCmdList));
			break;
		}
	}
	
	if(commandBeforeRepeat.length != 0) {
		for(var i=0; i < commandBeforeRepeat.length; i++) {
			commandList.push(commandBeforeRepeat[i]);
		}
	}

	this.cmdPro.processCommands(commandList);
}

/**
 * Process the request by looking at all the requests individually.
 * It pays special attention requesting for Repeat command.
 * When a repeat command is detected, it has to 'repeat' all last performed
 * non-repeating commands. Below illustrates how it handles such a request:
 * e.g. Repeat Move_Right Jump Repeat will become:
 *		Move_Right Jump Move_Right Jump
 *
 * @param commandStrArray: string of requests delegated by the FrontControl
 * @return: an array of properly formated array of string commands ready for
 *			valid Command object creation
 */
CommandHandler.prototype.draftCommandStrings = function(commandStrArray) {
	var listOfCompleteStrCommands = [];
	
	var isRepeatCommand = false;
	var tempCmdString = "";
	var finalCmdString = "";
	var str_commandType = "";

	var isRepeatForeverCommand = false;

	for(var i=0; i < commandStrArray.length; i++) {
		str_commandType = commandStrArray[i].split(";")[0];
		str_steps = commandStrArray[i].split(";")[1];
		
		if(str_commandType == CMD_REPEAT_FOREVER) {
			isRepeatForeverCommand = true;
			continue;
		}

		if(str_commandType == CMD_REPEAT)
			isRepeatCommand = true;
		else
			isRepeatCommand = false;

		if(isRepeatCommand) {
			var theRepeatString = "";
			if(tempCmdString == "")
				theRepeatString = finalCmdString;
			else
				theRepeatString = tempCmdString;
			for(var i=0; i < str_steps; i++)
				finalCmdString += theRepeatString;
			tempCmdString = "";
		}
		else {
			tempCmdString += str_commandType + ";" + str_steps + " ";
		}
	}
	if(tempCmdString != "")
		finalCmdString+=tempCmdString;


	if(isRepeatForeverCommand)
		finalCmdString += CMD_REPEAT_FOREVER+";100000 ";

	finalCmdString = finalCmdString.trim();

	listOfCompleteStrCommands = finalCmdString.split(" ");
	return listOfCompleteStrCommands;
};

function CommandProcessor() {
	this.cmdList = [];
}
CommandProcessor.hasInterrupted = false;
CommandProcessor.StaticCommandList = [];
CommandProcessor.Interrupt = function() {
	CommandProcessor.hasInterrupted = true;
	
	for(var i=0; i < CommandProcessor.StaticCommandList.length; i++) {
		if(CommandProcessor.StaticCommandList[i] instanceof RepeatCommand || 
		   CommandProcessor.StaticCommandList[i] instanceof RepeatForeverCommand) {
			CommandProcessor.StaticCommandList[i].Interrupt();
		}	
	} 
	
}
/**
 * This is the lowest point of delegation of request where this function
 * performs the ACTUAL execution of the commands
 *
 * @param commandStrArray: an array of Command objects delegated by the FrontControl
 */
CommandProcessor.prototype.processCommands = function(commandList) {
	
	CommandProcessor.StaticCommandList = this.cmdList = commandList;
	
	hasInterrupted = false;
	
	var i = 0;
	var delay = 1500;
	if(commandList[i] instanceof RepeatCommand)
		delay = 1500 * (commandList[i].getNumRepeatCommands() + 1);
	var t1 = setInterval( function() {
		if(commandList[i] instanceof RepeatCommand)
			delay = 1500 * (commandList[i].getNumRepeatCommands() + 1);
		else
			delay = 1500;
		// console.log("BEFORE: initX: " + game.character.initXPos + 
// 					" initY: " + game.character.initYPos + 
// 					" X: " + game.character.x_position + 
// 					" Y: " + game.character.y_position);
		commandList[i].execute();
		// console.log("AFTER: initX: " + game.character.initXPos + 
// 					" initY: " + game.character.initYPos + 
// 					" X: " + game.character.x_position + 
// 					" Y: " + game.character.y_position);
		i++;
		if(i >= commandList.length || CommandProcessor.hasInterrupted) clearInterval(t1);
		
	}, delay);
};