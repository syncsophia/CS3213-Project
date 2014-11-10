var MusicEditor = function() {

	var musicEnabled = StartGame.ToogleMusic();
	if(musicEnabled)
		$("#id_btnMusicImg").attr("src", "img/btn_musicon.png");
	else
		$("#id_btnMusicImg").attr("src", "img/btn_musicoff.png");
}

/* User pressed stop button
*/
var StopEditor = function() {
	CommandProcessor.Interrupt();
	game.resetCharacter();
};

/* clears the code panel
*/
var ClearEditor = function() {
	$('.class_code').each(function() {
		$(this).find("li").remove();
	});
	// and stop execution if any
	CommandProcessor.Interrupt();
	game.resetCharacter();
}

/* User pressed play button */
var PlayEditor = function() {

	var characterElement = document.getElementById("character_human");
	
	var origin_x_of_Character = $("#character_human").css("left");
	var origin_y_of_Character = $("#character_human").css("top");
	
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
			else if (arr_SelectedItems.length == 4) {
				parameters = arr_SelectedItems[0] + ";" + arr_SelectedItems[1] + ";" + arr_SelectedItems[2] + ";" + 
							 arr_SelectedItems[3] + ";" + current.find("#para5").val();
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
		
		// ask the frontControl to deal with all Requests
		frontCtrl.getCommand(listOfCurrentCommands);
		
		listOfCurrentCommands = [];
	});
}

var createDiv = function()
{
    var newDiv = document.createElement('div');
    newDiv.className = 'class_code';
    newDiv.innerHTML = "I'm the first div";
    document.getElementById("dhtmlgoodies_mainContainer").appendChild(newDiv);

}