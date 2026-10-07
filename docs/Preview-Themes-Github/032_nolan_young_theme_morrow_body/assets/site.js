/* Morrow Body: a local storefront demonstration. No requests or payments. */
(() => {
  const products = {
    veil: {
      name: "Daily Veil",
      kind: "Body lotion",
      category: "body",
      feel: "Light & silky",
      note: "Oat milk · soft cedar",
      image: "daily-veil.jpg",
      alt: "Unbranded white pump bottle in warm sunlight beside a stone dish",
      sizes: [
        { label: "200 mL", price: 2800 },
        { label: "400 mL", price: 4400 },
      ],
      description:
        "Your everyday exhale. A light, flowing body lotion imagined for an easy morning ritual, with a soft finish and a quietly woody scent.",
      texture:
        "A fluid lotion with a light, silky feel. The everyday starting point in the Morrow collection.",
      ritual:
        "A small pause after your shower, before the day begins. Keep the bottle somewhere you will enjoy reaching for it.",
      gallery: ["daily-veil.jpg", "daily-veil-detail.jpg", "cream-texture.jpg"],
    },
    cloud: {
      name: "Cloud Cream",
      kind: "Rich body lotion",
      category: "body",
      feel: "Rich & cushiony",
      note: "Soft linen · white tea",
      image: "cloud-cream.jpg",
      alt: "Open white cream jar and delicate dried flowers on an olive background",
      sizes: [
        { label: "180 mL", price: 3400 },
        { label: "300 mL", price: 4800 },
      ],
      description:
        "A little more comfort, a little less hurry. A rich body lotion concept with a cloudlike texture and a soft, understated scent.",
      texture:
        "A generous, cushiony cream. A slower texture for the moments when a little richness feels right.",
      ritual:
        "Leave a few minutes for yourself at the end of the day. Open the jar, take your time, and make the ordinary feel considered.",
      gallery: ["cloud-cream.jpg", "cream-texture.jpg", "evening-balm.jpg"],
    },
    hands: {
      name: "Still Hands",
      kind: "Hand lotion",
      category: "hands",
      feel: "Soft & velvety",
      note: "Fig leaf · warm wood",
      image: "still-hands.jpg",
      alt: "Unbranded cream jar on linen beside a glass vase of green foliage",
      sizes: [
        { label: "75 mL", price: 1800 },
        { label: "150 mL", price: 2800 },
      ],
      description:
        "For the hands that do everything. A velvety hand lotion concept, made to belong beside the sink, on your desk, or wherever you pause.",
      texture:
        "A soft, velvety hand cream with a close, quietly green scent. A small companion for a busy day.",
      ritual:
        "Make room for a pause between one thing and the next. A familiar object, an easy habit, a moment that is just yours.",
      gallery: ["still-hands.jpg", "cream-texture.jpg", "cloud-cream.jpg"],
    },
    balm: {
      name: "Evening Balm",
      kind: "Body balm",
      category: "body",
      feel: "Dense & buttery",
      note: "Golden honey · sandalwood",
      image: "evening-balm.jpg",
      alt: "Open jar of golden balm on natural linen with a sponge and folded towels",
      sizes: [
        { label: "120 mL", price: 3200 },
        { label: "240 mL", price: 4600 },
      ],
      description:
        "The last lovely thing in your day. A dense body balm concept with a warm scent, for an unhurried evening and a slower kind of care.",
      texture:
        "A dense, buttery balm. The most substantial texture in the collection, designed around an evening mood.",
      ritual:
        "Set the phone down. Turn the lights a little lower. Give the end of the day the same attention you give its beginning.",
      gallery: ["evening-balm.jpg", "still-hands.jpg", "cream-texture.jpg"],
    },
  };
  const photoAlts = {
    "daily-veil.jpg": products.veil.alt,
    "daily-veil-detail.jpg":
      "White pump bottle casting a long shadow across a golden background",
    "cream-texture.jpg": "Close-up photograph of softly spread white cream",
    "cloud-cream.jpg": products.cloud.alt,
    "still-hands.jpg": products.hands.alt,
    "evening-balm.jpg": products.balm.alt,
  };
  const money = (cents) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(cents / 100);
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const key = "morrow-body-cart-v1";
  function readCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(raw)) return [];
      const clean = [];
      raw.slice(0, 40).forEach((row) => {
        if (
          !row ||
          !Object.hasOwn(products, row.id) ||
          !Number.isInteger(row.size) ||
          !products[row.id].sizes[row.size] ||
          !Number.isInteger(row.qty) ||
          row.qty < 1
        )
          return;
        const existing = clean.find(
          (item) => item.id === row.id && item.size === row.size,
        );
        if (existing) existing.qty = Math.min(20, existing.qty + row.qty);
        else
          clean.push({
            id: row.id,
            size: row.size,
            qty: Math.min(20, row.qty),
          });
      });
      return clean;
    } catch {
      return [];
    }
  }
  let cart = readCart();
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(cart));
    } catch {}
    updateBadges();
  }
  const count = () => cart.reduce((total, row) => total + row.qty, 0);
  const subtotal = () =>
    cart.reduce(
      (total, row) => total + products[row.id].sizes[row.size].price * row.qty,
      0,
    );
  const shipping = (mode) =>
    !cart.length ? 0 : mode === "express" ? 1200 : subtotal() >= 6000 ? 0 : 600;
  function updateBadges() {
    $$("[data-bag-count]").forEach((el) => (el.textContent = count()));
  }
  let toastTimer;
  function notify(message) {
    const toast = $("#cart-toast");
    if (!toast) return;
    toast.querySelector("[data-toast-message]").textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 6000);
  }
  function addItem(id, size = 0, qty = 1) {
    if (
      !Object.hasOwn(products, id) ||
      !products[id].sizes[size] ||
      !Number.isInteger(qty) ||
      qty < 1
    )
      return;
    const row = cart.find((row) => row.id === id && row.size === size);
    const previous = row ? row.qty : 0,
      next = Math.min(20, previous + qty);
    if (row) row.qty = next;
    else cart.push({ id, size, qty: next });
    persist();
    notify(
      next === previous
        ? "This item is at the demo limit of 20."
        : `${products[id].name} added to your bag.`,
    );
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addItem(button.dataset.add);
  });
  updateBadges();
  window.addEventListener("storage", (event) => {
    if (event.key === key) {
      cart = readCart();
      updateBadges();
      renderBag();
      renderCheckout();
    }
  });

  /* Header menus, mobile drawer, and search. */
  const header = $(".site-header"),
    backdrop = $(".backdrop"),
    drawer = $("#mobile-drawer"),
    menuToggle = $(".menu-toggle");
  let menuTrigger = null;
  function closeMenus(restore = false) {
    $$(".nav-panel").forEach((panel) => (panel.hidden = true));
    $$(".nav-trigger").forEach((button) =>
      button.setAttribute("aria-expanded", "false"),
    );
    if (drawer.hidden) backdrop.hidden = true;
    if (restore && menuTrigger) menuTrigger.focus();
    menuTrigger = null;
  }
  $$(".nav-trigger").forEach((button) =>
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      closeMenus();
      if (open) {
        $("#" + button.getAttribute("aria-controls")).hidden = false;
        button.setAttribute("aria-expanded", "true");
        menuTrigger = button;
        backdrop.hidden = false;
      }
    }),
  );
  $$("[data-category]").forEach((button) => {
    function select() {
      const item = products[button.dataset.category];
      if (!item) return;
      $$("[data-category]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      $("[data-menu-title]").textContent = item.name;
      $("[data-menu-copy]").textContent = item.description;
      $("[data-menu-detail]").textContent =
        item.feel + " / From " + money(item.sizes[0].price);
      const img = $("[data-menu-image]");
      img.src = "assets/" + item.image;
      img.alt = item.alt;
      $("[data-menu-link]").href =
        "product.html?item=" + button.dataset.category;
    }
    ["pointerenter", "focus", "click"].forEach((name) =>
      button.addEventListener(name, select),
    );
  });
  function closeDrawer(restore = true) {
    drawer.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("locked");
    $("main").inert = false;
    $("footer").inert = false;
    $(".newsletter").inert = false;
    $(".announce").inert = false;
    header.inert = false;
    menuToggle.setAttribute("aria-expanded", "false");
    if (restore) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    closeMenus();
    drawer.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add("locked");
    $("main").inert = true;
    $("footer").inert = true;
    $(".newsletter").inert = true;
    $(".announce").inert = true;
    header.inert = true;
    menuToggle.setAttribute("aria-expanded", "true");
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!drawer.hidden) closeDrawer();
      else closeMenus(true);
    }
    if (event.key === "Tab" && !drawer.hidden) {
      const focusable = [
        ...drawer.querySelectorAll("a,button,summary,input"),
      ].filter((el) => el.getClientRects().length);
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.addEventListener("resize", () => {
    if (innerWidth > 900 && !drawer.hidden) closeDrawer();
    if (innerWidth <= 900) closeMenus();
  });
  const scrollHeader = () => header.classList.toggle("scrolled", scrollY > 15);
  scrollHeader();
  window.addEventListener("scroll", scrollHeader, { passive: true });
  const search = $("#search-dialog");
  function renderSearch() {
    const query = $("#product-search").value.trim().toLowerCase();
    const found = Object.entries(products).filter(([, p]) =>
      `${p.name} ${p.kind} ${p.note} ${p.feel}`.toLowerCase().includes(query),
    );
    $("[data-search-results]").innerHTML = found.length
      ? found
          .map(
            ([id, p]) =>
              `<a class="search-result" href="product.html?item=${id}"><img src="assets/${p.image}" alt="${p.alt}"><div><strong>${p.name}</strong><p>${p.kind} · ${money(p.sizes[0].price)}</p></div><span aria-hidden="true">↗</span></a>`,
          )
          .join("")
      : '<p class="empty-state">No matches. Try “body”, “hands”, or “rich”.</p>';
    $("[data-search-count]").textContent = `${found.length} products found`;
  }
  let searchReturnFocus = null;
  $$("[data-open-search]").forEach((button) =>
    button.addEventListener("click", () => {
      searchReturnFocus = drawer.contains(button) ? menuToggle : button;
      if (!drawer.hidden) closeDrawer(false);
      closeMenus();
      search.showModal();
      document.body.classList.add("locked");
      renderSearch();
      $("#product-search").focus();
    }),
  );
  $("[data-close-search]").addEventListener("click", () => search.close());
  search.addEventListener("close", () => {
    document.body.classList.remove("locked");
    searchReturnFocus?.focus();
  });
  search.addEventListener("click", (event) => {
    if (event.target === search) {
      const rect = search.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        search.close();
    }
  });
  $("#product-search").addEventListener("input", renderSearch);

  /* Catalogue controls. The initial product cards are ordinary HTML. */
  const shop = $("[data-shop-grid]");
  if (shop) {
    let filter = "all";
    const requested = new URLSearchParams(location.search).get("category");
    if (["body", "hands"].includes(requested)) filter = requested;
    const cards = [...shop.querySelectorAll("[data-item]")];
    function filterShop() {
      const sort = $("#shop-sort").value;
      let visible = 0;
      cards
        .sort((a, b) => {
          const ap = products[a.dataset.item].sizes[0].price,
            bp = products[b.dataset.item].sizes[0].price;
          return sort === "low"
            ? ap - bp
            : sort === "high"
              ? bp - ap
              : Object.keys(products).indexOf(a.dataset.item) -
                Object.keys(products).indexOf(b.dataset.item);
        })
        .forEach((card) => {
          card.hidden =
            filter !== "all" && products[card.dataset.item].category !== filter;
          if (!card.hidden) visible++;
          shop.append(card);
        });
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
      );
      $("[data-shop-count]").textContent = `${visible} considered essentials`;
    }
    $$("[data-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        filter = b.dataset.filter;
        filterShop();
      }),
    );
    $("#shop-sort").addEventListener("change", filterShop);
    filterShop();
  }
  /* One complete product template serves each item and size. */
  if ($("[data-product-page]")) {
    const incoming = new URLSearchParams(location.search).get("item"),
      id = Object.hasOwn(products, incoming) ? incoming : "veil",
      p = products[id];
    let size = 0,
      qty = 1;
    document.title = p.name + " — Morrow Body";
    $$("[data-product-name]").forEach((el) => (el.textContent = p.name));
    $("[data-product-kind]").textContent = p.kind + " / " + p.feel;
    $("[data-product-description]").textContent = p.description;
    $("[data-product-notes]").textContent = p.note;
    $("[data-product-texture]").textContent = p.texture;
    $("[data-product-ritual]").textContent = p.ritual;
    const mainImage = $("[data-product-image]");
    mainImage.src = "assets/" + p.image;
    mainImage.alt = p.alt;
    $("[data-thumbnails]").innerHTML = p.gallery
      .map(
        (file, i) =>
          `<button type="button" data-photo="${file}" aria-label="View ${i === 0 ? "product" : i === 1 ? "detail" : "texture"} photograph" aria-pressed="${i === 0}"><img src="assets/${file}" alt="${photoAlts[file]}"></button>`,
      )
      .join("");
    $$("[data-photo]").forEach((b) =>
      b.addEventListener("click", () => {
        mainImage.src = "assets/" + b.dataset.photo;
        mainImage.alt = photoAlts[b.dataset.photo];
        $$("[data-photo]").forEach((el) =>
          el.setAttribute("aria-pressed", String(el === b)),
        );
      }),
    );
    $("[data-size-options]").innerHTML = p.sizes
      .map(
        (s, i) =>
          `<button type="button" data-size="${i}" aria-pressed="${i === 0}">${s.label}</button>`,
      )
      .join("");
    function purchaseState() {
      $("[data-product-price]").textContent = money(p.sizes[size].price);
      $("[data-add-price]").textContent = money(p.sizes[size].price * qty);
      $("[data-quantity]").textContent = qty;
      $("[data-quantity-minus]").disabled = qty === 1;
      $("[data-quantity-plus]").disabled = qty === 20;
    }
    $$("[data-size]").forEach((b) =>
      b.addEventListener("click", () => {
        size = Number(b.dataset.size);
        $$("[data-size]").forEach((el) =>
          el.setAttribute("aria-pressed", String(el === b)),
        );
        purchaseState();
      }),
    );
    $("[data-quantity-minus]").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      purchaseState();
    });
    $("[data-quantity-plus]").addEventListener("click", () => {
      qty = Math.min(20, qty + 1);
      purchaseState();
    });
    $("[data-product-add]").addEventListener("click", () =>
      addItem(id, size, qty),
    );
    purchaseState();
  }
  /* Preference finder, not a health questionnaire. */
  const quiz = $("#ritual-form");
  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(quiz);
      const id =
        data.get("place") === "hands"
          ? "hands"
          : data.get("texture") === "light"
            ? "veil"
            : data.get("moment") === "evening"
              ? "balm"
              : "cloud";
      const p = products[id];
      $("[data-ritual-name]").textContent = p.name;
      $("[data-ritual-copy]").textContent =
        `You chose ${data.get("texture") === "light" ? "a lighter" : "a richer"} texture for ${data.get("place") === "hands" ? "your hands" : "your body"}. ${p.texture}`;
      $("[data-ritual-link]").href = "product.html?item=" + id;
      $("[data-ritual-add]").dataset.add = id;
      $("#ritual-result").hidden = false;
      $("#ritual-result").focus();
    });
    quiz.addEventListener("change", () => ($("#ritual-result").hidden = true));
  }

  function summaryMarkup(mode = "standard") {
    return `<div class="summary-line"><span>Subtotal</span><span>${money(subtotal())}</span></div><div class="summary-line"><span>Sample ${mode} delivery</span><span>${shipping(mode) ? money(shipping(mode)) : "Complimentary"}</span></div><div class="summary-line"><span>Tax</span><span>Not calculated in demo</span></div><div class="summary-line total"><strong>Demo total</strong><strong>${money(subtotal() + shipping(mode))}</strong></div>`;
  }
  function renderBag() {
    const container = $("[data-cart-items]");
    if (!container) return;
    const empty = cart.length === 0;
    $("[data-cart-empty]").hidden = !empty;
    $("[data-cart-filled]").hidden = empty;
    container.innerHTML = cart
      .map((row) => {
        const p = products[row.id],
          s = p.sizes[row.size];
        return `<article class="bag-item"><a href="product.html?item=${row.id}"><img src="assets/${p.image}" alt="${p.alt}"></a><div><h2><a href="product.html?item=${row.id}">${p.name}</a></h2><p>${p.kind} / ${s.label} / ${money(s.price)} each</p><div class="quantity"><button type="button" data-cart-change="-1" data-id="${row.id}" data-size="${row.size}" aria-label="Decrease ${p.name} quantity" ${row.qty === 1 ? "disabled" : ""}>−</button><output aria-label="${p.name} quantity">${row.qty}</output><button type="button" data-cart-change="1" data-id="${row.id}" data-size="${row.size}" aria-label="Increase ${p.name} quantity" ${row.qty === 20 ? "disabled" : ""}>+</button></div><button type="button" class="remove-item" data-remove="${row.id}" data-size="${row.size}" aria-label="Remove ${p.name} ${s.label}">Remove</button></div><span class="line-price">${money(s.price * row.qty)}</span></article>`;
      })
      .join("");
    $("[data-cart-summary]").innerHTML = summaryMarkup();
    const remaining = Math.max(0, 6000 - subtotal());
    $("[data-shipping-copy]").textContent = remaining
      ? `${money(remaining)} away from complimentary sample delivery.`
      : "Your bag qualifies for complimentary sample delivery.";
    $("[data-shipping-progress]").style.width =
      Math.min(100, subtotal() / 60) + "%";
  }
  if ($("[data-cart-items]"))
    document.addEventListener("click", (event) => {
      const change = event.target.closest("[data-cart-change]"),
        remove = event.target.closest("[data-remove]");
      if (!change && !remove) return;
      const button = change || remove;
      const id = change ? button.dataset.id : button.dataset.remove,
        size = Number(button.dataset.size);
      const row = cart.find((r) => r.id === id && r.size === size);
      if (!row) return;
      if (remove) {
        cart = cart.filter((r) => r !== row);
        notify(products[id].name + " removed.");
      } else
        row.qty = Math.max(
          1,
          Math.min(20, row.qty + Number(button.dataset.cartChange)),
        );
      persist();
      renderBag();
      if (change) {
        const again = $(
          `[data-cart-change="${button.dataset.cartChange}"][data-id="${id}"][data-size="${size}"]`,
        );
        if (again && !again.disabled) again.focus();
        else
          $(
            `[data-cart-change="${-Number(button.dataset.cartChange)}"][data-id="${id}"][data-size="${size}"]`,
          )?.focus();
      } else
        $("[data-cart-empty]").hidden
          ? $("[data-cart-items] a")?.focus()
          : $("[data-cart-empty] a")?.focus();
    });
  renderBag();
  function renderCheckout() {
    if (!$("[data-checkout-items]")) return;
    const empty = !cart.length;
    $("[data-checkout-empty]").hidden = !empty;
    $("[data-checkout-filled]").hidden = empty;
    const mode = $('input[name="delivery"]:checked')?.value || "standard";
    $("[data-checkout-items]").innerHTML = cart
      .map(
        (row) =>
          `<div class="checkout-item"><span>${products[row.id].name} × ${row.qty}<small>${products[row.id].sizes[row.size].label}</small></span><span>${money(products[row.id].sizes[row.size].price * row.qty)}</span></div>`,
      )
      .join("");
    $("[data-checkout-summary]").innerHTML = summaryMarkup(mode);
  }
  const checkout = $("#checkout-form");
  if (checkout) {
    checkout.addEventListener("change", renderCheckout);
    checkout.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!cart.length) return;
      const mode = new FormData(checkout).get("delivery");
      const amount = subtotal() + shipping(mode),
        units = count();
      const note = $("#gift-note").value.trim();
      $("#confirmation-copy").textContent =
        `Your local demonstration is complete: ${units} ${units === 1 ? "item" : "items"}, ${money(amount)}, with ${mode} sample delivery. Nothing was ordered or charged.`;
      $("#confirmation-note").textContent = note
        ? "Your sample gift note: " + note
        : "";
      $("#order-confirmation").hidden = false;
      $("[data-checkout-filled]").hidden = true;
      $("[data-checkout-empty]").hidden = true;
      cart = [];
      persist();
      checkout.reset();
      $("#order-confirmation").focus();
    });
    renderCheckout();
  }
  $$(".newsletter-form").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.parentElement.querySelector(".form-status").textContent =
        "Thank you — this is a local preview. Your email was not sent or saved.";
      form.reset();
    }),
  );
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
