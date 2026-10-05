/* Navigation, motion preferences and local-only interactions. No network requests. */
(() => {
  const header = document.querySelector(".site-header");
  const backdrop = document.querySelector(".nav-backdrop");
  const drawer = document.querySelector(".mobile-drawer");
  const menuButton = document.querySelector(".menu-toggle");
  const triggers = [...document.querySelectorAll(".nav-trigger")];
  let activeTrigger = null;
  let returnFocus = null;
  function closeMenus(restore = false) {
    document.querySelectorAll(".mega-menu").forEach((menu) => {
      menu.hidden = true;
    });
    triggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    backdrop.hidden = !drawer || drawer.hidden;
    if (restore && activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  }
  triggers.forEach((button) =>
    button.addEventListener("click", () => {
      const wasOpen = button.getAttribute("aria-expanded") === "true";
      closeMenus();
      if (!wasOpen) {
        document.getElementById(button.getAttribute("aria-controls")).hidden =
          false;
        button.setAttribute("aria-expanded", "true");
        backdrop.hidden = false;
        activeTrigger = button;
      }
    }),
  );
  document.querySelectorAll(".category").forEach((button) => {
    function selectCategory() {
      const menu = button.closest(".mega-menu");
      menu.querySelectorAll(".category").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      menu.querySelector("[data-menu-heading]").textContent =
        button.dataset.heading;
      menu.querySelector("[data-menu-description]").textContent =
        button.dataset.description;
      menu.querySelector("[data-menu-details]").textContent =
        button.dataset.details;
      menu.querySelector("[data-menu-link]").href = button.dataset.link;
      menu.querySelector(".category-preview img").src = button.dataset.image;
    }
    ["pointerenter", "focus", "click"].forEach((event) =>
      button.addEventListener(event, selectCategory),
    );
  });
  function closeDrawer(restore = true) {
    drawer.hidden = true;
    backdrop.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-locked");
    document.querySelector("main").inert = false;
    document.querySelector("footer").inert = false;
    header.inert = false;
    if (restore && returnFocus) returnFocus.focus();
  }
  menuButton.addEventListener("click", () => {
    closeMenus();
    returnFocus = menuButton;
    drawer.hidden = false;
    backdrop.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-locked");
    document.querySelector("main").inert = true;
    document.querySelector("footer").inert = true;
    header.inert = true;
    drawer.querySelector(".drawer-close").focus();
  });
  drawer
    .querySelector(".drawer-close")
    .addEventListener("click", () => closeDrawer());
  drawer
    .querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => closeDrawer(false)),
    );
  backdrop.addEventListener("click", () => {
    if (!drawer.hidden) closeDrawer();
    else closeMenus(true);
  });
  document.addEventListener("click", (event) => {
    if (activeTrigger && !header.contains(event.target)) closeMenus();
  });
  document.addEventListener("focusin", (event) => {
    if (activeTrigger && !header.contains(event.target)) closeMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!drawer.hidden) closeDrawer();
      else closeMenus(true);
    }
    if (event.key !== "Tab" || drawer.hidden) return;
    const focusable = [...drawer.querySelectorAll("a,button,summary")].filter(
      (el) => el.getClientRects().length,
    );
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800 && !drawer.hidden) closeDrawer(false);
    if (window.innerWidth <= 800) closeMenus();
  });
  const markScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", markScroll, { passive: true });
  markScroll();
  const current = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(
      ".desktop-nav a, .mobile-drawer nav a, .site-footer nav a",
    )
    .forEach((a) => {
      if (a.getAttribute("href") === current)
        a.setAttribute("aria-current", "page");
    });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reduced.matches;
  try {
    paused =
      reduced.matches || localStorage.getItem("theme-motion-paused") === "true";
  } catch (_) {}
  function setMotion(value) {
    paused = value;
    document.documentElement.classList.toggle("motion-paused", paused);
    document.querySelectorAll(".motion-toggle").forEach((button) => {
      button.textContent = paused ? "Resume motion" : "Pause motion";
      button.setAttribute("aria-pressed", String(paused));
    });
    document.dispatchEvent(
      new CustomEvent("motionchange", { detail: { paused } }),
    );
  }
  setMotion(paused);
  document.querySelectorAll(".motion-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      setMotion(!paused);
      try {
        localStorage.setItem("theme-motion-paused", String(paused));
      } catch (_) {}
    }),
  );
  reduced.addEventListener("change", (event) => setMotion(event.matches));
  if (!paused && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");
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
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  document.querySelectorAll("[data-billing]").forEach((button) =>
    button.addEventListener("click", () => {
      const yearly = button.dataset.billing === "yearly";
      document
        .querySelectorAll("[data-billing]")
        .forEach((el) =>
          el.setAttribute("aria-pressed", String(el === button)),
        );
      document.querySelectorAll("[data-monthly-price]").forEach((el) => {
        el.textContent = yearly
          ? el.dataset.yearlyPrice
          : el.dataset.monthlyPrice;
      });
      document.querySelectorAll("[data-billing-note]").forEach((el) => {
        el.textContent = yearly
          ? "per month, billed annually"
          : "per month, billed monthly";
      });
      const status = document.querySelector("[data-billing-status]");
      if (status)
        status.textContent = yearly
          ? "Annual billing selected. Prices show the monthly equivalent."
          : "Monthly billing selected.";
    }),
  );
  document.querySelectorAll("form[data-local-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector("[role=status]");
      feedback.hidden = false;
      feedback.textContent =
        "Your demo request is ready. This is a local preview: no information was sent or saved.";
    }),
  );
  const planSelect = document.querySelector("select[name=plan]");
  const chosenPlan = new URLSearchParams(location.search).get("plan");
  if (
    planSelect &&
    chosenPlan &&
    [...planSelect.options].some((option) => option.value === chosenPlan)
  )
    planSelect.value = chosenPlan;
})();
