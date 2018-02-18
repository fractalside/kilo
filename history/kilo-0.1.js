/*
-------------------------------------------------------------------------
fractalside's kilo - Alpha 0.1
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
	'c':{'version':'Alpha 0.1','keyboard':{'shiftWarning':''}},
	'v':{'idsq' : 0,'alreadySubmitted' : false}
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

$k.notice = function(kind, title, id) {
	var c = $k.c.bulletinList;
	try { $('ul' + c.handle).append("<li id='"+$k.id(id)+"' class='" + c.classes[kind] + "'>" + title + "</li>");} catch(e) {$k.log(e.message);}
}

$k.shell = function() { 	
	var again = true;
	var msg = 'Kilo '+$k.c.version+' Shell. "q" or cancel to quit.';
	while (again) {
		var text = prompt("> " + msg + "\r\nK?","","Kilo"); 
		if (text == null || text == "q") {
			again = false;
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
		$("input:submit").prop("disabled",true);
		$k.notice("ok", $k.c.bulletinList.submitted)
		$k.v.alreadySumbitted = true;
	}
}

$k.initSubmit = function() {
	$k.log("initSubmit");
	$("form").submit(function( e ) {
		$k.checkSubmit(e);
	});	
	$($k.c.menuLinks.handle + " a").click(function(e) {
		$k.checkSubmit(e);
	});				
}

$k.initNCheckTable = function() {
	$("<tr><td><input type='checkbox' class='k-nCheckAll' ></td>"+$k.c.nCheckTable.tr+"</tr>").appendTo('table'+$k.c.nCheckTable.handle+' tbody');
	
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
		}
	});
}

$k.init = function(config) {
	if (config != undefined) {
		$k.c = $.extend(true, $k.c, config);
	}
	
	$($k.c.jumpSelect.handle).on('change', function() {
		$k.log("jump");
		$(this).closest("form").submit();
	});
	
	$($k.c.firstField.handle).focus();
	$k.initFreeSelect();
	$k.initSubmit();
	$k.initNCheckTable();
	$k.initKeyboard();
}

