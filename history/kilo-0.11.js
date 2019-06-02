/**
-------------------------------------------------------------------------
fractalside's kilo - Alpha 0.11
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

function KPostman(loghead, lang, source, logger) {
	var inner_log = function(msg) {console.log(msg);};
	var inner_dialoger = function(msg) {alert(msg);};
	var verboseOn = false;
	var statusPad = 30;
	
	const STATUS = {"ERROR" : "ERROR", "ENABLED" : " ON  ", "DISABLED" : " OFF "};
	
	lang = (lang == null) ? "en" : lang;
	this.source = null;
	if (source == null) {
		inner_log("KPostman: null source");
	} else if (source[lang] == null) {
		inner_log("KPostman: null source for language ", lang);
	} else {
		this.source = source[lang];
	}
	this.lang = lang;	
	this.loghead = loghead;
	
	if (logger != null)  {
		var inner_log = logger;
	}
	
	
	this.redact = function (raw) {
		var result = raw;
		if (this.source != null) {
			var result = raw.replace(/\$m\.([a-zA-Z0-9]*)/gm, function (str, p1, offset, s){
				var replace = this.source[this.lang][p1];
				return (replace==null)? "$m[" + this.lang + "]???" + p1 : replace;
			});
		}
		return result;
	}
	
	this.logSimple = function(msg) {inner_log(this.redact(msg));}
	this.log = function (msg) {this.logSimple(this.loghead + ": " + msg);}
	this.logIf = function(condition, msg) {if(condition) {this.log(msg);}}
	this.verbose = function (bool) {verboseOn = bool;}
	this.dfs = function(defaultStr, str) {return ((str==null) ? defaultStr : str);}

	this.error = function (event, message) {
		  var msg = this.loghead + ": " + message;
		  if (event != null) {
			  msg += " " + event.message + " ",event.stack;
		  }
		  try {inner_log(redact(msg));} catch(event) {}

	}

	this.pad = function (str, max, pad, leftRight) {
		return str.length < max ? this.pad(((leftRight == 0) ? pad + str : str + pad), max, pad, leftRight) : str;
	}
	
	this.logEnabled = function(system, condition, error, normalSuffix) {
		if (error != null) {
			var first = error.stack.split("\n")[4];
			var index = first.indexOf("at ");
			var clean = first.slice(index + 2, first.length);
			this.logStatus(system, STATUS.ERROR, error.message + " line: " + index);
			return false;
		} else if (verboseOn) {
			this.logStatus(system,(condition) ? STATUS.ENABLED : STATUS.DISABLED, normalSuffix);
		}
		return condition;
	}
	

	this.logStatus = function(system, status, suffix) {
		this.logSimple(this.pad(loghead + "." +system, statusPad, ".", 1) + "[ " + status + " ] " + this.dfs("", suffix));
	}	
	

}

var $k = {
	'c':{
		'version' : 'Alpha 0.11',
		'verbose' : false,
		"formSubmitLock" : false,
		"linkSubmitLock" : false,
		"submitCheck" : {"disabled":"disabled"},
		'keyboard':{'ctrlAltConsoleJqh': 'k-console'},
		'field' : {'popupClass': 'k-pop'},
		"table" : {"even":"k-even","odd": "k-odd","hoverSuffix": "-hover"},
	},
	'v':{
		'sewingNote' :[],
		'sewing':[],
		'firstFocus' : false, 
		'idsq' : 0,
		'fieldCursor' : {'mouse':'','keyboard':''},
		'taskSq': 0 ,
		'taskTb':[],
		'alreadySubmitted' : false, 
		'capslock': -1
	},
	'msj':{'en':{}}
}

$k.pm = new KPostman("Kilo", "en", $k.msj, null);

//One-lines
$k.log = function(text) { return $k.pm.log(text);}
$k.error = function(error, text) { return $k.pm.error(error, text);}
$k.upc = function(str) { return (str.toUpperCase())};
$k.lwc = function(str) { return (str.toLowerCase())};
$k.isEmpty = function(str) {return((str == null)||$.trim(str)=="");}
$k.dfs = function(defaultStr,str) { return $k.isEmpty(str) ? defaultStr : str;}
$k.jsons = function (str) { return JSON.stringify(str);}

$k.cfgHtml = function(dfs, cfg, replaceK) {
	var str = $k.dfs(dfs,cfg.replace(/&lt;/g,"<").replace(/&gt;/g,">"));
	return ((replaceK == null) ? str : str.replace("$k", replaceK));
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
	} catch(e) {$k.error(e,"notice error");}
}

$k.removeNote = function(id) {
	var c = $k.c.bulletinList;
	var ul = $('ul' + c.handle);
	ul.find('li#'+id).remove();
}

$k.hasNote = function(id) {
	return (( $('ul' + $k.c.bulletinList.handle).find('li#' + id).length) > 0);
}

/**
 * Mod 0.10 
 * @lss 02
 */
