/************************************************************************************************************
	Textarea maxlength
	Copyright (C) November 2005  DTHMLGoodies.com, Alf Magne Kalleland

	This library is free software; you can redistribute it and/or
	modify it under the terms of the GNU Lesser General Public
	License as published by the Free Software Foundation; either
	version 2.1 of the License, or (at your option) any later version.

	This library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public
	License along with this library; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

	Dhtmlgoodies.com., hereby disclaims all copyright interest in this script
	written by Alf Magne Kalleland.

	Alf Magne Kalleland, 2010
	Owner of DHTMLgoodies.com

	************************************************************************************************************/

	/* VARIABLES YOU COULD MODIFY */
	var boxSizeArray = [15, 10];	// Array indicating how many items there is rooom for in the right column ULs


	var verticalSpaceBetweenListItems = 3;	// Pixels space between one <li> and next
											// Same value or higher as margin bottom in CSS for #dhtmlgoodies_dragDropContainer ul li,#dragContent li


	var indicateDestionationByUseOfArrow = true;	// Display arrow to indicate where object will be dropped(false = use rectangle)

	var cloneSourceItems = true;	// Items picked from main container will be cloned(i.e. "copy" instead of "cut").
	var cloneAllowDuplicates = true;	// Allow multiple instances of an item inside a small box(example: drag Student 1 to team A twice

	/* END VARIABLES YOU COULD MODIFY */

	var dragDropTopContainer = false;
	var dragTimer = -1;
	var dragContentObj = false;		// the content object to be dragged
	var contentToBeDragged = false;	// Reference to dragged <li>
	var contentToBeDragged_src = false;	// Reference to parent of <li> before drag started
	var contentToBeDragged_next = false; 	// Reference to next sibling of <li> to be dragged
	var destinationObj = false;	// Reference to <UL> or <LI> where element is dropped.
	var dragDropIndicator = false;	// Reference to small arrow indicating where items will be dropped
	var ulPositionArray = new Array();
	var mouseoverObj = false;	// Reference to highlighted DIV

	var MSIE = navigator.userAgent.indexOf('MSIE')>=0?true:false;
	var navigatorVersion = navigator.appVersion.replace(/.*?MSIE (\d\.\d).*/g,'$1')/1;

	var arrow_offsetX = -5;	// Offset X - position of small arrow
	var arrow_offsetY = 0;	// Offset Y - position of small arrow

	if(!MSIE || navigatorVersion > 6){
		arrow_offsetX = -6;	// Firefox - offset X small arrow
		arrow_offsetY = -13; // Firefox - offset Y small arrow
	}

	var indicateDestinationBox = false;
	function getTopPos(inputObj)
	{
	  var returnValue = inputObj.offsetTop;
	  while((inputObj = inputObj.offsetParent) != null){
	  	if(inputObj.tagName!='LI')returnValue += inputObj.offsetTop;
	  }
	  return returnValue;
	}

	function getLeftPos(inputObj)
	{
	  var returnValue = inputObj.offsetLeft;
	  while((inputObj = inputObj.offsetParent) != null){
	  	if(inputObj.tagName!='LI')returnValue += inputObj.offsetLeft;
	  }
	  return returnValue;
	}

	function cancelEvent()
	{
		return false;
	}
	function initDrag(e)	// Mouse button is pressed down on a LI
	{
		if(document.all)e = event;
		var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
		var sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);

		dragTimer = 0;
		dragContentObj.style.left = e.clientX + sl + 'px';
		dragContentObj.style.top = e.clientY + st + 'px';
		contentToBeDragged = this;
		contentToBeDragged_src = this.parentNode;
		contentToBeDragged_next = false;
		if(this.nextSibling){
			contentToBeDragged_next = this.nextSibling;
			if(!this.tagName && contentToBeDragged_next.nextSibling)
				contentToBeDragged_next = contentToBeDragged_next.nextSibling;
		}
		timerDrag();
		return false;
	}

	function timerDrag()
	{
		if(dragTimer>=0 && dragTimer<10){
			dragTimer++;
			setTimeout('timerDrag()',10);
			return;
		}
		if(dragTimer==10){

			if(cloneSourceItems && contentToBeDragged.parentNode.id=='allItems'){
				newItem = contentToBeDragged.cloneNode(true);
				newItem.onmousedown = contentToBeDragged.onmousedown;
				contentToBeDragged = newItem;
			}
			dragContentObj.style.display='block';
			dragContentObj.appendChild(contentToBeDragged);
		}
	}

	function moveDragContent(e)
	{
		if(dragTimer<10){
			if(contentToBeDragged){
				if(contentToBeDragged_next){
					contentToBeDragged_src.insertBefore(contentToBeDragged,contentToBeDragged_next);
				}else{
					contentToBeDragged_src.appendChild(contentToBeDragged);
				}
			}
			return;
		}
		if(document.all)e = event;
		var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
		var sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);


		dragContentObj.style.left = e.clientX + sl + 'px';
		dragContentObj.style.top = e.clientY + st + 'px';

		if(mouseoverObj)mouseoverObj.className='';
		destinationObj = false;
		dragDropIndicator.style.display='none';
		if(indicateDestinationBox)indicateDestinationBox.style.display='none';
		var x = e.clientX + sl;
		var y = e.clientY + st;
		var width = dragContentObj.offsetWidth;
		var height = dragContentObj.offsetHeight;

		var tmpOffsetX = arrow_offsetX;
		var tmpOffsetY = arrow_offsetY;

		for(var no=0;no<ulPositionArray.length;no++){
			var ul_leftPos = ulPositionArray[no]['left'];
			var ul_topPos = ulPositionArray[no]['top'];
			var ul_height = ulPositionArray[no]['height'];
			var ul_width = ulPositionArray[no]['width'];

			if((x+width) > ul_leftPos && x<(ul_leftPos + ul_width) && (y+height)> ul_topPos && y<(ul_topPos + ul_height)){
				var noExisting = ulPositionArray[no]['obj'].getElementsByTagName('LI').length;
				if(indicateDestinationBox && indicateDestinationBox.parentNode==ulPositionArray[no]['obj'])noExisting--;
				if(noExisting<boxSizeArray[no-1] || no==0){
					dragDropIndicator.style.left = ul_leftPos + tmpOffsetX + 'px';
					var subLi = ulPositionArray[no]['obj'].getElementsByTagName('LI');

					var clonedItemAllreadyAdded = false;
					if(cloneSourceItems && !cloneAllowDuplicates){
						for(var liIndex=0;liIndex<subLi.length;liIndex++){
							if(contentToBeDragged.id == subLi[liIndex].id)clonedItemAllreadyAdded = true;
						}
						if(clonedItemAllreadyAdded)continue;
					}

					for(var liIndex=0;liIndex<subLi.length;liIndex++){
						var tmpTop = getTopPos(subLi[liIndex]);
						if(!indicateDestionationByUseOfArrow){
							if(y<tmpTop){
								destinationObj = subLi[liIndex];
								indicateDestinationBox.style.display='block';
								subLi[liIndex].parentNode.insertBefore(indicateDestinationBox,subLi[liIndex]);
								break;
							}
						}else{
							if(y<tmpTop){
								destinationObj = subLi[liIndex];
								dragDropIndicator.style.top = tmpTop + tmpOffsetY - Math.round(dragDropIndicator.clientHeight/2) + 'px';
								dragDropIndicator.style.display='block';
								break;
							}
						}
					}

					if(!indicateDestionationByUseOfArrow){
						if(indicateDestinationBox.style.display=='none'){
							indicateDestinationBox.style.display='block';
							ulPositionArray[no]['obj'].appendChild(indicateDestinationBox);
						}

					}else{
						if(subLi.length>0 && dragDropIndicator.style.display=='none'){
							dragDropIndicator.style.top = getTopPos(subLi[subLi.length-1]) + subLi[subLi.length-1].offsetHeight + tmpOffsetY + 'px';
							dragDropIndicator.style.display='block';
						}
						if(subLi.length==0){
							dragDropIndicator.style.top = ul_topPos + arrow_offsetY + 'px'
							dragDropIndicator.style.display='block';
						}
					}

					if(!destinationObj)destinationObj = ulPositionArray[no]['obj'];
					mouseoverObj = ulPositionArray[no]['obj'].parentNode;
					mouseoverObj.className='mouseover';
					return;
				}
			}
		}
	}

	/* End dragging
	Put <LI> into a destination or back to where it came from.
	*/
	function dragDropEnd(e)
	{
		if(dragTimer==-1)return;
		if(dragTimer<10){
			dragTimer = -1;
			return;
		}
		dragTimer = -1;
		if(document.all)e = event;


		if(cloneSourceItems && (!destinationObj || (destinationObj && (destinationObj.id=='allItems' || destinationObj.parentNode.id=='allItems')))){
			contentToBeDragged.parentNode.removeChild(contentToBeDragged);
		}else{

			if(destinationObj){
				var buttonHTML = " <input type='button' id='button_enable_" + contentToBeDragged.id + "' onclick='$(this).parent().parent().remove();' style='background: url(img/delete-icon.gif) no-repeat; cursor:pointer; border: none; height:20px; width:20px; float:right;'";
				
				// Change text to text with step field if the command needs a textfield
				if (contentToBeDragged.id.indexOf("Hide") == -1 && 
					contentToBeDragged.id.indexOf("Show") == -1 && 
					contentToBeDragged.id.indexOf("Reset") == -1 &&
					contentToBeDragged.id.indexOf("Repeat_Forever") == -1){
						if(contentToBeDragged.id.indexOf("If") != -1)
						{
							contentToBeDragged.innerHTML = "<form>" + contentToBeDragged.id.substring(3) + 
								" <select autofocus> <option value='para1_1'>Character.X</option><option value='para1_2'>Character.Y</option></select>" +  buttonHTML + "<br>" +	
								" <select autofocus> <option value='para2_1'><</option> <option value='para_2'>></option> <option value='para2_3'>=</option></select>" + 
								" <select autofocus> <option value='para3_1'>Goal.X</option><option value='para3_1_1'>Goal.Y</option>" +
								"</select>" + "</form>" +	
								" <select autofocus> <option value='para4_1'>+</option> <option value='para4_2'>-</option> <option value='para4_3'>*</option> <option value='para4_4'>/</option></select>" +	
								" <input type='number' id='para5' autofocus value='1' style='width:35px;' min='1' max='250'>" ;
								contentToBeDragged.onmousedown = function() {};
						} else if(contentToBeDragged.id.indexOf("Set") != -1) {
							var textFieldHTML = "<input type='number' id='steps_" + contentToBeDragged.id + "' autofocus value='1' style='width:35px;' min='0' max='500'>";
							contentToBeDragged.innerHTML = "<form>" + contentToBeDragged.id.substring(3) + ":" + textFieldHTML + buttonHTML + "</form>"; 
							// Disable drag drop to enable clicking and editing the text field.
							contentToBeDragged.onmousedown = function() {};
						} else {
<<<<<<< HEAD
						var textFieldHTML = "<input type='number' id='steps_" + contentToBeDragged.id + "' autofocus value='1' style='width:30px;' min='-10' max='10'>";
						contentToBeDragged.innerHTML = "<form>" + contentToBeDragged.id.substring(3) + ":" + textFieldHTML + buttonHTML + "</form>"; 
						// Disable drag drop to enable clicking and editing the text field.
						contentToBeDragged.onmousedown = function() {};
=======
							var textFieldHTML = "<input type='number' id='steps_" + contentToBeDragged.id + "' autofocus value='1' style='width:30px;' min='-50' max='50'>";
							contentToBeDragged.innerHTML = "<form>" + contentToBeDragged.id.substring(3) + ":" + textFieldHTML + buttonHTML + "</form>"; 
							// Disable drag drop to enable clicking and editing the text field.
							contentToBeDragged.onmousedown = function() {};
>>>>>>> FETCH_HEAD
					}
				}
				else {
					contentToBeDragged.innerHTML = "<form>" + contentToBeDragged.id.substring(3) + buttonHTML +"</form>";
					contentToBeDragged.onmousedown = function() {};
				}

				if(destinationObj.tagName=='UL'){
					destinationObj.appendChild(contentToBeDragged);
				}else{
					destinationObj.parentNode.insertBefore(contentToBeDragged,destinationObj);
				}
				mouseoverObj.className='';
				destinationObj = false;
				dragDropIndicator.style.display='none';
				if(indicateDestinationBox){
					indicateDestinationBox.style.display='none';
					document.body.appendChild(indicateDestinationBox);
				}
				contentToBeDragged = false;
				return;
			}
			if(contentToBeDragged_next){
				contentToBeDragged_src.insertBefore(contentToBeDragged,contentToBeDragged_next);
			}else{
				contentToBeDragged_src.appendChild(contentToBeDragged);
			}
		}
		contentToBeDragged = false;
		dragDropIndicator.style.display='none';
		if(indicateDestinationBox){
			indicateDestinationBox.style.display='none';
			document.body.appendChild(indicateDestinationBox);

		}
		mouseoverObj = false;

	}

	/*
	Preparing data to be saved
	*/
	function saveDragDropNodes()
	{
		console.log("Button Save Pressed");

		var saveString = "";
		var uls = dragDropTopContainer.getElementsByTagName('UL');
		var lis = uls[1].getElementsByTagName('LI');
		for(var no=0;no<lis.length;no++){	// LOoping through all <ul>
			
			// print all the attributes of the elements LI
			$(lis[no].attributes).each(function(index, attribute) {
			  console.log(no + ":" + "Attribute:"+attribute.nodeName+" | Value:"+attribute.nodeValue);
			});
			//console.log(lis[no].id + " " + lis[no].nodeName + " " + lis[no].nodeValue);
		}
		/*
		for(var no=0;no<uls.length;no++){	// LOoping through all <ul>
			var lis = uls[no].getElementsByTagName('LI');
			for(var no2=0;no2<lis.length;no2++){
				if(saveString.length>0)saveString = saveString + ";";
				saveString = saveString + uls[no].id + '|' + lis[no2].id;
				
			}
		}
		*/

		/*
		var saveString = "";
		var uls = dragDropTopContainer.getElementsByTagName('UL');
		for(var no=0;no<uls.length;no++){	// LOoping through all <ul>
			var lis = uls[no].getElementsByTagName('LI');
			for(var no2=0;no2<lis.length;no2++){
				if(saveString.length>0)saveString = saveString + ";";
				saveString = saveString + uls[no].id + '|' + lis[no2].id;
			}
		}

		document.getElementById('saveContent').innerHTML = '<h1>Ready to save these nodes:</h1> ' + saveString.replace(/;/g,';<br>') + '<p>Format: ID of ul |(pipe) ID of li;(semicolon)</p><p>You can put these values into a hidden form fields, post it to the server and explode the submitted value there</p>';
		*/

	}

	function initDragDropScript()
	{

		dragContentObj = document.getElementById('dragContent');
		dragDropIndicator = document.getElementById('dragDropIndicator');
		dragDropTopContainer = document.getElementById('dhtmlgoodies_dragDropContainer');
		document.documentElement.onselectstart = cancelEvent;;
		var listItems = dragDropTopContainer.getElementsByTagName('LI');	// Get array containing all <LI>
		var itemHeight = false;
		for(var no=0;no<listItems.length;no++){
			listItems[no].onmousedown = initDrag;
			listItems[no].onselectstart = cancelEvent;
			if(!itemHeight)itemHeight = listItems[no].offsetHeight;
			if(MSIE && navigatorVersion/1<6){
				listItems[no].style.cursor='hand';
			}
		}

		var mainContainer = document.getElementById('dhtmlgoodies_mainContainer');
		var uls = mainContainer.getElementsByTagName('UL');
		itemHeight = itemHeight + verticalSpaceBetweenListItems;
		for(var no=0;no<uls.length;no++){
			uls[no].style.height = itemHeight * boxSizeArray[no]  + 'px';
		}

		var leftContainer = document.getElementById('dhtmlgoodies_listOfItems');
		var itemBox = leftContainer.getElementsByTagName('UL')[0];

		document.documentElement.onmousemove = moveDragContent;	// Mouse move event - moving draggable div
		document.documentElement.onmouseup = dragDropEnd;	// Mouse move event - moving draggable div

		var ulArray = dragDropTopContainer.getElementsByTagName('UL');
		for(var no=0;no<ulArray.length;no++){
			ulPositionArray[no] = new Array();
			ulPositionArray[no]['left'] = getLeftPos(ulArray[no]);
			ulPositionArray[no]['top'] = getTopPos(ulArray[no]);
			ulPositionArray[no]['width'] = ulArray[no].offsetWidth;
			ulPositionArray[no]['height'] = ulArray[no].clientHeight;
			ulPositionArray[no]['obj'] = ulArray[no];
		}

		if(!indicateDestionationByUseOfArrow){
			indicateDestinationBox = document.createElement('LI');
			indicateDestinationBox.id = 'indicateDestination';
			indicateDestinationBox.style.display='none';
			document.body.appendChild(indicateDestinationBox);
		}
	}

    function traceMouse(e)
    {
        var x = e.clientX - 379;
        var y = e.clientY - 54;
        var coor = "Coordinates: (" + x + "," + y + ")";
        document.getElementById("coordinate").innerHTML = coor;
    }
	window.onload = initDragDropScript;