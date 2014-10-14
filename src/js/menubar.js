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
	var characterElement = document.getElementById('character_human');
	characterElement.src = url;
}