$k.checkSubmit = function(e) {
	$k.log("Submit...");
	if ($k.v.alreadySumbitted) {
		$k.log("disabled submit: already submitted");
		e.preventDefault();
		return false;
	} else {
		$k.lockSubmit(true);
		$k.v.alreadySumbitted = true;
		return true;
	}
}

$k.resetSubmit = function() {
	$k.lockSubmit(false);
	$k.v.alreadySumbitted = false;
}

/**
 * +0.10 
 * @lss 02
 */
$k.lockSubmit = function(ahead) {
	if ($k.c.submitLock.method != null) {
		$k.c.submitLock.method(ahead);
	} else {
		if ((ahead)&&($k.c.bulletinList != null)) {
			$k.noticeSewed("submit-note", $k.c.bulletinList.submitted.note, $k.c.bulletinList.submitted.msDelayIn);
		}
		$("input:submit").toggleClass($k.c.submitCheck.disabled, ahead);
	}
}


$k.initFormSubmitLock = function() {
	$("form").submit(function( e ) {
		if($(document.activeElement).hasClass($k.c.formSubmitLock.except)) {
			$k.log("formSubmitLock exception");
		} else {
			$k.checkSubmit(e);
		}
	});	
}

$k.initLinkSubmitLock = function() {
	$("a").not($k.c.linkSubmitLock.except).click(function(e) {
		$k.checkSubmit(e);
	});				
}


/**
 * +0.10 
 */
$k.removeSewedNotice = function(id) {
	try {clearTimeout($k.v.sewingNote[id]);} catch(e){}
	try {clearInterval($k.v.sewing[id]);} catch(e){}
	try {$k.removeNote(id);}catch(e){}
	$k.v.sewing[id] = undefined;
	$k.v.sewingNote[id] = undefined;
	$k.log("De-Sewed notice " + id);
}

/**
 * +0.10 
 */
$k.noticeSewed = function(id, msg, delay) {
	$k.log("Sewed notice " + id + " delay: " + delay);
	var call = function(id) {
		$k.notice("ok", msg, id, 500)
		$k.v.sewing[id] = setInterval(function(){$('#' + id).append(".");},1000);
	}
	$k.v.sewingNote[id] = setTimeout(function(){call(id)}, delay);
}


$k.addTask = function(task) {
	var idx = $k.v.taskSq;
	$k.v.taskTb[idx] = task;
	$k.v.taskSq = idx + 1;
	return idx;
}

$k.doTask = function(idx) {}



/** **/
$k.initNCheckTable = function() {
	if (!$k.pm.logEnabled("nCheckTable", ($k.c.nCheckTable != null))) {
		return;
	}
	var inh = $k.cfgHtml("<input type='checkbox' class='$k'>", "k-nCheckAll" + $k.c.nCheckTable.input, nvl("",$k.c,"nCheckTable.checkCssc"," "));
	var trh = $k.cfgHtml("<tr><td>$k</td></tr>", $k.c.nCheckTable.tr, inh);
	$k.log(trh);
	$(trh).appendTo('table' + $k.c.nCheckTable.handle + ' tbody');
	$('table' + $k.c.nCheckTable.handle + ' input:checkbox').click(function(event) {
		//alert($(this).prop("value") + "=" + ($(this).prop("checked") ? "S" : "N"));
		if ($(this).hasClass("k-nCheckAll")) {
			var allNone = $(this).prop("checked");
			$k.log("check " + (allNone) ? "ALL" : "NONE");
			$(this).closest("table").find("input:checkbox").each(function(index) {
				if ($(this).prop("checked")==!allNone) {
					$(this).click();
				}
			});
		} else {
			var total = 0,selected = 0;
			$(this).closest("table").find("input:checkbox").each(function(index) {
				if ($(this).hasClass("k-nCheckAll")) {
					$(this).prop("checked",(selected==total));
				} else {
					selected += ($(this).prop("checked") ? 1 : 0);
					total += 1;
				}
			});
		}
		event.stopPropagation();
	});
	
	$("table" + $k.c.nCheckTable.handle).each(function() {
		var total =0,selected =0;
		$(this).find("input:checkbox").each(function(index) {
			if ($(this).hasClass("k-nCheckAll")) {
				$(this).prop("checked",(selected==total));
			} else {
				selected += ($(this).prop("checked") ? 1 : 0);
				total += 1;
			}
		});
	});
	
}


