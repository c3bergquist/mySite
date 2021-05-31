var jsNavToggler = document.getElementById('js-nav-toggler'),
	jsNavDrawer = document.getElementById('js-nav-drawer');

jsNavToggler.addEventListener('click', function() {
	if(jsNavDrawer.classList.contains('a-open-menu')) {
		jsNavDrawer.classList.remove('a-open-menu');
	} else {
		jsNavDrawer.classList.add('a-open-menu');
	}
});
