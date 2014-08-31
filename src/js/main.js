(function($) {
// remove no JavaScript warning
$('#noJavaScript').remove();

//grabbing variables
var heading$           = $('h1'),
    headerHolder$      = $('#headerHolder'),
    formHolder$        = $('#formHolder'),
    theForm$           = $('#theForm'),
    inputEmail$        = $('#inputEmail'),
    textLabel$         = $('#textLabel'),
    textField$         = $('#textField'),
    inputText$         = $('#inputText'),
    divCheck$          = $('#divCheck'),
    errorEmpty$        = $('#errorEmpty'),
    errorBad$          = $('#errorBad'),
    submitButton$      = $('#submitButton'),
    mask$              = $('#mask'),
    output$            = $('#output'),
    theCode$           = $('#theCode'),
    theX$              = $(preloadImage('img/check-x.png'));

// ========================= begin setting up page //

// set up initial animation
heading$.css('top', '-50%');
headerHolder$.css('top', '50%').hide();
textLabel$.css('opacity', 0);
inputText$.css('opacity', 0);
formHolder$.hide();
textField$.hide();

//x checkbox
theX$.attr({'alt': 'X', 'class': 'theX', 'id': 'theX'});
var isDivChecked = false;

// ========================= end setting up page //

function preloadImage(src, func) {
	var img = new Image();
	img.src = src;
	if(func) {
		img.onload = func;
	}
	return img;
}

function animateLogo() {
	headerHolder$.fadeIn(1000, function() {
		heading$.delay(500).animate({top: "+=50%"}, 1000);
		headerHolder$.delay(500).animate({top: "-=50%"}, 1000, function() {
			formHolder$.fadeIn(500);
		});
	});
}

preloadImage('img/magic-spambot-preventing-email-link-generator.jpg', animateLogo);


// Clear out default values on focus
function clearDefaultVal(inputObj, removeClass) {
	if(inputObj.val() === inputObj.prop('defaultValue')) {
		inputObj.val('');
	}
	if(removeClass) {
		inputObj.removeClass(removeClass);
	}
}
// restore default values on blur if left blank
function restoreDefaultVal(inputObj, addClass) {
	if(inputObj.val() === '') {
		inputObj.val(inputObj.prop('defaultValue'));
	}
	if(addClass) {
		inputObj.addClass(addClass);
	}
}
// remove spaces from email input as user is typing
function removeSpaces(inputObj) {
	return inputObj.val(inputObj.val().replace(/\s/, ''));
}

// ========================= begin validation //

var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function hideErrors() {
	$('.errorBox').stop().fadeOut(200);
}

function validate(str) {
	if(str === inputEmail$.prop('defaultValue')) {
		errorEmpty$.stop().fadeIn(200);
	} else if(!emailRegex.test(str)) {
		errorBad$.stop().fadeIn(200);
	} else {
		makeCode(str);
	}
}

// ========================= end validation // 

// ========================= making the code // 

// general regEx to make code printable
var reg1 = /'/g, reg2 = /"/g, reg3 = /</g, reg4 = />/g;

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var strObj = {
	originalEmail: null,
	safeText: null,
	customText: null,
	varArray: null,
	num: null,
	choppedArray: null,
	dateID: null
};

function showOutput(outputString) {
	theCode$.html(outputString);
	mask$.fadeIn(400);
	if(theCode$.prop('scrollHeight')) {
		theCode$.css('height', theCode$.prop('scrollHeight') - 40);
	} else {
		theCode$.css('height', 350);
	}
}

function makeDateID() {
	strObj.dateID = letters[Math.floor(Math.random() * letters.length)] + new Date().getTime();
}

function chopEmail() {
	var choppedArray = [];
	for(var i = 0, count = strObj.num; i < count; i++) {
		choppedArray[i] = strObj.originalEmail.slice((i * 3), (i * 3 + 3));
	}
	strObj.choppedArray = choppedArray;
	makeDateID();
}

function makeVariable() {
	var varStr, randNum;
	function pickNum() {
		randNum = Math.ceil(Math.random() * 16);
		if(randNum < 6) {
			pickNum();
		}
	}
	pickNum();
	for(var i = 0; i < randNum; i++) {
		if(typeof varStr !== 'undefined') {
			varStr += letters[Math.floor(Math.random() * letters.length)];
		} else {
			varStr = letters[Math.floor(Math.random() * letters.length)];
		}
	}
	return varStr;
}

function makeVars() {
	var varArray = [], num = strObj.num;
	for(var i = 0, count = num; i < count; i++) {
		varArray[i] = makeVariable();
	}
	strObj.varArray = varArray;
	chopEmail();
}

function howManyPieces() {
	strObj.num = Math.ceil(strObj.originalEmail.length/3);
	makeVars(strObj.num);
}

function makeSafeText() {
	var reAt = /@/g;
	var reDot = /\./g;
	var newString = strObj.originalEmail.replace(reAt, ' at ');
	newString = newString.replace(reDot, ' dot ');
	strObj.safeText = newString;
	howManyPieces();
}

function makeCode(str) {
	var theText;
	str = str.toLowerCase();
	strObj.originalEmail = str;
	if(isDivChecked === true && inputText$.val() !== inputText$.prop('defaultValue')) {
		theText = inputText$.val();
		theText = theText.replace(reg1, '&#39;').replace(reg2, '&#34;').replace(reg3, '&#60;').replace(reg4, '&#62;');
		strObj.customText = theText;
	} else {
		strObj.customText = '';
	}
	makeSafeText();
	showOutput(pieceTogether());
}

// ========================= end making the code // 

inputEmail$.focus(function() {
	hideErrors();
	clearDefaultVal($(this), 'mute');
});
inputEmail$.keyup(function() {
	removeSpaces($(this));
});
inputEmail$.blur(function() {
	restoreDefaultVal($(this), 'mute');
});
inputText$.focus(function() {
	hideErrors();
	clearDefaultVal($(this), 'mute');
});
inputText$.blur(function() {
	restoreDefaultVal($(this), 'mute');
});
divCheck$.click(function() {
	hideErrors();
	if(!isDivChecked) {
		$(this).append(theX$);
		isDivChecked = true;
		textField$.stop().slideDown(400, function() {
			textLabel$.stop().animate({'opacity': 1}, 200);
			inputText$.stop().animate({'opacity': 1}, 200);
		});
	} else {
		theX$.remove();
		isDivChecked = false;
		textField$.stop().slideUp(200, function() {
			textLabel$.stop().css({'opacity': 0});
			inputText$.stop().css({'opacity': 0});
		});
	}
});
errorEmpty$.click(function() {
	hideErrors();
});
errorBad$.click(function() {
	hideErrors();
});
submitButton$.stop().click(function(e) {
	e.preventDefault();
	hideErrors();
	validate(inputEmail$.val());
});
mask$.click(function() {
	$(this).fadeOut();
});
output$.click(function(e) {
	e.stopPropagation();
});

/* =========================================== PIECING THE STRING TOGETHER */

function pieceTogether() {
	var outputString = '';
	outputString += '<span id="';
	outputString += strObj.dateID;
	outputString += '" class="magicEmail">';
	if(strObj.customText !== '') {
		outputString += strObj.customText + ' (' + strObj.safeText + ')';
	} else {
		outputString += strObj.safeText;
	}
	outputString += '</span>';
	outputString += '<script type="text/javascript">';
	outputString += '(function(){';
	outputString += 'var ';
	for(var i = 0, count = (strObj.num - 1); i < count; i++) {
		outputString += strObj.varArray[i];
		outputString += ' = ';
		outputString += ' "';
		outputString += strObj.choppedArray[i];
		outputString += '", ';
	}
	outputString += strObj.varArray[strObj.num - 1];
	outputString += ' = ';
	outputString += ' "';
	outputString += strObj.choppedArray[strObj.num - 1];
	outputString += '";';
	outputString += 'var a = document.getElementById(\'';
	outputString += strObj.dateID;
	outputString += '\');';
 outputString += 'a.innerHTML = \'<a href="mailto:\' + ';
 for(var j = 0, jcount = (strObj.num); j < jcount; j++) {
		outputString += strObj.varArray[j] + ' + ';
 }
 outputString += '\'">';
 if(strObj.customText !== '') {
		outputString += strObj.customText;
 } else {
		outputString += '\' + ';
		for(var k = 0, kcount = (strObj.num); k < kcount; k++) {
			outputString += strObj.varArray[k] + ' + ';
		}
		outputString += '\'';
 }
 outputString += '</a>\'';
 outputString += '})();</script>';
	outputString = outputString.replace(reg1, '&#39;').replace(reg2, '&#34;').replace(reg3, '&#60;').replace(reg4, '&#62;');
	return outputString;
}

})(jQuery);