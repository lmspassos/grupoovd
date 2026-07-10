// Home page — vanilla JS (no jQuery / no build step)

async function includeHTML(target, url) {
	const el = document.querySelector(target);
	if (!el) return;

	const res = await fetch(url, { cache: 'no-store' });
	el.innerHTML = await res.text();

	// innerHTML does not execute <script> tags — recreate them so they run
	el.querySelectorAll('script').forEach((oldScript) => {
		const newScript = document.createElement('script');
		for (const attr of oldScript.attributes) newScript.setAttribute(attr.name, attr.value);
		newScript.textContent = oldScript.textContent;
		oldScript.replaceWith(newScript);
	});
}

function initBanner() {
	const container = document.querySelector('#banner');
	const track = container?.querySelector('.banner__track');
	const slides = track ? Array.from(track.children) : [];
	const dots = container ? Array.from(container.querySelectorAll('.banner__dot')) : [];

	// Banner é HTML estático (ver index.html) — se não existir, não há o que ligar.
	if (!container || !track || !slides.length) return;

	let current = 0;
	let timer;
	let dragOffset = 0; // % aplicado por cima da posição base durante o arraste

	// Cada slide fica lado a lado "virtualmente": o ativo em 0%, o próximo em
	// 100%, o anterior em -100%, etc. Só o que está perto de 0% aparece
	// (o resto fica fora da área visível, cortado pelo overflow:hidden).
	function layout() {
		slides.forEach((slide, i) => {
			slide.style.transform = `translateX(${(i - current) * 100 + dragOffset}%)`;
		});
	}

	function goTo(index) {
		current = (index + slides.length) % slides.length;
		dragOffset = 0;
		layout();
		dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
	}

	function resetTimer() {
		clearInterval(timer);
		timer = setInterval(() => goTo(current + 1), 8000);
	}

	dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

	const prevBtn = container.querySelector('.banner__arrow--prev');
	const nextBtn = container.querySelector('.banner__arrow--next');
	prevBtn?.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
	nextBtn?.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

	container.addEventListener('mouseenter', () => clearInterval(timer));
	container.addEventListener('mouseleave', resetTimer);

	// Arraste por toque (mobile) — desliza o slide atual e o vizinho juntos,
	// acompanhando o dedo; solta além do limite troca de slide, solta antes
	// disso volta suavemente pro lugar.
	let dragging = false;
	let startX = 0;
	let startY = 0;
	let deltaX = 0;
	const dragThreshold = 50;

	track.addEventListener('pointerdown', (e) => {
		if (e.pointerType !== 'touch') return;
		dragging = true;
		startX = e.clientX;
		startY = e.clientY;
		deltaX = 0;
		clearInterval(timer);
		slides.forEach((slide) => { slide.style.transition = 'none'; });
	});

	track.addEventListener('pointermove', (e) => {
		if (!dragging) return;
		deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			e.preventDefault();
			dragOffset = (deltaX / track.clientWidth) * 100;
			layout();
		}
	});

	function endDrag() {
		if (!dragging) return;
		dragging = false;
		slides.forEach((slide) => { slide.style.transition = ''; });

		if (Math.abs(deltaX) > dragThreshold) {
			goTo(current + (deltaX < 0 ? 1 : -1));
		} else {
			dragOffset = 0;
			layout();
		}

		deltaX = 0;
		resetTimer();
	}

	track.addEventListener('pointerup', endDrag);
	track.addEventListener('pointercancel', endDrag);
	track.addEventListener('pointerleave', endDrag);

	// Primeira posição sem animação (evita flash/slide na carga da página).
	slides.forEach((slide) => { slide.style.transition = 'none'; });
	goTo(0);
	void track.offsetHeight; // força o navegador a aplicar o "none" antes de reativar
	slides.forEach((slide) => { slide.style.transition = ''; });

	resetTimer();
}

function initPartnersCarousel() {
	const root = document.querySelector('.parceirosHome');
	if (!root) return;

	const track = root.querySelector('.parceirosContent');
	const btnNext = root.querySelector('.btnNext');
	const btnPrev = root.querySelector('.btnPrev');
	const items = Array.from(track.children);
	// Distância real entre um item e o próximo (já inclui o gap do CSS,
	// não só a largura do item — assim o scroll sempre acerta o snap point).
	const itemWidth = items.length > 1
		? items[1].offsetLeft - items[0].offsetLeft
		: (items[0]?.getBoundingClientRect().width || 110);

	function advance(direction) {
		const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
		const atStart = track.scrollLeft <= 2;

		if (direction > 0 && atEnd) {
			track.scrollTo({ left: 0, behavior: 'smooth' });
		} else if (direction < 0 && atStart) {
			track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
		} else {
			track.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
		}
	}

	btnNext?.addEventListener('click', (e) => { e.preventDefault(); advance(1); resetTimer(); });
	btnPrev?.addEventListener('click', (e) => { e.preventDefault(); advance(-1); resetTimer(); });

	let timer;
	function resetTimer() {
		clearInterval(timer);
		timer = setInterval(() => advance(1), 3000);
	}

	root.addEventListener('mouseenter', () => clearInterval(timer));
	root.addEventListener('mouseleave', resetTimer);

	resetTimer();
}

document.addEventListener('DOMContentLoaded', () => {
	includeHTML('#header', 'includes/header.html').catch((err) => console.error('Falha ao carregar header:', err));
	includeHTML('#footer', 'includes/footer.html').catch((err) => console.error('Falha ao carregar footer:', err));
	includeHTML('#boxMarcas', 'includes/box-marcas.html').catch((err) => console.error('Falha ao carregar boxMarcas:', err));

	initBanner();
	initPartnersCarousel();
});
