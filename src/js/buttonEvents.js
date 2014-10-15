/*
* gets the right command for the object
*/
var newCommand = function(id) {
	var commandId = id.substring(3);
	return commands[commandId];
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
	
	var listOfCurrentCommands = [];
	
	console.log("[dragdrop.html]: PlayEditor");
	$('.class_code').each(function() {
		$(this).find("li").each(function() {
			var current = $(this);
			if(current.children().size() > 0) {
				return true;
			}
			//create command class and perform commands after loop
			var command = new newCommand(current.attr('id'));
			listOfCurrentCommands.push(command);
		});
		
		//listOfCurrentCommands.push("origin");
		//TODO: delay
        console.log(listOfCurrentCommands.length);
		listOfCurrentCommands.forEach(function(entry) {
			setTimeout(function(){
                entry.execute();
            }, 1000);
            //entry.execute();


		});
		//then delete the list: otherwise it will be summed up?
		listOfCurrentCommands = [];
	});
}