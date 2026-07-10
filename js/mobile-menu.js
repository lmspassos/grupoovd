(function () {
	var MOBILE_BREAKPOINT = 1000;

	var toggle = document.querySelector('.menuToggle');
	var menu = document.querySelector('.menuContainer');
	var overlay = document.querySelector('.menuOverlay');
	if (!toggle || !menu || !overlay) return;

	function closeMenu() {
		menu.classList.remove('open');
		overlay.classList.remove('open');
		toggle.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('menuLock');
	}

	toggle.addEventListener('click', function () {
		var isOpen = !menu.classList.contains('open');
		menu.classList.toggle('open', isOpen);
		overlay.classList.toggle('open', isOpen);
		toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		document.body.classList.toggle('menuLock', isOpen);
	});

	overlay.addEventListener('click', closeMenu);

	document.addEventListener('keyup', function (e) {
		if (e.key === 'Escape') closeMenu();
	});

	var parents = menu.querySelectorAll('.menu > li');
	Array.prototype.forEach.call(parents, function (li) {
		var sub = li.querySelector('.submenu');
		var link = li.querySelector('a');
		if (!sub || !link) return;

		link.addEventListener('click', function (e) {
			if (window.innerWidth > MOBILE_BREAKPOINT) return;
			e.preventDefault();
			var isOpen = li.classList.toggle('subOpen');
			link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		});
	});
})();
