
/*  jQuery ready function. Specify a function to execute when the DOM is fully loaded.  */
$(document).ready(
  /* This is the function that will get executed after the DOM is fully loaded */
  function () {
    /* Next part of code handles hovering effect and submenu appearing */
    $('.nav li').hover(
      function () { //appearing on hover
        $('ul', this).fadeIn();
      },
      function () { //disappearing on hover
        $('ul', this).fadeOut();
      }
    );
  }
);

/* 
* function to change to background of the editor panel.
*/
var ChangeBackground = function(url) {
	var editorDiv = document.getElementById( 'editorContainer' );
	editorDiv.style.backgroundImage = "url("+ url + ")";
}

/* 
* function to change to costume of the character.
*/
var ChangeCharacterCostume = function(url) {
	var character = new Character("character_human");
	character.setImage(url);
}

/*
 * function to select game mode.
 */
var ChangeGoalMode = function(mode) {
    var goal = new Goal("goal_object");
    if (mode=="off") {
        goal.hideObject();
        //goal.deleteObject();
    } else if (mode=="on") {
        goal.showObject();
        //goal.placeObject(100,100);
    }
}
// default game mode: without goal
// if goal selected, switch modes
// add call function to add goals
//<li>
//<a href="#">Game Mode</a>
//<ul class="class_MenuGoalModeSelect" id="id_MenuGoalModeSelect">
//<li>
//<a href="#" onclick="ChangeGoalMode('off')">Normal</a>
//</li>
//<li>
//<a href="#" onclick="ChangeGoalMode('on')">Goal</a>
//</li>
//</ul>
//</a>
//</li>