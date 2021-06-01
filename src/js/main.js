var $jsBody = $('#js-body'),
	jsDarkModeToggler = document.getElementById('js-dark-mode-toggler'),
	jsNavToggler = document.getElementById('js-nav-toggler'),
	jsNavDrawer = document.getElementById('js-nav-drawer');

document.addEventListener("DOMContentLoaded", function(event) {
	var isDarkMode = sessionStorage.getItem('isDarkMode');
	if (JSON.parse(isDarkMode)) {
		$jsBody[0].classList.add('is-dark-mode');
		console.log('hit for some reason');
	}
});

jsDarkModeToggler.addEventListener('click', function() {
	if($jsBody[0].classList.contains('is-dark-mode')) {
		$jsBody[0].classList.remove('is-dark-mode');
		sessionStorage.setItem('isDarkMode', false);
	} else {
		$jsBody[0].classList.add('is-dark-mode');
		sessionStorage.setItem('isDarkMode', true);
	}
});

jsNavToggler.addEventListener('click', function() {
	if(jsNavDrawer.classList.contains('a-open-menu')) {
		jsNavDrawer.classList.remove('a-open-menu');
	} else {
		jsNavDrawer.classList.add('a-open-menu');
	}
});
