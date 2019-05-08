/*
-------------------------------------------------------------------------
fractalside's kilo.debug - Alpha 0.9 [20180515]
-------------------------------------------------------------------------
http://fratalside.tecnosfera.info , https://github.com/fractalside

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

$k.debug = {}

$k.debug.scoreScroll = function() {
	$("#k-debug-corner-scroll-y").text($(window).scrollTop());
}
$k.debug.scoreResize = function() {
	$("#k-debug-corner-window-x").text(document.body.clientWidth);
	$("#k-debug-corner-window-y").text(document.body.clientHeight);
}


$k.debug.init = function() {
	$("body").append(
		"<div id='k-debug-corner'>" +
		"window: <span id='k-debug-corner-window-x'>?</span> x <span id='k-debug-corner-window-y'>?</span>  <br />" +
		"scroll: <span id='k-debug-corner-scroll-y'>?</span><br />" +
		"</div>"
	);
	
	$(window).scroll(function() {
		$k.debug.scoreScroll();
	});	
	
	$(window).resize(function() {
		$k.debug.scoreResize();
	});	
	
	$k.debug.scoreScroll();
	$k.debug.scoreResize();
	
	$k.log("Debug API initialized");
}

