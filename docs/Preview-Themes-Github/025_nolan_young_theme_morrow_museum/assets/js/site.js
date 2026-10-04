
/* Static navigation and local preview interactions. No network requests or storage. */
(() => {
  const header = document.querySelector('.site-header');
  const drawer = document.querySelector('.drawer');
  const backdrop = document.querySelector('.backdrop');
  const menu = document.querySelector('.menu-toggle');
  const triggers = [...document.querySelectorAll('[data-menu]')];
  let opener;
  function close(restore = false) {
    document.querySelectorAll('.dropdown').forEach(el => el.hidden = true);
    triggers.forEach(el => el.setAttribute('aria-expanded', 'false'));
    drawer.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.classList.remove('menu-open');
    if (restore && opener) opener.focus();
  }
  triggers.forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    close();
    if (open) return;
    opener = button;
    document.getElementById(button.getAttribute('aria-controls')).hidden = false;
    button.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.classList.add('menu-open');
  }));
  document.querySelectorAll('[data-category]').forEach(button => {
    const activate = () => {
      button.closest('.dropdown').querySelectorAll('[data-category]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      document.querySelectorAll('.menu-feature').forEach(el => el.hidden = el.id !== button.getAttribute('aria-controls'));
    };
    ['click', 'focus', 'mouseenter'].forEach(type => button.addEventListener(type, activate));
  });
  menu.addEventListener('click', () => {
    close(); opener = menu; drawer.hidden = false; backdrop.hidden = false;
    menu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    drawer.querySelector('.drawer-close').focus();
  });
  document.querySelector('.drawer-close').addEventListener('click', () => close(true));
  backdrop.addEventListener('click', () => close(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close(true);
    if (event.key !== 'Tab' || drawer.hidden) return;
    const items = [...drawer.querySelectorAll('a,button,summary')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('focusin', event => { if (drawer.hidden && !header.contains(event.target)) close(); });
  window.matchMedia('(max-width:1050px)').addEventListener('change', () => close());
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), {passive:true});
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    document.querySelectorAll('[data-kind]').forEach(el => el.hidden = button.dataset.filter !== 'all' && el.dataset.kind !== button.dataset.filter);
  }));
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-tabs]');
    group.querySelectorAll('[data-tab]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    group.querySelectorAll('[data-panel]').forEach(el => el.hidden = el.id !== button.getAttribute('aria-controls'));
  }));
  document.querySelectorAll('.inquiry').forEach(form => {
    const button = form.querySelector('[data-submit]');
    button.disabled = false;
    form.addEventListener('submit', event => event.preventDefault());
    button.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const status = form.querySelector('.form-status');
      status.textContent = form.dataset.feedback || 'Your example inquiry is ready. This preview does not send or store your information.';
      status.focus();
    });
    form.addEventListener('input', () => form.querySelector('.form-status').textContent = '');
  });
  const planner = document.querySelector('[data-planner]');
  if (planner) {
    const update = () => {
      const adults = Number(planner.querySelector('[name=adults]').value);
      const children = Number(planner.querySelector('[name=children]').value);
      planner.querySelector('[data-total]').textContent = '$' + (adults * 18 + children * 8);
      planner.querySelector('[data-guests]').textContent = (adults + children) + (adults + children === 1 ? ' visitor' : ' visitors');
    };
    planner.addEventListener('change', update); update();
  }
})();

/* Carry a chosen programme or membership into its local inquiry. */
(() => {
  const planner = document.querySelector('[data-planner]');
  if (planner) {
    const params = new URLSearchParams(location.search);
    const experiences = {exhibitions:0, collection:1, family:2};
    const arrivals = {morning:0, afternoon:1, late:2};
    const experience = params.get('experience');
    const arrival = params.get('arrival');
    if (Object.hasOwn(experiences, experience)) planner.querySelector('[name=experience]').selectedIndex = experiences[experience];
    if (Object.hasOwn(arrivals, arrival)) planner.querySelector('[name=arrival]').selectedIndex = arrivals[arrival];
  }
  document.querySelectorAll('[data-panel] a[href="#membership-inquiry"]').forEach(link => {
    link.addEventListener('click', () => {
      const choices = {individual:'Individual membership', together:'Together membership', supporter:'Supporter membership'};
      document.querySelector('[name=interest]').value = choices[link.closest('[data-panel]').id];
    });
  });
})();
