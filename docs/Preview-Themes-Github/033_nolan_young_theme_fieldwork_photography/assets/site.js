/* Fieldwork Photo. All enquiries and purchases are local demonstrations. */
(() => {
  const D = window.Fieldwork,
    $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n / 100);
  const header = $(".site-header"),
    drawer = $("#mobile-drawer"),
    backdrop = $(".backdrop"),
    toggle = $(".menu-toggle");
  let activeMenu = null;
  function closeMenus(restore = false) {
    $$(".nav-panel").forEach((el) => (el.hidden = true));
    $$(".nav-trigger").forEach((el) =>
      el.setAttribute("aria-expanded", "false"),
    );
    if (drawer.hidden) backdrop.hidden = true;
    if (restore && activeMenu) activeMenu.focus();
    activeMenu = null;
  }
  $$(".nav-trigger").forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      closeMenus();
      if (opening) {
        $("#" + button.getAttribute("aria-controls")).hidden = false;
        button.setAttribute("aria-expanded", "true");
        backdrop.hidden = false;
        activeMenu = button;
      }
    }),
  );
  $$("[data-category]").forEach((button) => {
    function select() {
      const s = D.services[button.dataset.category];
      $$("[data-category]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      $("[data-menu-label]").textContent = s.kicker;
      $("[data-menu-title]").textContent = s.title.join(" ");
      $("[data-menu-copy]").textContent = s.description;
      $("[data-menu-detail]").textContent =
        s.duration + " / From " + money(s.packages[0].price);
      const img = $("[data-menu-image]");
      img.src = "assets/" + s.hero;
      img.alt = D.photos[s.hero].alt;
      $("[data-menu-link]").href = button.dataset.category + ".html";
    }
    ["pointerenter", "focus", "click"].forEach((e) =>
      button.addEventListener(e, select),
    );
  });
  function inertBackground(state) {
    $("main").inert = state;
    $("footer").inert = state;
    $(".callout").inert = state;
    header.inert = state;
  }
  function closeDrawer(restore = true) {
    drawer.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("locked");
    inertBackground(false);
    toggle.setAttribute("aria-expanded", "false");
    if (restore) toggle.focus();
  }
  toggle.addEventListener("click", () => {
    closeMenus();
    drawer.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add("locked");
    inertBackground(true);
    toggle.setAttribute("aria-expanded", "true");
    $(".drawer-close").focus();
  });
  $(".drawer-close").addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () =>
    drawer.hidden ? closeMenus(true) : closeDrawer(),
  );
  $$(".nav-panel a,.mobile-drawer a").forEach((a) =>
    a.addEventListener("click", () => {
      closeMenus();
      if (!drawer.hidden) closeDrawer(false);
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!drawer.hidden) closeDrawer();
      else closeMenus(true);
    }
    if (e.key === "Tab" && !drawer.hidden) {
      const focusable = [...drawer.querySelectorAll("a,button,summary")].filter(
        (el) => el.getClientRects().length,
      );
      const first = focusable[0],
        last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  addEventListener("resize", () => {
    if (innerWidth > 900 && !drawer.hidden) closeDrawer();
    if (innerWidth <= 900) closeMenus();
  });
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  $$("[data-hero]").forEach((button) =>
    button.addEventListener("click", () => {
      const key = button.dataset.hero,
        s = D.services[key];
      const photo = $("[data-hero-image]");
      photo.src = "assets/" + s.hero;
      photo.alt = D.photos[s.hero].alt;
      photo.style.objectPosition =
        key === "portraits"
          ? "50% 35%"
          : key === "family"
            ? "50% 65%"
            : "50% 55%";
      $("[data-hero-label]").textContent = s.label + " / " + s.duration;
      $("[data-hero-copy]").textContent = s.tagline;
      $("[data-hero-link]").href = key + ".html";
      $("[data-hero-link]").textContent =
        "Explore " + s.label.toLowerCase() + " ↗";
      const credit = $("[data-hero-credit]");
      credit.href = D.photos[s.hero].source;
      credit.textContent = D.photos[s.hero].credit + " / Pexels";
      $$("[data-hero]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
    }),
  );

  /* A filtered photographic collection and keyboard-accessible lightbox. */
  const lightbox = $("#photo-lightbox");
  let lightboxKeys = [],
    lightboxIndex = 0,
    lightboxReturn = null;
  function showLightboxImage() {
    const file = lightboxKeys[lightboxIndex],
      p = D.photos[file];
    $("[data-lightbox-image]").src = "assets/" + file;
    $("[data-lightbox-image]").alt = p.alt;
    $("[data-lightbox-category]").textContent = D.services[p.category].label;
    $("[data-lightbox-count]").textContent =
      `${lightboxIndex + 1} / ${lightboxKeys.length}`;
    $("[data-lightbox-credit]").textContent = p.credit + " / Pexels";
    $("[data-lightbox-credit]").href = p.source;
    $("[data-lightbox-description]").textContent = p.alt;
  }
  if (lightbox) {
    $$("[data-lightbox]").forEach((button) =>
      button.addEventListener("click", () => {
        lightboxReturn = button;
        lightboxKeys = $$("[data-lightbox]")
          .filter((b) => b.getClientRects().length)
          .map((b) => b.dataset.lightbox);
        lightboxIndex = lightboxKeys.indexOf(button.dataset.lightbox);
        showLightboxImage();
        lightbox.showModal();
        document.body.classList.add("locked");
        $("[data-lightbox-close]").focus();
      }),
    );
    $("[data-lightbox-close]").addEventListener("click", () =>
      lightbox.close(),
    );
    function step(amount) {
      lightboxIndex =
        (lightboxIndex + amount + lightboxKeys.length) % lightboxKeys.length;
      showLightboxImage();
    }
    $("[data-lightbox-prev]").addEventListener("click", () => step(-1));
    $("[data-lightbox-next]").addEventListener("click", () => step(1));
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    });
    lightbox.addEventListener("close", () => {
      document.body.classList.remove("locked");
      lightboxReturn?.focus();
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        const r = lightbox.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          lightbox.close();
      }
    });
  }
  if ($("[data-portfolio-grid]")) {
    let filter = "all";
    const incoming = new URLSearchParams(location.search).get("category");
    if (Object.hasOwn(D.services, incoming)) filter = incoming;
    function filterPhotos() {
      let count = 0;
      $$("[data-photo-category]").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.photoCategory !== filter;
        if (!card.hidden) count++;
      });
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
      );
      $("[data-result-count]").textContent = `${count} photographs`;
    }
    $$("[data-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        filter = b.dataset.filter;
        filterPhotos();
      }),
    );
    filterPhotos();
  }

  /* Print variants use a shared, integer-cent catalogue. */
  const storageKey = "fieldwork-print-bag-v1";
  function validVariant(row) {
    return (
      row &&
      Object.hasOwn(D.prints, row.art) &&
      Number.isInteger(row.size) &&
      D.sizes[row.size] &&
      Object.hasOwn(D.frames, row.frame) &&
      Object.hasOwn(D.finishes, row.finish) &&
      Number.isInteger(row.qty) &&
      row.qty >= 1
    );
  }
  const variantKey = (r) => [r.art, r.size, r.frame, r.finish].join(":");
  const unitPrice = (r) =>
    D.sizes[r.size].price +
    D.frames[r.frame].prices[r.size] +
    D.finishes[r.finish].price;
  const variantText = (r) =>
    `${D.sizes[r.size].label} in · ${D.frames[r.frame].label} · ${D.finishes[r.finish].label}`;
  function readBag() {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(raw)) return [];
      const clean = [];
      raw.slice(0, 100).forEach((r) => {
        if (!validVariant(r)) return;
        const existing = clean.find((x) => variantKey(x) === variantKey(r));
        if (existing) existing.qty = Math.min(20, existing.qty + r.qty);
        else
          clean.push({
            art: r.art,
            size: r.size,
            frame: r.frame,
            finish: r.finish,
            qty: Math.min(20, r.qty),
          });
      });
      return clean;
    } catch {
      return [];
    }
  }
  let bag = readBag();
  const count = () => bag.reduce((n, r) => n + r.qty, 0),
    subtotal = () => bag.reduce((n, r) => n + unitPrice(r) * r.qty, 0);
  const delivery = (mode) =>
    !bag.length || mode === "pickup" || subtotal() >= 18000 ? 0 : 1200;
  function badge() {
    $$("[data-cart-count]").forEach((el) => (el.textContent = count()));
  }
  function saveBag() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bag));
    } catch {}
    badge();
  }
  let toastTimer;
  function notify(text) {
    $("[data-toast-message]").textContent = text;
    $("#bag-toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("#bag-toast").hidden = true), 6500);
  }
  function addPrint(row) {
    if (!validVariant(row)) return;
    const same = bag.find((r) => variantKey(r) === variantKey(row));
    const old = same ? same.qty : 0;
    const next = Math.min(20, old + row.qty);
    if (same) same.qty = next;
    else bag.push({ ...row, qty: next });
    saveBag();
    notify(
      next === old
        ? "This variant is at the demo limit of 20."
        : D.prints[row.art].title + " added to your print bag.",
    );
  }
  badge();
  addEventListener("storage", (e) => {
    if (e.key === storageKey) {
      bag = readBag();
      badge();
      renderBag();
      renderCheckout();
    }
  });
  if ($("[data-print-page]")) {
    const incoming = new URLSearchParams(location.search).get("art");
    const art = Object.hasOwn(D.prints, incoming) ? incoming : "forest",
      p = D.prints[art];
    let qty = 1;
    document.title = p.title + " — Fieldwork Photo";
    $$("[data-print-title]").forEach((el) => (el.textContent = p.title));
    $("[data-print-description]").textContent = p.description;
    $("[data-print-artist]").textContent = p.artist + " / " + p.date;
    $("[data-print-source]").href = p.source;
    const image = $("[data-print-image]");
    image.src = "assets/" + p.image;
    image.alt = p.originalTitle + " — " + p.artist;
    $("[data-print-object]").classList.toggle(
      "landscape",
      p.orientation === "landscape",
    );
    $("[data-print-orientation]").textContent = p.orientation;
    function selection() {
      return {
        art,
        size: Number($("#print-size").value),
        frame: $('[data-frame][aria-pressed="true"]').dataset.frame,
        finish: $('input[name="finish"]:checked').value,
        qty,
      };
    }
    function update() {
      const row = selection(),
        s = D.sizes[row.size],
        frame = D.frames[row.frame],
        object = $("[data-print-object]");
      object.style.setProperty(
        "--ratio",
        p.orientation === "landscape"
          ? `${s.long} / ${s.short}`
          : `${s.short} / ${s.long}`,
      );
      object.style.setProperty("--frame-color", frame.color);
      object.style.setProperty(
        "--frame-width",
        row.frame === "none" ? "0px" : "13px",
      );
      $("[data-print-price]").textContent = money(unitPrice(row));
      $("[data-add-price]").textContent = money(unitPrice(row) * qty);
      $("[data-print-config]").textContent =
        variantText(row) + " · " + p.orientation + " · white paper margin";
      $("[data-print-quantity]").textContent = qty;
      $("[data-qty-minus]").disabled = qty === 1;
      $("[data-qty-plus]").disabled = qty === 20;
    }
    $("#print-size").addEventListener("change", update);
    $$("[data-frame]").forEach((b) =>
      b.addEventListener("click", () => {
        $$("[data-frame]").forEach((el) =>
          el.setAttribute("aria-pressed", String(el === b)),
        );
        update();
      }),
    );
    $$('input[name="finish"]').forEach((el) =>
      el.addEventListener("change", update),
    );
    $("[data-qty-minus]").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      update();
    });
    $("[data-qty-plus]").addEventListener("click", () => {
      qty = Math.min(20, qty + 1);
      update();
    });
    $("[data-add-print]").addEventListener("click", () =>
      addPrint(selection()),
    );
    update();
  }
  /* Enquiry estimates remain on this page and are never sent or stored. */
  const enquiry = $("#booking-form");
  if (enquiry) {
    const service = $("#session-type"),
      pack = $("#session-package");
    function estimate() {
      const s = D.services[service.value],
        p = s.packages[Number(pack.value)];
      $("[data-estimate-title]").textContent = p.name;
      $("[data-estimate-price]").textContent = money(p.price);
      $("[data-estimate-details]").textContent = p.features[0];
      $("#enquiry-result").hidden = true;
    }
    function packages() {
      const s = D.services[service.value];
      pack.innerHTML = s.packages
        .map(
          (p, i) =>
            `<option value="${i}">${p.name} — ${money(p.price)}</option>`,
        )
        .join("");
      estimate();
    }
    const query = new URLSearchParams(location.search);
    if (Object.hasOwn(D.services, query.get("service")))
      service.value = query.get("service");
    packages();
    if (query.get("package") === "1") {
      pack.value = "1";
      estimate();
    }
    service.addEventListener("change", packages);
    pack.addEventListener("change", estimate);
    enquiry.addEventListener(
      "input",
      () => ($("#enquiry-result").hidden = true),
    );
    enquiry.addEventListener("submit", (e) => {
      e.preventDefault();
      const s = D.services[service.value],
        p = s.packages[Number(pack.value)];
      $("#enquiry-summary").textContent =
        `Your sample plan: ${s.label}, ${p.name}, ${money(p.price)}. Preferred timing: ${$("#session-timing").selectedOptions[0].textContent}. No enquiry was sent, no appointment was booked, and no entered details were saved.`;
      $("#enquiry-result").hidden = false;
      $("#enquiry-result").focus();
    });
  }
  function totals(mode = "shipping") {
    return `<div class="summary-line"><span>Prints & frames</span><span>${money(subtotal())}</span></div><div class="summary-line"><span>${mode === "pickup" ? "Sample studio pickup" : "Sample shipping"}</span><span>${delivery(mode) ? money(delivery(mode)) : "Complimentary"}</span></div><div class="summary-line"><span>Tax</span><span>Not calculated in demo</span></div><div class="summary-line total"><strong>Demo total</strong><strong>${money(subtotal() + delivery(mode))}</strong></div>`;
  }
  function renderBag() {
    if (!$("[data-bag-items]")) return;
    const empty = !bag.length;
    $("[data-bag-empty]").hidden = !empty;
    $("[data-bag-filled]").hidden = empty;
    $("[data-bag-items]").innerHTML = bag
      .map((r) => {
        const p = D.prints[r.art],
          key = variantKey(r);
        return `<article class="bag-item"><a href="print.html?art=${r.art}"><img src="assets/${p.image}" alt="${p.title}"></a><div><h2><a href="print.html?art=${r.art}">${p.title}</a></h2><p>${variantText(r)}<br>${money(unitPrice(r))} each</p><div class="quantity"><button type="button" data-bag-change="-1" data-key="${key}" aria-label="Decrease ${p.title} ${variantText(r)} quantity" ${r.qty === 1 ? "disabled" : ""}>−</button><output aria-label="${p.title} quantity">${r.qty}</output><button type="button" data-bag-change="1" data-key="${key}" aria-label="Increase ${p.title} ${variantText(r)} quantity" ${r.qty === 20 ? "disabled" : ""}>+</button></div><button type="button" class="remove-item" data-remove="${key}" aria-label="Remove ${p.title} ${variantText(r)}">Remove</button></div><span class="line-price">${money(unitPrice(r) * r.qty)}</span></article>`;
      })
      .join("");
    $("[data-bag-totals]").innerHTML = totals();
    $("[data-shipping-note]").textContent =
      subtotal() >= 18000
        ? "Your bag qualifies for complimentary sample shipping."
        : `${money(18000 - subtotal())} away from complimentary sample shipping.`;
  }
  if ($("[data-bag-items]"))
    document.addEventListener("click", (e) => {
      const change = e.target.closest("[data-bag-change]"),
        remove = e.target.closest("[data-remove]");
      if (!change && !remove) return;
      const key = change ? change.dataset.key : remove.dataset.remove,
        row = bag.find((r) => variantKey(r) === key);
      if (!row) return;
      if (remove) {
        bag = bag.filter((r) => r !== row);
        notify("Print removed from your bag.");
      } else
        row.qty = Math.max(
          1,
          Math.min(20, row.qty + Number(change.dataset.bagChange)),
        );
      saveBag();
      renderBag();
      if (change) {
        const button = $(
          `[data-key="${key}"][data-bag-change="${change.dataset.bagChange}"]`,
        );
        if (button && !button.disabled) button.focus();
        else
          $(
            `[data-key="${key}"][data-bag-change="${-Number(change.dataset.bagChange)}"]`,
          )?.focus();
      } else
        $("[data-bag-empty]").hidden
          ? $("[data-bag-items] a")?.focus()
          : $("[data-bag-empty] a")?.focus();
    });
  renderBag();
  function renderCheckout() {
    if (!$("[data-checkout-items]")) return;
    const empty = !bag.length;
    $("[data-checkout-empty]").hidden = !empty;
    $("[data-checkout-filled]").hidden = empty;
    $("[data-checkout-items]").innerHTML = bag
      .map(
        (r) =>
          `<div class="checkout-item"><span>${D.prints[r.art].title} × ${r.qty}<small>${variantText(r)}</small></span><span>${money(unitPrice(r) * r.qty)}</span></div>`,
      )
      .join("");
    $("[data-checkout-totals]").innerHTML = totals(
      $('input[name="delivery"]:checked').value,
    );
  }
  const checkout = $("#checkout-form");
  if (checkout) {
    checkout.addEventListener("change", renderCheckout);
    checkout.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!bag.length) return;
      const mode = $('input[name="delivery"]:checked').value;
      $("#confirmation-copy").textContent =
        `Your demo is complete: ${count()} ${count() === 1 ? "print" : "prints"}, ${money(subtotal() + delivery(mode))}, with ${mode === "pickup" ? "sample studio pickup" : "sample shipping"}. Nothing was purchased or sent. Your local print bag has been cleared.`;
      $("#order-confirmation").hidden = false;
      $("[data-checkout-filled]").hidden = true;
      $("[data-checkout-empty]").hidden = true;
      bag = [];
      saveBag();
      checkout.reset();
      $("#order-confirmation").focus();
    });
    renderCheckout();
  }
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("js");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    $$(".reveal").forEach((el) => observer.observe(el));
  }
})();
