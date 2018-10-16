// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
	console.log('hit preventDefault: ' + e.returnValue);
	e = e || window.event;
	
	if (e.preventDefault) {
		console.log('preventing default...');
		e.preventDefault();
	}
	
	//e.returnValue = false;
	console.log('end preventDefault: ' + e.returnValue);
}

function preventDefaultForScrollKeys(e) {
	console.log('hit preventDefaultForKeys: ' + e.keyCode + ' - ' + keys[e.keyCode]);
    if (keys[e.keyCode]) {
		console.log('preventing keyCode default...');
        preventDefault(e);
		console.log('prevented keyCode default: ' + e.keyCode + ' - ' + keys[e.keyCode]);
        return false;
    }
	console.log('hit end preventDefaultForKeys');
}

function disableScroll() {
	console.log('hit disable scroll');
	if (window.addEventListener) { // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	}
		
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
	console.log('');
    if (window.removeEventListener) {
		console.log('');
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
	}
	
	console.log('');
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;
	console.log('');
}

$(function() {
	console.log('hit on load');
	disableScroll();
	console.log('scroll disabled');
});