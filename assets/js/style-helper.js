var world = document.getElementById('world'),
	$world = $('#world');

window.addEventListener('load', function() {
	
});

window.addEventListener('resize', function() {
	var height = $(document).height() - 125;
	
	if (height < 400) {
		$('#canvas').hide();
	} else {
		$('#canvas').show();
	}
});

var lastScrollTop = 0;











// on touch event calulate if swiped up or down
function scrollTouchMoveCarouselAnimations(e) {
	e.preventDefault();
	touchEndPosition = e.changedTouches[0].clientY;
	
	if (touchStartPosition > touchEndPosition + 5) {
		animateCarousel('next');
	} else if (touchStartPosition < touchEndPosition - 5) {
		animateCarousel('back');
	}
	
	handleBottomCarouselScroll(event);
}

function scrollToWorldEvent(e) {
	console.log('hit scrollToWorld');
	var topOfScreen = $(document).scrollTop(),
		worldHeight = $('#world').outerHeight();
			
	if (topOfScreen == 0) {
		return false;
	}
	
	if ((lastScrollTop == 0 || lastScrollTop >= worldHeight) && topOfScreen <= worldHeight && e.deltaY < 0) {
		e.preventDefault();
		removeScrollEventListeners();
				
		$('html, body').animate({ scrollTop: 0 }, 1000);
		lastScrollTop = 0;
		
		addScrollEventListener();
		
		return false;
	}
	
	lastScrollTop = topOfScreen;
}

function worldScrollEvent(e) {	
	var topOfScreen = $(document).scrollTop(),
		worldHeight = $('#world').outerHeight();
	
	if (topOfScreen < worldHeight) {
		e.preventDefault();
		removeScrollEventListeners();
		
		if (e.deltaY < 0) {
			//$('html, body').animate({ scrollTop: 0 }, 1000);
			lastScrollTop = worldHeight;
		} else {
			$('html, body').animate({ scrollTop: worldHeight }, 1000);
			
			lastScrollTop = worldHeight;
		}
		
		addScrollEventListener();
	}
}

// on mousewheel event determine which direction to animate
function scrollKeyCarouselAnimations(e) {
	switch (e.keyCode) {
		case 33:
		case 38:
			e.preventDefault();
			animateCarousel('back');
			break;
		case 40:
		case 34:
			if (complete) {
				removeScrollEventListener('keyboard');
			} else {
				e.preventDefault();
				animateCarousel('next');
			}
			break;
	}
}

// remove mouse wheel / keyboard scroll listener
function removeScrollEventListeners() {
	complete = false;
	
	//carousel.removeEventListener('touchstart', scrollTouchStartCarouselAnimations, { passive: false });
	
	//carousel.removeEventListener('touchmove', scrollTouchMoveCarouselAnimations, { passive: false });
	
	document.removeEventListener('wheel', scrollToWorldEvent, { passive: false });
	world.removeEventListener('wheel', worldScrollEvent, { passive: false });
	
	//document.removeEventListener('keydown', scrollKeyCarouselAnimations, { passive: false });
	
	//removeScrollLock();
}

function lockScrollInWorld(e) {
	var keys = {37: 1, 38: 1, 39: 1, 40: 1},
		topOfScreen = $(document).scrollTop();
	
	//if (keys[e.keyCode]) topOfScreen == 0) { e.preventDefault(); }
}
  
// add keyboard/mousewheel/touch listeners when carousel is active
function addScrollEventListener(e) {
	//world.addEventListener('touchstart', scrollTouchStartCarouselAnimations, { passive: false });
	
	//world.addEventListener('touchmove', scrollTouchMoveCarouselAnimations, { passive: false });
	
	////document.addEventListener('wheel', scrollToWorldEvent, { passive: false });
	////world.addEventListener('wheel', worldScrollEvent, { passive: false });
	
	world.addEventListener('wheel', lockScrollInWorld, { passive: false });
	
	//document.addEventListener('keydown', scrollKeyCarouselAnimations, { passive: false });
}

$(function() {
	//$('#world').bind('mousewheel DOMMouseScroll', scrollCheck);
	
	//addScrollEventListener();
});