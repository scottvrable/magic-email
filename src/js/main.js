(function($) {
// remove no JavaScript warning
$('#noJavaScript').remove();

// ========================= begin grabbing variables //

// jQuery variables
var heading$           = $('h1'),
    headerHolder$      = $('#headerHolder'),
    formHolder$        = $('#formHolder'),
    theForm$           = $('#theForm'),
    inputEmail$        = $('#inputEmail'),
    textLabel$         = $('#textLabel'),
    textField$         = $('#textField'),
    inputText$         = $('#inputText'),
    divCheck$          = $('#divCheck'),
    errorBoxes$        = $('.errorBox'),
    errorEmpty$        = $('#errorEmpty'),
    errorBad$          = $('#errorBad'),
    submitButton$      = $('#submitButton'),
    mask$              = $('#mask'),
    output$            = $('#output'),
    theCode$           = $('#theCode'),
    theX$              = $(preloadImage('img/check-x.png')),

// normal JavaScript variables
    isDivChecked       = false,

// regular expression variables
    emailRegex         = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // regular expressions to clean HTML for output
    reg1               = /'/g,
    reg2               = /"/g,
    reg3               = /</g,
    reg4               = />/g,
    reAt               = /@/g,
    reDot              = /\./g,

// array variables, generates via generateLetterArray function below
    letters            = generateLetterArray(),

// object variables
    strObj = {
	originalEmail: null,
	safeText: null,
	customText: null,
	varArray: null,
	num: null,
	choppedArray: null,
	jumbleArray: null,
	dateID: null,
	outputString: null,
	spanTag: null
};

// ========================= finish grabbing variables //

// ========================= begin setting up page //

// setting up start point for logo animation
heading$.css('top', '-50%');
headerHolder$.css('top', '50%').hide();
textLabel$.css('opacity', 0);
inputText$.css('opacity', 0);
formHolder$.hide();
textField$.hide();

// preloading, then triggering animation of logo
preloadImage('img/magic-spambot-preventing-email-link-generator.jpg', animateLogo);

// x checkbox, graphic is preloaded above
theX$.attr({'alt': 'X', 'class': 'theX', 'id': 'theX'});

// === functions for immediate use

// preload graphics function
function preloadImage(src, func) {
	var img = new Image();
	img.src = src;
	if(func) {
		img.onload = func;
	}
	return img;
}

// animate logo after being preloaded
function animateLogo() {
	headerHolder$.fadeIn(1000, function() {
		heading$.delay(500).animate({top: "+=50%"}, 1000);
		headerHolder$.delay(500).animate({top: "-=50%"}, 1000, function() {
			formHolder$.fadeIn(500);
		});
	});
}

//set up letters array, generates letters A through z, called by var letters
function generateLetterArray() {
  var array = [];
  for(var start = 65, end = 123; start < end; start++) {
   if(start >= 91 && start <= 96) {
      continue;
    } else {
      array.push(String.fromCharCode(start));
    }
  }
  return array;
}

// ========================= end setting up page //

// ========================= begin input field events //

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

// ========================= end input field events //

// ========================= begin validation //

// main validation
function validate(str) {
	if(str === inputEmail$.prop('defaultValue')) {
		errorEmpty$.stop().fadeIn(200);
	} else if(!emailRegex.test(str)) {
		errorBad$.stop().fadeIn(200);
	} else {
		makeCode(str);
	}
}

// clear validation
function hideErrors() {
	errorBoxes$.stop().fadeOut(200);
}

// ========================= end validation // 

// ========================= begin making the code // 

function makeCode(str) {
	assignEmail(str);
	assignSafeText();
	assignCustomText();
	assignDateID();
	assignSpanTag();
	showOutput(pieceTogether());
}

function assignEmail(str) {
	// convert email to all lowercase
	str = str.toLowerCase();
	// assign email to strObj
	strObj.originalEmail = str;
}

function assignSafeText() {
	// replace @ and . with " at " and " dot " for text-based version of email
	var newString = strObj.originalEmail.replace(reAt, ' at ').replace(reDot, ' dot ');
	strObj.safeText = newString;
	howManyPieces();
}

function assignCustomText() {
	var theText;
	// only do this if box is checked and user input something in custom text field
	if(isDivChecked === true && inputText$.val() !== inputText$.prop('defaultValue')) {
		// assign user custom text to strObj for custom text
		theText = inputText$.val();
		theText = theText.replace(reg1, '&#39;').replace(reg2, '&#34;').replace(reg3, '&#60;').replace(reg4, '&#62;');
		strObj.customText = theText;
	} else {
		// if nothing, assign empty string to strObj for custom text
		strObj.customText = '';
	}
}

function assignDateID() {
	// create a unique ID for span based on random letter and time
	strObj.dateID = letters[Math.floor(Math.random() * letters.length)] + new Date().getTime();
}

function assignSpanTag() {
	// create span tag that contains unique ID, class and non-JS version of email
	var theString = '';
	theString += '<span id="';
	theString += strObj.dateID;
	theString += '" class="magicEmail">';
	if(strObj.customText !== '') {
		// if custom text specified, put parens around non-JS safe email
		theString += strObj.customText + ' (' + strObj.safeText + ')';
	} else {
		// if no custom text specified, just put in non-JS safe email
		theString += strObj.safeText;
	}
	theString += '</span>';
	// assign span tag string to strObj
	strObj.spanTag = theString;
}

function howManyPieces() {
	strObj.num = Math.ceil(strObj.originalEmail.length/3);
	makeVars(strObj.num);
}

function makeVars() {
	var varArray = [], num = strObj.num;
	for(var i = 0, count = num; i < count; i++) {
		varArray[i] = makeVariable();
	}
	strObj.varArray = varArray;
	chopEmail();
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

function chopEmail() {
	var choppedArray = [];
	for(var i = 0, count = strObj.num; i < count; i++) {
		choppedArray[i] = strObj.originalEmail.slice((i * 3), (i * 3 + 3));
	}
	strObj.choppedArray = choppedArray;
}

function showOutput(outputString) {
	theCode$.html(outputString);
	mask$.fadeIn(400);
	if(theCode$.prop('scrollHeight')) {
		theCode$.css('height', theCode$.prop('scrollHeight') - 40);
	} else {
		theCode$.css('height', 350);
	}
}

// ========================= end making the code // 

// ========================= piecing string together // 

function pieceTogether() {
	strObj.outputString =  strObj.spanTag;
	strObj.outputString += '<script type="text/javascript">';
	strObj.outputString += '(function(){';
	strObj.outputString += 'var ';
	for(var i = 0, count = (strObj.num - 1); i < count; i++) {
		strObj.outputString += strObj.varArray[i];
		strObj.outputString += ' = ';
		strObj.outputString += ' "';
		strObj.outputString += strObj.choppedArray[i];
		strObj.outputString += '", ';
	}
	strObj.outputString += strObj.varArray[strObj.num - 1];
	strObj.outputString += ' = ';
	strObj.outputString += ' "';
	strObj.outputString += strObj.choppedArray[strObj.num - 1];
	strObj.outputString += '";';
	strObj.outputString += 'var a = document.getElementById(\'';
	strObj.outputString += strObj.dateID;
	strObj.outputString += '\');';
 strObj.outputString += 'a.innerHTML = \'<a href="mailto:\' + ';
 for(var j = 0, jcount = (strObj.num); j < jcount; j++) {
		strObj.outputString += strObj.varArray[j] + ' + ';
 }
 strObj.outputString += '\'">';
 if(strObj.customText !== '') {
		strObj.outputString += strObj.customText;
 } else {
		strObj.outputString += '\' + ';
		for(var k = 0, kcount = (strObj.num); k < kcount; k++) {
			strObj.outputString += strObj.varArray[k] + ' + ';
		}
		strObj.outputString += '\'';
 }
 strObj.outputString += '</a>\'';
 strObj.outputString += '})();</script>';
	strObj.outputString = strObj.outputString.replace(reg1, '&#39;').replace(reg2, '&#34;').replace(reg3, '&#60;').replace(reg4, '&#62;');
	return strObj.outputString;
}

// ========================= end piecing string together //

// ========================= begin attaching events to inputs // 

// inputEmail field events
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

// inputText field events
inputText$.focus(function() {
	hideErrors();
	clearDefaultVal($(this), 'mute');
});
inputText$.blur(function() {
	restoreDefaultVal($(this), 'mute');
});

// divCheck events
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

//error message events
errorBoxes$.click(function() {
	hideErrors();
});

// submitButton events
submitButton$.stop().click(function(e) {
	e.preventDefault();
	hideErrors();
	validate(inputEmail$.val());
});

// mask events
mask$.click(function() {
	$(this).fadeOut();
});

// output events
output$.click(function(e) {
	e.stopPropagation();
});

// ========================= end attaching events to inputs //

})(jQuery);