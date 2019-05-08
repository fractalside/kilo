/**
-------------------------------------------------------------------------
fractalside's hotel:kilo.debug - Alpha 0.0.2
(Don't use yet. There's work left)
-------------------------------------------------------------------------
http://fractalside.tecnosfera.info , https://github.com/fractalside
"The miracle is this: the more we share the more we have" 
                                           Leonard Nimoy 1931 - 2015
-------------------------------------------------------------------------
Copyright 2018 fractalside (Gonzalo Virgos Revilla)
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

$k.debug = {"c":{"version":"0.11"}};

$k.debug.pm = new KPostman("Kilo.debug", "en", $k.msj, null);


$k.debug.scoreScroll = function() {
	$("#k-debug-corner-scroll-y").text($(window).scrollTop());
}

$k.debug.scoreResize = function() {
	$("#k-debug-corner-window-x").text(document.body.clientWidth);
//	$("#k-debug-corner-window-y").text(document.body.clientHeight);
	$("#k-debug-corner-window-y").text($(window.top).height());
}

$k.debug.scoreMouse = function(event) {
	$("#k-debug-mouse-x").text(event.pageX);
	$("#k-debug-mouse-y").text(event.pageY);
}

$k.debug.shell = function() { 	
	var again = true;
	var msg = 'Kilo ' + $k.c.version + ' Shell. "q" or cancel to quit.';
	while (again) {
		var text = prompt("> " + msg + "\r\nK?","","Kilo"); 
		if (text == null || text == "q") {
			again = false;
		} else if (text == "-submit") {
			$k.discardSubmit();
			again = false;
//			msg = "Submit lock broken";
		} else {
			msg = text + " is not a recognized command.";
		}
	}
}


$k.debug.init = function() {
	var kd = $k.debug;
	kd.pm.verbose(true);

//	kd.pm.log("Body? " + $("body").length);
	$("body").append(
		"<div id='k-debug-window' class='draggable' style='display:none;' >" +
		"window: <span id='k-debug-corner-window-x'>?</span> x <span id='k-debug-corner-window-y'>?</span>  <br />" +
		"scroll: <span id='k-debug-corner-scroll-y'>?</span><br />" +
		"cursor: <span id='k-debug-mouse-x'>?</span> x  <span id='k-debug-mouse-y'>?</span><br />" +
		"caplock: "+ $k.v.capslock + "<br />" +  
		"<input type='button' value='shell' onclick='$k.debug.shell();' />" +
		"</div>"
	);
	
	$(".draggable").mousedown(function( event ) {
		$k.grab = {"x":event.pageX,"y":event.pageY,"id":$(this).attr("id"),"top":$(this).position.top,"left":$(this).position.left};
		$k.pm.log("Grab: "+$k.jsons($k.grab));
	});		
	
	$(".draggable").mouseup(function( event ) {
		$k.grab = null;
	});
	
	
	$(window).mousemove(function( event ) {
		$k.debug.scoreMouse(event);
	});
	
	$(window).scroll(function() {
		$k.debug.scoreScroll();
	});	
	
	$(window).resize(function() {
		$k.debug.scoreResize();
	});	
	
	kd.scoreScroll();
	kd.scoreResize();
	$(document).keydown(function (e) {
		if (e.keyCode == 68 && e.ctrlKey && e.altKey) {
			$("div#k-debug-window").slideToggle(300);
		} 	
	});
	kd.pm.logEnabled("main", true, null, "Version: " + kd.c.version);
}