$k.initFreeSelect = function() {
	var c = $k.c.freeSelect;
	var srcAttr = $(this).attr($k.dfs("id", $k.c.freeSelect.srcAttr));
	
	$(c.handle).each(function(index) {
		var freeDiv = $("#" + srcAttr + c.suffix);
		var freeOpt = freeDiv.find("input:text");
		freeOpt.width(c.width);
		if ($(this).val() != c.opt) {
			freeDiv.hide();
			freeOpt.val('');
		}
	});
	
	$(c.handle).on('change', function() {
		var freeDiv = $("#" + srcAttr + c.suffix);
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

/** -- **/
$k.initKeyboard = function() {
	$(document).keydown(function (e) {
		if (e.keyCode == 67 && e.ctrlKey && e.altKey) {
			$($k.c.keyboard.ctrlAltConsoleJqh).slideToggle(300);
		} else if (e.keyCode == 20) {
			if ($k.v.capslock == 1) {
				$k.capslock(false);
			} else if ($k.v.capslock == 0) {
				$k.capslock(true);
			}
		} 
	});
}

/** -- **/
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



/** **/
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

/** **/
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

/** **/
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
	if (!$k.pm.logEnabled("fieldNotes", ($k.c.fieldNotes != undefined))) {
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
			
			var inputNamed = $(":input[name='"+$k.getNoteFieldName($(this))+"']");
		
			$(this).on('mouseover', function() {
				inputNamed.css("border","2px solid " + $k.c.fieldNotes.borderInk[ink]);
			});
			
			$(this).on('mouseout', function() {
				inputNamed.css("border","1px solid " + $k.c.fieldNotes.borderInk[ink]);
			});
			
			$(this).on('click', function() {
				inputNamed.focus();
			});
			
			//field?
			var name = $k.getNoteFieldName($(this));
			var fieldSelector = ":input[name='" + name + "']";
			
			$(fieldSelector).css("border","1px solid "+$k.c.fieldNotes.borderInk[ink]);

			//focusing
			var item;

			$k.log("focusables: " + $k.c.bulletinList.focusable.join(", "));
			for (var i =0; i < $k.c.bulletinList.focusable.length; i++) {
				item = $k.c.bulletinList.classes[$k.c.bulletinList.focusable[i]];
				if ($(this).hasClass(item)) { //The li has the class
					$k.log("focus class " + item + " name(input) " + name + (($(fieldSelector.length))?" found":" not-found"));
					$(fieldSelector).focus();
					$k.v.firstFocus = true;
				} 
			}
			
			$(fieldSelector).data("note", $(this).attr("id"));
			
			$(fieldSelector).on('focus', function() {
				$k.v.fieldCursor.keyboard  = $(this).attr("name");
				$k.popUp($(this));
			});
			
			$(fieldSelector).on('blur', function() {
				$k.v.fieldCursor.keyboard  = '';
				$k.popUp($(this));
			});
	
			$(fieldSelector).on('mouseover', function() {
				$k.v.fieldCursor.mouse  = $(this).attr("name");
				$("li#" + $(this).data("note")).css("textDecoration", "underline");
				$k.popUp($(this));
			});
			
			$(fieldSelector).on('mouseout', function() {
				$k.v.fieldCursor.mouse  = '';
				$("li#" + $(this).data("note")).css("textDecoration", "none");
				$k.popUp($(this));
			});
		}
	})
}

/** **/
$k.popDown = function(target) {
	$("div#fieldNote_"+target.attr("id")).remove();
}	

/** **/
$k.popUp = function(target) {
	var popUp = false; 
	var clazz, def, defMask = 0;

	var mask = ($k.v.fieldCursor.keyboard  == $(target).attr("name")) ? 1 : 0;
	mask += ($k.v.fieldCursor.mouse  == $(target).attr("name")) ? 2 : 0;
	
	for (var i =0;i < $k.c.bulletinList.popupable.length; i++) {
		def = $k.c.bulletinList.popupable[i].split(":");
		defMask = parseInt(def[1]);
		clazz = $k.c.bulletinList.classes[def[0]];
		if ($("li#" + target.data("note")).hasClass(clazz)) {
			popUp = ((mask & defMask) > 0);
			break;
		}
	}
	
	var jqh = "#fieldNote_"+target.attr("id");
	
	if ((popUp)&&(!($(jqh).length))) {
		var offset = target.offset();
		var bottom = offset.top + target.height() + 10;
		
		$("body").append(
			"<div id='fieldNote_"+target.attr("id")+
			"' class='" + $k.c.field.popupCssc + "' style='display:none;top:"+bottom
			+"px;left:"+offset.left
			+"px;'>"+$("li#" + target.data("note")).html()+"</div>"
		);
		$("#fieldNote_"+target.attr("id")).show("fast");
	} else if ((!popUp)&&(($(jqh).length))) {
		$(jqh).remove();
	}
};

