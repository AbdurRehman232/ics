document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav */
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.close-btn');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => mobileNav.classList.add('open'));
    closeBtn && closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  /* Back to top */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* FAQ accordion */
  document.querySelectorAll('.acc-item').forEach(item => {
    const q = item.querySelector('.acc-q');
    const a = item.querySelector('.acc-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* Product filter chips + search (products page) */
  const chips = document.querySelectorAll('.chip[data-filter]');
  const searchInput = document.querySelector('.search-input');
  const productCards = document.querySelectorAll('.prod-card[data-cat]');
  function applyFilter() {
    const active = document.querySelector('.chip.active');
    const cat = active ? active.dataset.filter : 'all';
    const term = (searchInput && searchInput.value || '').toLowerCase().trim();
    productCards.forEach(card => {
      const matchesCat = cat === 'all' || card.dataset.cat === cat;
      const matchesTerm = !term || card.dataset.name.toLowerCase().includes(term);
      card.style.display = (matchesCat && matchesTerm) ? '' : 'none';
    });
  }
  if (chips.length) {
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter();
      history.replaceState(null, '', chip.dataset.filter === 'all' ? location.pathname : `#${chip.dataset.filter}`);
    }));
  }
  if (searchInput) searchInput.addEventListener('input', applyFilter);

  /* Deep-link support: products.html#dyeing selects the matching chip on load */
  if (chips.length && location.hash) {
    const slug = location.hash.replace('#', '');
    const target = document.querySelector(`.chip[data-filter="${slug}"]`);
    if (target) {
      chips.forEach(c => c.classList.remove('active'));
      target.classList.add('active');
      applyFilter();
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }

  /* Simple form intercepts — demo only, no backend wired yet */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Request received ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
    });
  });

});
