var $jsBody = $('#js-body'),
	jsDarkModeToggler = document.getElementById('js-dark-mode-toggler'),
	jsGamifyToggler = document.getElementById('js-gamify-toggler'),
	jsNavToggler = document.getElementById('js-nav-toggler'),
	jsNavDrawer = document.getElementById('js-nav-drawer'),
	jsNavOverlay = document.getElementById('js-nav-overlay');

document.addEventListener("DOMContentLoaded", function(event) {
	var isDarkMode = sessionStorage.getItem('isDarkMode');
	if (JSON.parse(isDarkMode)) {
		$jsBody[0].classList.add('is-dark-mode');
	}
	
	var isGamified = sessionStorage.getItem('isGamified');
	if (JSON.parse(isGamified)) {
		$jsBody[0].classList.add('is-gamified');
	}
});

jsDarkModeToggler.addEventListener('click', function() {
	if($jsBody[0].classList.contains('is-dark-mode')) {
		$jsBody[0].classList.remove('is-dark-mode');
		sessionStorage.setItem('isDarkMode', false);
	} else {
		if($jsBody[0].classList.contains('is-gamified')) {
			$jsBody[0].classList.remove('is-gamified');
			sessionStorage.setItem('isGamified', false);
		}
		
		$jsBody[0].classList.add('is-dark-mode');
		sessionStorage.setItem('isDarkMode', true);
	}

	toggleNav();
});

jsGamifyToggler.addEventListener('click', function() {
	if($jsBody[0].classList.contains('is-gamified')) {
		$jsBody[0].classList.remove('is-gamified');
		sessionStorage.setItem('isGamified', false);
	} else {
		if($jsBody[0].classList.contains('is-dark-mode')) {
			$jsBody[0].classList.remove('is-dark-mode');
			sessionStorage.setItem('isDarkMode', false);
		}
		
		$jsBody[0].classList.add('is-gamified');
		sessionStorage.setItem('isGamified', true);
	}

	toggleNav();
});

jsNavToggler.addEventListener('click', function() { toggleNav(); });
jsNavOverlay.addEventListener('click', function() { toggleNav(); });

function toggleNav() {
	if(jsNavDrawer.classList.contains('a-open-menu')) {
		jsNavDrawer.classList.remove('a-open-menu');
		jsNavOverlay.classList.remove('a-open-menu');
	} else {
		jsNavDrawer.classList.add('a-open-menu');
		jsNavOverlay.classList.add('a-open-menu');
	}
}
