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
	var i = 0;
	for(i; i < commandStrArray.length; i++) {
		var tuple = commandStrArray[i].split(";");
		var cmdType = tuple[0];
		var cmdStep = tuple[1];
		
		
		if (cmdType == CMD_IF) {
			if(i==commandStrArray.length-1)
				console.log(i + " " + "Invalid");
			else {
				i++;
				var nextStatement = commandStrArray[i].split(";");
				var nextCommand;
				
				if(nextStatement[0] == CMD_IF || nextStatement[0] == CMD_REPEAT || nextStatement[0] == CMD_IF )
					console.log("Cannot have nested IF statements, repeat and repeatForever statements");
				else {
					nextCommand = this.constructBasicCommand(nextStatement[0], nextStatement[1]);
					var ifCmd = new IfCommand(tuple[1], tuple[2], tuple[3], tuple[4], tuple[5], nextCommand);
					commandList.push(ifCmd);	
				}
				
			}
			
		}
		else if (cmdType == CMD_REPEAT) {
			
			if(commandBeforeRepeat.length == 0 && commandList.length == 0) {
			
			}
			else {
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
		}
		else if (cmdType == CMD_REPEAT_FOREVER) {
			if(commandBeforeRepeat.length == 0 && commandList.length == 0) {
			
			}
			else {
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
		else {
			commandList.push(this.constructBasicCommand(cmdType, cmdStep));
		}
	}
	
	if(commandBeforeRepeat.length != 0)
		for(var i=0; i < commandBeforeRepeat.length; i++)
			commandList.push(commandBeforeRepeat[i]);
		
	if(commandList.length > 0)
		this.cmdPro.processCommands(commandList);
}

CommandHandler.prototype.constructBasicCommand = function(cmdType, cmdStep) {
	if(cmdType == CMD_MOVE_RIGHT)
		return new MoveCommand(cmdStep);
	else if (cmdType == CMD_MOVE_LEFT)
		return new MoveCommand(-cmdStep);
	else if (cmdType == CMD_SET_X)
		return new SetXPosCommand(cmdStep);
	else if (cmdType == CMD_SET_Y)
		return new SetYPosCommand(cmdStep);
	else if (cmdType == CMD_JUMP)
		return new JumpCommand(cmdStep);
	else if (cmdType == CMD_SHOW)
		return new ShowCommand();
	else if (cmdType == CMD_HIDE)
		return new HideCommand();
	else if (cmdType == CMD_RESET_POSITION)
		return new SetToOriginCommand();
}

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
CommandProcessor.observers = [];
CommandProcessor.executeCommandObservers = [];

CommandProcessor.attachObserver = function(observer) {
	CommandProcessor.observers.push(observer);
}

CommandProcessor.notify = function(delegatedCommand) {
	CommandProcessor.observers.forEach(function(entry) {
			entry.notify(delegatedCommand);
	});
}

CommandProcessor.notifyGameWon = function() {
	CommandProcessor.Interrupt();
	var timer = setInterval( function() {
		MAX_SCORE = 110;
		promptNext();
		clearInterval(timer);
	}, 1000);
}

/**
 * This is the lowest point of delegation of request where this function
 * performs the ACTUAL execution of the commands
 *
 * @param commandStrArray: an array of Command objects delegated by the FrontControl
 */
CommandProcessor.prototype.processCommands = function(commandList) {
	
	CommandProcessor.StaticCommandList = this.cmdList = commandList;
	
	CommandProcessor.hasInterrupted = false;
	
	var i = 0;
	var delay = 1500;
	if(commandList[i] instanceof RepeatCommand)
		delay = 1500 * (commandList[i].getNumRepeatCommands() + 1);
	
	var listObservers = CommandProcessor.observers;
	
	var t1 = setInterval( function() {
		
		// Notify all observer that are suppose to listen for command execution
		// observers mainly play sound
		
			CommandProcessor.notify(commandList[i]);
		
	
		if(commandList[i] instanceof RepeatCommand)
			delay = 1500 * ((commandList[i].getNumRepeatCommands() + 1)*commandList[i].getNumberOfRepeats());
		else if (commandList[i] instanceof IfCommand)
			delay = 1500 * 2;
		else
			delay = 1500;
		
		displayScore();
		
		commandList[i].execute();
		
		i++;
		if(i >= commandList.length || CommandProcessor.hasInterrupted) {
			clearInterval(t1);
			game.resetCharacter();
		}
		if (i == commandList.length || CommandProcessor.hasInterrupted) {
			// decrement score if goal is not reached
			if(!GOAL_ACHIEVED) {
				decrementMaxScore(10);
				displayScore();
			}
		}
	}, delay);
};