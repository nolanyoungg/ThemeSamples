/* Northlake: static navigation, portfolio, and a local-only enquiry preview. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const data = window.Northlake;
  const header = $(".site-header");
  const drawer = $("#mobile-drawer");
  const backdrop = $(".nav-backdrop");
  const menuToggle = $(".menu-toggle");
  let activeTrigger = null;

  function closeMenus(restoreFocus = false) {
    $$(".nav-panel").forEach((panel) => { panel.hidden = true; });
    $$(".nav-trigger").forEach((button) => button.setAttribute("aria-expanded", "false"));
    if (drawer.hidden) backdrop.hidden = true;
    if (restoreFocus && activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  }
  $$(".nav-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      closeMenus();
      if (opening) {
        $("#" + button.getAttribute("aria-controls")).hidden = false;
        button.setAttribute("aria-expanded", "true");
        backdrop.hidden = false;
        activeTrigger = button;
      }
    });
  });
  $$("[data-category]").forEach((button) => {
    const choose = () => {
      const key = button.dataset.category;
      const service = data.services[key];
      $$("[data-category]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      $(".menu-image").src = "assets/" + service.image + ".jpg";
      $(".menu-image").alt = data.photos[service.image].alt;
      $("[data-menu-tag]").textContent = service.tag;
      $("[data-menu-title]").textContent = service.label;
      $("[data-menu-copy]").textContent = service.intro;
      $("[data-menu-detail]").textContent = service.detail;
      $("[data-menu-link]").href = key + ".html";
    };
    ["pointerenter", "focus", "click"].forEach((event) => button.addEventListener(event, choose));
  });

  function inertPage(inert) {
    [header, $("main"), $("footer"), $(".closing"), $(".topline")].forEach((item) => { item.inert = inert; });
  }
  function closeDrawer(restoreFocus = true) {
    drawer.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("locked");
    inertPage(false);
    menuToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    closeMenus();
    drawer.hidden = false;
    backdrop.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("locked");
    inertPage(true);
    $(".drawer-close").focus();
  });
  $(".drawer-close").addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () => drawer.hidden ? closeMenus(true) : closeDrawer());
  $$(".nav-panel a, .mobile-drawer a").forEach((link) => link.addEventListener("click", () => {
    closeMenus();
    if (!drawer.hidden) closeDrawer(false);
  }));
  document.addEventListener("pointerdown", (event) => {
    if (activeTrigger && !header.contains(event.target)) closeMenus();
  });
  header.addEventListener("focusout", () => {
    setTimeout(() => {
      if (activeTrigger && !header.contains(document.activeElement)) closeMenus();
    }, 0);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!drawer.hidden) closeDrawer();
      else closeMenus(true);
    }
    if (event.key === "Tab" && !drawer.hidden) {
      const items = [...drawer.querySelectorAll("a, button, summary")].filter((item) => item.getClientRects().length);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  addEventListener("resize", () => {
    if (innerWidth > 1000 && !drawer.hidden) closeDrawer();
    if (innerWidth <= 1000) closeMenus();
  });
  const scrollState = () => header.classList.toggle("scrolled", scrollY > 15);
  addEventListener("scroll", scrollState, { passive: true });
  scrollState();

  /* The lightbox steps only through photographs in the current filter. */
  const lightbox = $("#lightbox");
  let visiblePhotos = $$("[data-photo]");
  let photoIndex = 0;
  let photoReturn = null;
  function renderPhoto() {
    const key = visiblePhotos[photoIndex].dataset.photo;
    const photo = data.photos[key];
    const image = lightbox.querySelector("img");
    image.src = "assets/" + key + ".jpg";
    image.alt = photo.alt;
    $("[data-lightbox-title]").textContent = photo.title;
    $("[data-lightbox-count]").textContent = `${photoIndex + 1} of ${visiblePhotos.length}`;
    $("[data-lightbox-credit]").textContent = photo.credit + " · " + photo.license;
    $("[data-lightbox-credit]").href = photo.source;
    $(".lightbox-prev").disabled = visiblePhotos.length < 2;
    $(".lightbox-next").disabled = visiblePhotos.length < 2;
  }
  $$("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.filter;
    $$("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    $$(".work-card").forEach((card) => { card.hidden = key !== "all" && card.dataset.kind !== key; });
    visiblePhotos = $$(".work-card:not([hidden]) [data-photo]");
    $("[data-filter-count]").textContent = visiblePhotos.length + (visiblePhotos.length === 1 ? " photograph" : " photographs");
  }));
  $$("[data-photo]").forEach((button) => button.addEventListener("click", () => {
    photoIndex = visiblePhotos.indexOf(button);
    photoReturn = button;
    renderPhoto();
    lightbox.showModal();
    document.body.classList.add("locked");
    $(".lightbox-close").focus();
  }));
  if (lightbox) {
    const step = (direction) => {
      photoIndex = (photoIndex + direction + visiblePhotos.length) % visiblePhotos.length;
      renderPhoto();
    };
    $(".lightbox-close").addEventListener("click", () => lightbox.close());
    $(".lightbox-prev").addEventListener("click", () => step(-1));
    $(".lightbox-next").addEventListener("click", () => step(1));
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
      }
    });
    lightbox.addEventListener("click", (event) => {
      const bounds = lightbox.getBoundingClientRect();
      if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
      document.body.classList.remove("locked");
      photoReturn?.focus();
    });
  }

  /* Do not transmit, persist, or place entered personal details in the URL. */
  const form = $("#inquiry-form");
  if (form) {
    const chosen = new URLSearchParams(location.search).get("service");
    if (Object.hasOwn(data.services, chosen)) form.elements.service.value = chosen;
    const result = $(".enquiry-result");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      const name = String(fields.get("name")).trim();
      if (!name) {
        form.elements.name.setCustomValidity("Please enter a name for this preview.");
        form.elements.name.reportValidity();
        return;
      }
      const service = data.services[fields.get("service")];
      $("[data-result-intro]").textContent = `Thanks, ${name}. Here is the outline of your ${service.label.toLowerCase()} enquiry.`;
      const details = $("[data-result-details]");
      details.replaceChildren();
      [["Service", service.label], ["Season", fields.get("season")], ["Setting", fields.get("setting")], ["Sample email", fields.get("email")]].forEach(([label, value]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        details.append(term, description);
      });
      $("[data-result-message]").textContent = fields.get("message") || "No additional notes.";
      form.hidden = true;
      result.hidden = false;
      result.focus();
    });
    form.elements.name.addEventListener("input", () => form.elements.name.setCustomValidity(""));
    $("[data-edit-enquiry]").addEventListener("click", () => {
      result.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
})();
