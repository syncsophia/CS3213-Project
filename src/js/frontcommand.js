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
	var commandDraftStringList = [];
	commandDraftStringList =  this.draftCommandStrings(commandStrArray);
	var commandList = [];
	var temp = "";

	for(var i=0; i < commandDraftStringList.length; i++) {
		
		console.log(commandDraftStringList);
		temp = commandDraftStringList[i].split(";")[0];
		temp_steps = commandDraftStringList[i].split(";")[1];

		if(temp == CMD_MOVE_RIGHT)
			commandList.push(new MoveCommand(temp_steps));
		else if (temp == CMD_MOVE_LEFT)
			commandList.push(new MoveCommand(-temp_steps));
		else if (temp == CMD_SET_X)
			commandList.push(new SetXPosCommand(temp_steps));
		else if (temp == CMD_SET_Y)
			commandList.push(new SetYPosCommand(temp_steps));
		else if (temp == CMD_RESET_POSITION)
			commandList.push(new SetToOriginCommand());
		else if (temp == CMD_JUMP)
			commandList.push(new JumpCommand(temp_steps));
		else if (temp == CMD_SHOW)
			commandList.push(new ShowCommand());
		else if (temp == CMD_HIDE)
			commandList.push(new HideCommand());
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

	for(var i=0; i < commandStrArray.length; i++) {
		str_commandType = commandStrArray[i].split(";")[0];
		str_steps = commandStrArray[i].split(";")[1];
		
		if(str_commandType == CMD_REPEAT)
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
			tempCmdString += str_commandType + ";" + str_steps + " ";
		}
	}
	if(tempCmdString != "")
		finalCmdString+=tempCmdString;

	finalCmdString = finalCmdString.trim();

	listOfCompleteStrCommands = finalCmdString.split(" ");
	return listOfCompleteStrCommands;
};

function CommandProcessor() {

}
/**
 * This is the lowest point of delegation of request where this function
 * performs the ACTUAL execution of the commands
 *
 * @param commandStrArray: an array of Command objects delegated by the FrontControl
 */
CommandProcessor.prototype.processCommands = function(commandObjArr) {
	for(var i=0; i <commandObjArr.length; i++)
		commandObjArr[i].execute();
};