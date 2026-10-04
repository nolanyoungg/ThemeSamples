/* Dropdown navigation, responsive drawer, collection filters, and local demo form. */
(() => {
  const header = document.querySelector('.site-header');
  const backdrop = document.querySelector('.menu-backdrop');
  const drawer = document.querySelector('.drawer');
  const menuToggle = document.querySelector('.menu-toggle');
  const triggers = [...document.querySelectorAll('[data-menu]')];
  let opener = null;
  function closeMenus(restoreFocus = false) {
    document.querySelectorAll('.dropdown').forEach(panel => panel.hidden = true);
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    drawer.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.classList.remove('menu-open');
    if (restoreFocus && opener) opener.focus();
  }
  triggers.forEach(button => button.addEventListener('click', () => {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    closeMenus();
    if (wasOpen) return;
    opener = button;
    document.getElementById(button.getAttribute('aria-controls')).hidden = false;
    button.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.classList.add('menu-open');
  }));
  document.querySelectorAll('[data-category-button]').forEach(button => {
    const select = () => {
      const panel = button.closest('.dropdown');
      panel.querySelectorAll('[data-category-button]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      panel.querySelectorAll('.menu-feature').forEach(item => item.hidden = item.id !== button.getAttribute('aria-controls'));
    };
    ['click', 'mouseenter', 'focus'].forEach(event => button.addEventListener(event, select));
  });
  menuToggle.addEventListener('click', () => {
    closeMenus();
    opener = menuToggle;
    drawer.hidden = false;
    backdrop.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    drawer.querySelector('.drawer-close').focus();
  });
  document.querySelector('.drawer-close').addEventListener('click', () => closeMenus(true));
  backdrop.addEventListener('click', () => closeMenus(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenus(true);
    if (event.key !== 'Tab' || drawer.hidden) return;
    const focusable = [...drawer.querySelectorAll('a, button, summary')].filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (drawer.hidden && !header.contains(event.target)) closeMenus();
  });
  window.matchMedia('(max-width: 1020px)').addEventListener('change', () => closeMenus());
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), { passive: true });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-kind]').forEach(item => item.hidden = button.dataset.filter !== 'all' && item.dataset.kind !== button.dataset.filter);
  }));
  const form = document.querySelector('.inquiry');
  if (form) {
    const status = form.querySelector('.form-status');
    const interest = new URLSearchParams(location.search).get('interest');
    if (/^[0-2]$/.test(interest || '')) form.querySelector('select').selectedIndex = Number(interest) + 1;
    const sendButton = form.querySelector('[data-demo-send]');
    sendButton.disabled = false;
    form.addEventListener('submit', event => event.preventDefault());
    sendButton.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      status.textContent = 'Your example inquiry is ready. This is a design preview: nothing has been sent, stored, reserved, or purchased.';
      status.focus();
    });
    form.addEventListener('input', () => status.textContent = '');
  }
})();
