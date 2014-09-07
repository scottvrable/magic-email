(function($) {
// remove no JavaScript warning
$('#noJavaScript').remove();

// ========================= begin grabbing variables //

// jQuery variables
var window$            = $(window),
    wrapper$           = $('#wrapper'),
    heading$           = $('h1'),
    headerHolder$      = $('#headerHolder'),
    mainContent$       = $('#mainContent'),
    formHolder$        = $('#formHolder'),
    inputEmail$        = $('#inputEmail'),
    textLabel$         = $('#textLabel'),
    textField$         = $('#textField'),
    inputText$         = $('#inputText'),
    divCheck$          = $('#divCheck'),
    errorEmpty$        = $('#errorEmpty'),
    errorBad$          = $('#errorBad'),
    submitButton$      = $('#submitButton'),
    mask$              = $('<div id="mask"></div>').addClass('mask'),
    output$            = $('<div id="output"></div>').addClass('output'),
    theCode$           = $('<textarea id="theCode"></textarea>').addClass('theCode').attr({'readonly': 'readonly', 'resizeable': 'resizeable'}),
    theX$              = $(preloadImage('img/check-x.png')),

// normal JavaScript variables
    isDivChecked       = false,
    hasMaskAppeared    = false,
    hasErrorAppeared   = false,

// regular expression variables
    emailRegex         = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // regular expressions to clean HTML for output
				regExObj = {
					emailEsc: {
						'@': ' at ',
						'.': ' dot '
					},
					singleEsc: {
						"'": '&#39;',
						'"': '&quot;',
						'<': '&lt;',
						'>': '&gt;'
					},
					doubleEsc: {
						"'": '&amp;#39;',
						'"': '&amp;quot;',
						'<': '&amp;lt;',
						'>': '&amp;gt;'
					}
				},

// array variables, generates via generateLetterArray function below
    letters            = generateLetterArray(),

// object variables
    strObj = {
     originalEmail: null,
     safeText: null,
     customText: null,
     customTextForJS: null,
     varArray: null,
     num: null,
     choppedArray: null,
     jumbleArray: null,
     dateID: null,
     outputString: null,
     spanTag: null,
     emailLink: null
    };

// ========================= finish grabbing variables //

// ========================= begin setting up page //

// setting up start point for logo animation
heading$.css('top', '-50%');
headerHolder$.css('top', '50%').hide();
textLabel$.css('opacity', 0);
inputText$.css('opacity', 0);
mainContent$.hide();
textField$.hide();

// preloading, then triggering animation of logo
preloadImage('img/magic-spambot-preventing-email-link-generator.jpg', animateLogo);

// x checkbox, graphic is preloaded above
theX$.attr({'alt': 'X', 'class': 'theX', 'id': 'theX'});

// checking to see if touch-enabled
if(Modernizr.touch) {
	isTouchEnabled = true;
}

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
			mainContent$.fadeIn(500);
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
	var theError;
	if(str === inputEmail$.prop('defaultValue')) {
		theError = makeErrorBox('Psst! You need to enter an email...');
		formHolder$.append(theError.fadeIn(200));
	} else if(!emailRegex.test(str)) {
		theError = makeErrorBox('This doesn\'t look like a valid email address...');
		formHolder$.append(theError.fadeIn(200));
	} else {
		makeCode(str);
	}
}

// function to make error messages
function makeErrorBox(message) {
	var errorBox;
	if(hasErrorAppeared === false) {
		errorBox = $('<div id="errorBox"></div>').addClass('errorBox');
		hasErrorAppeared = true;
	} else {
		errorBox = $('#errorBox');
	}
	errorBox.click(function() {
		hideErrors();
	});
	return errorBox.html('<span class="pointer"></span><p>' + message + '</p>');
}

// clear validation
function hideErrors() {
	$('#errorBox').stop().fadeOut(200);
}

// ========================= end validation // 

// ========================= begin making the code // 

function makeCode(str) {
	assignEmail(str);
	assignSafeText();
	assignCustomText();
	assignDateID();
	assignSpanTag();
	assignLink();
	assignNumOfPieces();
	populateArrays();
	pieceTogether();
	outputCode();
}

function assignEmail(str) {
	// convert email to all lowercase
	str = str.toLowerCase();
	// assign email to strObj
	strObj.originalEmail = str;
}

function assignSafeText() {
	// replace @ and . with " at " and " dot " for text-based version of email
	// var newString = strObj.originalEmail.replace(reAt, ' at ').replace(reDot, ' dot ');
	var newString = makeSafeForHTML(strObj.originalEmail, 'emailEsc');
	strObj.safeText = newString;
}

function assignCustomText() {
	var theText = '', theTextForJS = '';
	// only do this if box is checked and user input something in custom text field
	if(isDivChecked === true && inputText$.val() !== inputText$.prop('defaultValue')) {
		// assign user custom text to theText and theTextForJS
		theTextForJS = theText = inputText$.val();
		// clean out non-HTML safe characters
		theText = makeSafeForHTML(theText, 'doubleEsc');
		theTextForJS = makeSafeForHTML(theTextForJS, 'singleEsc');
	}
	strObj.customText = theText;
	strObj.customTextForJS = theTextForJS;
}

function makeSafeForHTML(str, whichSubObj) {
	if(whichSubObj === 'singleEsc' || whichSubObj === 'doubleEsc') {
		return str.replace(/[<>"']/g, function(s) {
			return regExObj[whichSubObj][s];
		});
	} else if(whichSubObj === 'emailEsc') {
		return str.replace(/[@.]/g, function(s) {
			return regExObj[whichSubObj][s];
		});
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

function assignLink() {
	// assemble and assign link that will be appear if user has JS running
	var theLink = '';
	theLink += '<a href="mailto:';
	theLink += strObj.originalEmail;
	theLink += '" target="_blank">';
	if(strObj.customTextForJS === '') {
		theLink += strObj.originalEmail;
	} else {
		theLink += strObj.customTextForJS;
	}
	theLink += '</a>';
	strObj.emailLink = theLink;
}

function assignNumOfPieces() {
	// determine number of chars in emailLink string and divide by 3 to get num of vars needed
	strObj.num = Math.ceil(strObj.emailLink.length/3);
}

function populateArrays() {
	// create an array of random letters based on string that needs to be divided up
	var varArray = [], choppedArray = [], jumbleArray = new Array(strObj.num), newNum;
	function pickNewNum() {
		newNum = Math.floor(Math.random() * strObj.num);
		if(!jumbleArray[newNum]) {
			jumbleArray[newNum] = [varArray[i], i];
		} else {
			pickNewNum();
		}
	}
	for(var i = 0; i < strObj.num; i++) {
		// for every three characters in string, create a new random variable
		varArray[i] = makeVariable();
		// for every three characters in string, slice off and store in choppedArray
		// replace ampersands with code just in case character codes fit into one var
		choppedArray[i] = strObj.emailLink.slice((i * 3), (i * 3 + 3)).replace(/&/g, '&amp;');
		// jumble
		pickNewNum();
	}
	// store the array of variables and chopped pieces in strObj
	strObj.varArray = varArray;
	strObj.choppedArray = choppedArray;
	strObj.jumbleArray = jumbleArray;
}

function makeVariable() {
	var varStr = '', randNum;
	// pick random number up to 16, if less than 6, change to 12
	randNum = Math.ceil(Math.random() * 16);
	if(randNum < 6) {
		randNum = 12;
	}
	// build random variable and return to populateVarArray()
	for(var i = 0; i < randNum; i++) {
		varStr += letters[Math.floor(Math.random() * letters.length)];
	}
	return varStr;
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
	strObj.outputString  = strObj.spanTag;
	strObj.outputString += '\n';
	strObj.outputString += '<script type="text/javascript">';
	strObj.outputString += '(function(){';
	strObj.outputString += 'var ';
	for(var i = 0; i < strObj.num; i++) {
		strObj.outputString += strObj.jumbleArray[i][0];
		strObj.outputString += ' = \'';
		strObj.outputString += strObj.choppedArray[strObj.jumbleArray[i][1]];
		if(i !== (strObj.num - 1)) {
			strObj.outputString += '\', ';
		} else {
			strObj.outputString += '\'; ';
		}
	}
	strObj.outputString += 'var a = document.getElementById(\'';
	strObj.outputString += strObj.dateID;
	strObj.outputString += '\');';
 strObj.outputString += 'a.innerHTML = ';
 for(var j = 0; j < strObj.num; j++) {
		strObj.outputString += strObj.varArray[j];
		if(j !== (strObj.num - 1)) {
			strObj.outputString += ' + ';
		} else {
			strObj.outputString += ';';
		}
	}
	strObj.outputString += '})();</script>';
 // after string is assembled, single escape for output
 strObj.outputString = makeSafeForHTML(strObj.outputString, 'singleEsc');
 console.log(strObj.outputString);
}

// ========================= end piecing string together //

// ========================= begin outputting code string //

function outputCode() {
	theCode$.css('height', 350).html(strObj.outputString);
	if(hasMaskAppeared === false) {
		output$.append('<h2>Copy and Paste This Code Into Your HTML:</h2>', theCode$);
mask$.append(output$);
		$(document.body).append(mask$);
		hasMaskAppeared = true;
	}
	output$.css({'margin-top': (window$.scrollTop() + 20)});
	mask$.fadeIn(400);
	if(theCode$.prop('scrollHeight')) {
		theCode$.css('height', theCode$.prop('scrollHeight') - 40);
	}
}

// function to change mask position based on window events
function adjustMaskPosition() {
	var scrollTop = window$.scrollTop();
	output$.css({top: -scrollTop});
}

// ========================= end outputting code string //

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

// moving mask on window scroll if not touch device
if(Modernizr.touch === false) {
	window$.scroll(function() {
	adjustMaskPosition();
	});
	window$.resize(function() {
		adjustMaskPosition();
	});
}

// ========================= end attaching events to inputs //

})(jQuery);