/** **/
$k.initJumpSelect = function() {
	var cfg = $k.c.jumpSelect;
	if (!$k.pm.logEnabled("jumpSelect", (cfg != undefined))) {
		return;
	}
	$(cfg.handle).each(function(index) {
		$jumpOp1 = $(this).find('option:eq(0)');
		$jumpOp1.text($jumpOp1.text().replace(cfg.remove,""));
	});
	
	$(cfg.handle).on('change', function() {
		$k.log("jump");
		$(this).closest("form").append(
			"<input type='hidden' name='kilo' value='" + cfg.submitValue + ":" + $(this).attr("name") + "' >"
		);
		$(this).closest("form").submit();
	});
}

/** 
 * after initFieldNotes
 * **/
$k.initFocusFirstField = function() {
	if (!$k.pm.logEnabled("focusFirstField", ($k.c.field.firstJqh) != null)) {
		return;
	}
	if (!$k.v.firstFocus) {
		$k.pm.logStatus("firstFocus");
		$($k.c.field.firstJqh).first().focus();
	}
}

/** **/
$k.sleep = function(ms) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
		  if ((new Date().getTime() - start) > ms){
			  break;
		  }
	  }
}


/** **/
$k.nvl = function(defaultValue,root,path,prefix) {
	if (root == null) {
		return defaultValue;
	}
	steps = path.split(".");
	var tmp = root;
	for (var i = 0;i < steps.length;i++) {
		tmp = tmp[steps[i]];
		if (tmp == null) {
			return defaultValue;
		}
	}
	return ((prefix == null) ? "" : prefix) + tmp;
}

$k.key = function (e, keycode) {
	return (e.which && e.which == keycode) || (e.keyCode && e.keyCode == keycode);
}

/** **/
$k.initDefaultSubmit = function() {
	if (!$k.pm.logEnabled("defaultSubmit", ($k.c.defaultSubmitHandle != null))) {
		expose("submit disabled: " + $k.c.defaultSubmitHandle);
		return;
	}
	$("form").each(function(){	
		$(this).find("input").keypress(function (e) {
		    if ($k.key(e, 13)) {
		    	$(this).closest('form').find("." + $k.c.defaultSubmitHandle).click();
		        return false;
		    } else {
		        return true;
		    }
		});
	})
}

$k.initTableActiveRow = function() {
	$('table tr').click(function() {
		$k.log("tr click");
		var check = $(this).find("input:checkbox");
		check.click();
		var radioInput = $(this).find("input:radio"); 
		radioInput.prop("checked", true);
    });
} 


$k.define = function(config) {
	var verbose = (config != null && config.verbose != null) ? config.verbose : $k.c.verbose;
 	$k.pm.verbose(verbose);
	$k.pm.logIf(verbose, "Config define: " + JSON.stringify(config));
	if (config != null) {
		$k.c = $.extend(true, $k.c, config);
	}
	$k.pm.logIf(verbose, "Config result: " + JSON.stringify($k.c));
}

$k.initMod = function(modName, func, condition) {
	if ((condition == null) || ($k.pm.logEnabled(modName, condition))) {
		try {func();} catch(e) {$k.pm.logEnabled(modName, false, e);};
	}
}

$k.init = function(config) {
	$k.define(config);
	$k.log("Init..." + $k.c.version);
	
	try {$k.initFreeSelect();} 	catch(e) {$k.pm.logEnabled("freeSelect",	false,e);};
	try {$k.initPassword();} 	catch(e) {$k.pm.logEnabled("passCheck",		false,e);};
	try {$k.initJumpSelect();} 	catch(e) {$k.pm.logEnabled("jumpSelect",	false,e);};
	
	$k.initMod("formSubmitLock", $k.initFormSubmitLock, $k.c.formSubmitLock.on);
	$k.initMod("linkSumbitLock", $k.initLinkSubmitLock, $k.c.linkSubmitLock.on);
	
	try {$k.initTableActiveRow();} 		catch(e) {$k.pm.logEnabled("tableActiveRow",false,e);};
	try {$k.initTable();} 		catch(e) {$k.pm.logEnabled("table",			false,e);};
	try {$k.initNCheckTable();} catch(e) {$k.pm.logEnabled("nCheckTable",	false,e);};
	try {$k.initKeyboard();} 	catch(e) {$k.pm.logEnabled("keyboard",		false,e);};
	try {$k.initFieldNotes();} 	catch(e) {$k.pm.logEnabled("fieldNotes",	false,e);};

	$k.initMod("focusFirstField", $k.initFocusFirstField);
	$k.initMod("defaultSubmit", $k.initDefaultSubmit);
	$k.pm.logEnabled("main", true, null, "Version: " + $k.c.version);
}



