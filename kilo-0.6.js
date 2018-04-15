/*
-------------------------------------------------------------------------
fractalside's kilo - Alpha 0.6 [20180415]
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

var $k = {
	'c':{
		'version':'Alpha 0.6',
		'keyboard':{'shiftWarning':''},
		"table":{"even":"k-even","odd":"k-odd","hoverSuffix":"-hover"}
	},
	'v':{'firstFocus' : false, 'idsq' : 0,'taskSq':0,'taskTb':[],'alreadySubmitted' : false, 'capslock': -1}
}

$k.log = function(text) {
	try{console.log("Kilo:",text);}catch(e){}
}

$k.nCheckAll = function(obj) {
	$k.log("nCheckAll");
	$(obj).closest('table').css("border:1px solid #c0c0c0;");
}

$k.id = function(candidate) {
	return (candidate == null) ? 'kilo'+($k.v.idsq++) : candidate; 
}

$k.notice = function(kind, title, id, msIn) {
	msIn = (msIn == undefined)? 0 : msIn;
	var c = $k.c.bulletinList;
	var ul = $('ul' + c.handle);
	try { 
		$k.log("ul.display:"+ul.css("display")+" animacion: "+msIn );
		if (ul.css("display")=="none") {
			$k.log("bulletinlist:hidden");
			ul.css("display","");
			ul.empty();
		}
		var id = $k.id(id);
		var h = "<li id='"+id+"' class='" + c.classes[kind] + "' ";
		h = h + ((msIn > 0) ? "style='display:none;'" : "");
		h = h + ">" + title + "</li>";
		ul.append(h);
		if (msIn > 0) {
			$("#"+id).slideToggle(msIn);
		}
	} catch(e) {$k.log(e.message);}
}

$k.removeNote = function(id) {
	var c = $k.c.bulletinList;
	var ul = $('ul' + c.handle);
	ul.find('li#'+id).remove();
}

$k.hasNote = function(id) {
	return (( $('ul' + $k.c.bulletinList.handle).find('li#' + id).length) > 0);
}

$k.shell = function() { 	
	var again = true;
	var msg = 'Kilo '+$k.c.version+' Shell. "q" or cancel to quit.';
	while (again) {
		var text = prompt("> " + msg + "\r\nK?","","Kilo"); 
		if (text == null || text == "q") {
		} else if (text == "-submit") {
			$("input:submit").removeClass($k.c.submitCheck.disabled);
			$k.removeNote("submit-note");
			$k.v.alreadySumbitted = false;
			again = false;
//			msg = "Submit lock broken";
		} else {
			msg = text + " is not a recognized command.";
		}
	}
}

$k.checkSubmit = function(e) {
	$k.log("Submit...");
	if ($k.v.alreadySumbitted) {
		$k.log("disabled submit: already submitted");
		e.preventDefault();
	} else {
		$("input:submit").addClass($k.c.submitCheck.disabled);
		$k.log("Submit delay: "+$k.c.bulletinList.submitted.msDelayIn);
		setTimeout(function() {
			$k.notice("ok", $k.c.bulletinList.submitted.note,"submit-note", 500)
			setInterval(function(){
				$("#submit-note").append(".");
			},1000);
		},$k.c.bulletinList.submitted.msDelayIn);
		$k.v.alreadySumbitted = true;
	}
}

$k.addTask = function(task) {
	var idx = $k.v.taskSq;
	$k.v.taskTb[idx] = task;
	$k.v.taskSq = idx + 1;
	return idx;
}

$k.doTask = function(idx) {
}

$k.initSubmit = function() {
	$k.log("initSubmit");
	$("form").submit(function( e ) {
		if($(document.activeElement).hasClass($k.c.submitCheck.except)) {
			$k.log("safe submit exception");
		} else {
			$k.checkSubmit(e);
		}
	});	
	$("a").not($k.c.menuLinks.except).click(function(e) {
		$k.checkSubmit(e);
	});				
}

$k.initNCheckTable = function() {
	var trh = $k.c.nCheckTable.tr.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace("$k", "<input type='checkbox' class='k-nCheckAll' >");
	$k.log(trh);
	$(trh).appendTo('table' + $k.c.nCheckTable.handle + ' tbody');
	$('table' + $k.c.nCheckTable.handle + ' input:checkbox').click(function(event) {
		if ($(this).hasClass("k-nCheckAll")) {
			var allNone = $(this).prop("checked");
			$k.log("check "+(allNone)?"ALL":"NONE");
			$(this).closest("table").find("input:checkbox").each(function(index) {
				if ($(this).prop("checked")==!allNone) {
					$(this).click();
				}
			});
		}
		event.stopPropagation();
	});
	
	$('table'+$k.c.nCheckTable.handle + ' tr').click(function() {
		$k.log("nCheckTable tr click");
		var check = $(this).find("input:checkbox");
		check.click();
    });
}

$k.initFreeSelect = function() {
	var c = $k.c.freeSelect;
	
	$(c.handle).each(function(index) {
		var freeDiv = $("#" + $(this).attr('id') + c.suffix);
		var freeOpt = freeDiv.find("input:text");
		freeOpt.width(c.width);
		if ($(this).val() != c.opt) {
			freeDiv.hide();
			freeOpt.val('');
		}
	});
	
	$(c.handle).on('change', function() {
		var freeDiv = $("#" + $(this).attr('id') + c.suffix);
		var freeOpt = freeDiv.find("input:text");
		if (this.value == c.opt) {
			freeDiv.show(400);
			freeOpt.focus();
		} else {
			freeDiv.hide(400);
			freeOpt.val('');
		}
	})
}

$k.initKeyboard = function() {
//	var shiftWarning = $k.c.keyboard.shiftWarning;
	$(document).keydown(function (e) {
		if (e.keyCode == 114 && e.ctrlKey) {
			$k.shell();
		} else if (e.keyCode == 67 && e.ctrlKey && e.altKey) {
			$("#gp4-consola").slideToggle(300);
		} else if (e.keyCode == 20) {
			if ($k.v.capslock == 1) {
				$k.capslock(false);
			} else if ($k.v.capslock == 0) {
				$k.capslock(true);
			}
		} 
	});
}

$k.initTable = function() {
	$("."+$k.c.table.even).on('mouseover', function() {
		$(this).removeClass($k.c.table.even).addClass($k.c.table.even + $k.c.table.hoverSuffix);
	});
	$("."+$k.c.table.even).on('mouseout', function() {
		$(this).removeClass($k.c.table.even + $k.c.table.hoverSuffix).addClass($k.c.table.even);
	});
	$("."+$k.c.table.odd).on('mouseover', function() {
		$(this).removeClass($k.c.table.odd).addClass($k.c.table.odd + $k.c.table.hoverSuffix);
	});
	$("."+$k.c.table.odd).on('mouseout', function() {
		$(this).removeClass($k.c.table.odd + $k.c.table.hoverSuffix).addClass($k.c.table.odd);
	});
}

$k.upc = function(str) { return (str.toUpperCase())};
$k.lwc = function(str) { return (str.toLowerCase())};


$k.initPassword = function() {
    $(':password').keypress(function(e) { // 20?
        var s = String.fromCharCode( e.which );
        if (($k.upc(s) === s && $k.lwc(s) !== s && !e.shiftKey) || ($k.upc(s) !== s && $k.lwc(s) === s && e.shiftKey)) {
			$k.capslock(true);
        } else if (($k.lwc(s) === s && $k.upc(s) !== s && !e.shiftKey)|| ($k.lwc(s) !== s && $k.upc(s) === s && e.shiftKey)) {
			$k.capslock(false);
		}
    });
}

$k.capslock = function(on) {
	if(on){
		if (!$k.hasNote("capslock-note")) {
			$k.notice("warn", $k.c.checkPass.capsLockText,"capslock-note");
			$k.v.capslock = 1;
		}
	} else {
		$k.removeNote("capslock-note");
		$k.v.capslock = 0;
	}
}

$k.getNoteFieldName = function(obj) {
	var id = obj.attr("id");
	if (id == undefined) {
		return "";
	}
	var idx = id.indexOf($k.c.fieldNotes.prefix);
	if (idx == -1) {
		return "";
	}
	var lastIdx = id.lastIndexOf("_");
	var r = id.substring(idx + $k.c.fieldNotes.prefix.length, lastIdx);
	return r;
}

$k.css = function (obj, name, value, ms) {
	try {
		var param = {color : value};
		if (name=="backgroundColor") {
			param = {backgroundColor : value}
		} else if (name=="borderColor") {
			param = {borderColor : value}
		} 
		obj.animate(param, ms);
	} catch(e) {
		obj.css(name, value);
	}
}

$k.initFieldNotes = function() {
	if ($k.c.fieldNotes == undefined) {
		return;
	}
	$('ul' + $k.c.bulletinList.handle).find('li').each(function(index) {
		if ($(this).attr("id") != undefined)  {
			var ink = "normal";
			for (var i in $k.c.bulletinList.classes) { 
				if ($k.c.bulletinList.classes[i]==$(this).attr("class")) {
					ink = i;
					break;
				}
			}			

			$k.log("Note: "+$(this).html()+" ink "+ink);

			$(this).on('mouseover', function() {
//				$k.css($(":input[name='"+$k.getNoteFieldName($(this))+"']"),"borderColor", $k.c.fieldNotes.borderInk.warn,300);
				$(":input[name='"+$k.getNoteFieldName($(this))+"']").css("border","2px solid "+$k.c.fieldNotes.borderInk[ink]);
			});
			$(this).on('mouseout', function() {
//				$k.css($(":input[name='"+$k.getNoteFieldName($(this))+"']"),"borderColor", $k.c.fieldNotes.borderInk.normal,700);
				$(":input[name='"+$k.getNoteFieldName($(this))+"']").css("border","1px solid "+$k.c.fieldNotes.borderInk[ink]);
			});
			$(this).on('click', function() {
				$(":input[name='"+$k.getNoteFieldName($(this))+"']").focus();
			});
			
			//field?
			var name = $k.getNoteFieldName($(this));
			var fieldSelector = ":input[name='" + name + "']";
			
			$(fieldSelector).css("border","1px solid "+$k.c.fieldNotes.borderInk[ink]);

			//focusing
			var item;
			for (var i =0; i < $k.c.bulletinList.focusable.length; i++) {
				item = $k.c.bulletinList.classes[$k.c.bulletinList.focusable[i]];
				if ($(this).hasClass(item)) {
				$k.log("focus class "+item+" name "+name);
					$(fieldSelector).focus();
					$k.v.firstFocus = true;
				}
			}
			
			$(fieldSelector).data("note", $(this).attr("id"));
			
			$(fieldSelector).on('mouseover', function() {
				//check if applies popup
				var popUp = false; 
				var item;
				for (var i =0;i < $k.c.bulletinList.popupable.length; i++) {
					item = $k.c.bulletinList.classes[$k.c.bulletinList.popupable[i]];
					if ($("li#" + $(this).data("note")).hasClass(item)) {
						popUp = true;
						break;
					}
				}
				
				$("li#" + $(this).data("note")).css("textDecoration", "underline");
				
				if (popUp) {
					var offset = $(this).offset();
					var bottom = offset.top + $(this).height() + 10;
					
					$("body").append(
						"<div id='fieldNote_"+$(this).attr("id")+"' class='k-pop' style='display:none;top:"+bottom
						+"px;left:"+offset.left
						+"px;'>"+$("li#" + $(this).data("note")).html()+"</div>"
					);
					$("#fieldNote_"+$(this).attr("id")).show(700);
				}
			});
			
			$(fieldSelector).on('mouseout', function() {
				$("li#" + $(this).data("note")).css("textDecoration", "none");
				$("div#fieldNote_"+$(this).attr("id")).remove();
			});
		}
	})
}

$k.initJumpSelect = function() {
	$($k.c.jumpSelect.handle).each(function(index) {
		$jumpOp1 = $(this).find('option:eq(0)');
		$jumpOp1.text($jumpOp1.text().replace($k.c.jumpSelect.remove,""));
	});
	
	$($k.c.jumpSelect.handle).on('change', function() {
		$k.log("jump");
		$(this).closest("form").append(
			"<input type='hidden' name='kilo' value='" + 
			$k.c.jumpSelect.submitValue + ":" + $(this).attr("name") + "' >"
		);
		$(this).closest("form").submit();
	});
}

//after initFieldNotes
$k.focusFirstField = function() {
	if (!$k.v.firstFocus) {
		$k.log("focus first handled");
		$($k.c.firstField.handle).first().focus();
	}
}

$k.init = function(config) {
	if (config != undefined) {
		$k.c = $.extend(true, $k.c, config);
	}
	$k.log("Init..." + $k.c.version);

	$k.initFreeSelect();
	$k.initPassword();
	$k.initJumpSelect();
	$k.initSubmit();
	$k.initTable();
	$k.initNCheckTable();
	$k.initKeyboard();
	$k.initFieldNotes();
	$k.focusFirstField();
	
}

