/* NolanCodes: dependency-free interactions for a local static design preview. */
(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  try {
    root.dataset.theme = localStorage.getItem("nolancodes-theme") || "dark";
    paused = paused || localStorage.getItem("nolancodes-motion") === "paused";
  } catch (_) {
    /* Storage is optional for local file and embedded previews. */
  }

  const header = document.querySelector(".site-header");
  const productTrigger = document.querySelector(".product-trigger");
  const productMenu = document.querySelector("#product-menu");
  const mobileMenu = document.querySelector("#mobile-menu");
  const menuTrigger = document.querySelector(".menu-toggle");
  const mobileProducts = document.querySelector(".mobile-products");
  const mobileProductList = document.querySelector("#mobile-product-list");
  const pageFrame = document.querySelector(".page-frame");
  const themeButton = document.querySelector(".theme-toggle");
  function syncTheme() {
    themeButton.setAttribute(
      "aria-pressed",
      String(root.dataset.theme === "light"),
    );
    document.querySelector('meta[name="theme-color"]').content =
      root.dataset.theme === "light" ? "#f9fafb" : "#09090b";
    document.dispatchEvent(new Event("themechange"));
  }
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("nolancodes-theme", root.dataset.theme);
    } catch (_) {}
    syncTheme();
  });
  syncTheme();

  function closeProduct(restoreFocus = false) {
    productMenu.hidden = true;
    productTrigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) productTrigger.focus();
  }
  productTrigger.addEventListener("click", () => {
    const open = productMenu.hidden;
    productMenu.hidden = !open;
    productTrigger.setAttribute("aria-expanded", String(open));
  });
  function closeMobile(restoreFocus = true) {
    mobileMenu.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    pageFrame.inert = false;
    if (restoreFocus) menuTrigger.focus();
  }
  menuTrigger.addEventListener("click", () => {
    if (!mobileMenu.hidden) {
      closeMobile();
      return;
    }
    closeProduct();
    mobileMenu.hidden = false;
    menuTrigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    pageFrame.inert = true;
    mobileProducts.focus();
  });
  mobileProducts.addEventListener("click", () => {
    mobileProductList.hidden = !mobileProductList.hidden;
    mobileProducts.setAttribute(
      "aria-expanded",
      String(!mobileProductList.hidden),
    );
  });
  document.querySelectorAll(".product-menu a,.mobile-menu a").forEach((link) =>
    link.addEventListener("click", () => {
      closeProduct();
      if (!mobileMenu.hidden) closeMobile(false);
    }),
  );
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeProduct();
  });
  document.addEventListener("focusin", (event) => {
    if (!productMenu.hidden && !header.contains(event.target)) closeProduct();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!mobileMenu.hidden) closeMobile();
      else if (!productMenu.hidden) closeProduct(true);
    }
    if (event.key !== "Tab" || mobileMenu.hidden) return;
    const focusable = [
      themeButton,
      menuTrigger,
      ...mobileMenu.querySelectorAll("a,button"),
    ].filter((el) => el.getClientRects().length);
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
  const breakpoint = matchMedia("(min-width: 768px)");
  breakpoint.addEventListener("change", (event) => {
    if (event.matches && !mobileMenu.hidden) closeMobile(false);
    else closeProduct();
  });

  // The reference's placeholder actions have explicit local demonstrations here.
  let dialogOpener = null;
  function openDialog(dialog, opener) {
    closeProduct();
    if (!mobileMenu.hidden) closeMobile(false);
    dialogOpener = opener;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
  document.querySelectorAll("[data-start]").forEach((button) =>
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const plan = button.dataset.plan;
      document.querySelector("[data-start-copy]").textContent = plan
        ? "You selected the " +
          plan +
          " sample plan. This local demonstration does not create an account, take payment, or start a subscription."
        : "Explore the NolanCodes workflow with a sample plan. This static preview does not create an account or start a subscription.";
      openDialog(document.querySelector("#start-dialog"), button);
    }),
  );
  document.querySelectorAll("[data-contact]").forEach((button) =>
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog(document.querySelector("#contact"), button);
    }),
  );
  document.querySelectorAll("[data-tool-note]").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelector("[data-tool-copy]").textContent =
        button.dataset.toolNote;
      openDialog(document.querySelector("#tool-dialog"), button);
    }),
  );
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog
      .querySelectorAll("[data-close],[data-dismiss]")
      .forEach((button) =>
        button.addEventListener("click", () => dialog.close()),
      );
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      if (dialogOpener?.isConnected && dialogOpener.getClientRects().length)
        dialogOpener.focus();
      else if (menuTrigger.getClientRects().length) menuTrigger.focus();
    });
  });
  document
    .querySelector("#contact-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const status = event.currentTarget.querySelector('[role="status"]');
      status.hidden = false;
      status.textContent = "Demo request complete. Nothing was sent or saved.";
    });

  const demoImages = [
    "code-generation.jpg",
    "smart-review.jpg",
    "auto-testing.jpg",
    "deploy-ready.jpg",
  ];
  const tabs = [...document.querySelectorAll("[data-demo]")];
  const demoImage = document.querySelector(".demo-image");
  const demoPanel = document.querySelector("#demo-panel");
  const showcase = document.querySelector("#demo");
  let selectedDemo = 0;
  let carouselTimer = null;
  let carouselVisible = true;
  let carouselHover = false;
  function selectDemo(index, focus = false) {
    selectedDemo = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const selected = i === selectedDemo;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    demoImage.src = "assets/" + demoImages[selectedDemo];
    demoImage.alt = tabs[selectedDemo].textContent.trim();
    demoPanel.setAttribute("aria-labelledby", tabs[selectedDemo].id);
    if (focus) tabs[selectedDemo].focus();
  }
  function restartCarousel() {
    clearInterval(carouselTimer);
    if (
      !paused &&
      carouselVisible &&
      !carouselHover &&
      !document.hidden &&
      !showcase.contains(document.activeElement)
    ) {
      carouselTimer = setInterval(() => selectDemo(selectedDemo + 1), 6000);
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      selectDemo(i);
      restartCarousel();
    });
    tab.addEventListener("keydown", (event) => {
      const movement = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (movement) {
        event.preventDefault();
        selectDemo(selectedDemo + movement, true);
      }
      if (event.key === "Home") {
        event.preventDefault();
        selectDemo(0, true);
      }
      if (event.key === "End") {
        event.preventDefault();
        selectDemo(tabs.length - 1, true);
      }
    });
  });
  showcase.addEventListener("pointerenter", () => {
    carouselHover = true;
    restartCarousel();
  });
  showcase.addEventListener("pointerleave", () => {
    carouselHover = false;
    restartCarousel();
  });
  showcase.addEventListener("focusin", restartCarousel);
  showcase.addEventListener("focusout", () => setTimeout(restartCarousel, 0));
  new IntersectionObserver((entries) => {
    carouselVisible = entries[0].isIntersecting;
    restartCarousel();
  }).observe(showcase);
  demoImages.slice(1).forEach((file) => {
    const preload = new Image();
    preload.src = "assets/" + file;
  });

  const motionButton = document.querySelector(".motion-toggle");
  function updateMotion(value) {
    paused = value;
    root.classList.toggle("motion-paused", value);
    motionButton.setAttribute("aria-pressed", String(value));
    motionButton.textContent = value ? "Resume motion" : "Pause motion";
    restartCarousel();
    document.dispatchEvent(
      new CustomEvent("motionchange", { detail: { paused: value } }),
    );
  }
  motionButton.addEventListener("click", () => {
    updateMotion(!paused);
    try {
      localStorage.setItem("nolancodes-motion", paused ? "paused" : "playing");
    } catch (_) {}
  });
  reducedMotion.addEventListener("change", (event) =>
    updateMotion(event.matches),
  );
  updateMotion(paused);
  document.addEventListener("visibilitychange", restartCarousel);

  document.querySelector("[data-apply]").addEventListener("click", (event) => {
    const applied = event.currentTarget.dataset.applied !== "true";
    event.currentTarget.dataset.applied = String(applied);
    event.currentTarget.textContent = applied
      ? "✓ Applied locally · Reset example"
      : "Apply suggestion";
    document.querySelectorAll("[data-old-line]").forEach((line) => {
      line.hidden = applied;
    });
  });
  document.querySelectorAll(".sources-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const menu = document.getElementById(
        button.getAttribute("aria-controls"),
      );
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    }),
  );
  document.querySelectorAll("[data-source]").forEach((button) =>
    button.addEventListener("click", () => {
      const selected = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(selected));
      button.querySelector("span:last-child").textContent = selected
        ? "Connected ✓"
        : "Install";
      const feedback = button
        .closest(".source-popover")
        .querySelector(".source-feedback");
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent =
          button.dataset.source +
          (selected
            ? " connected in this demo only."
            : " removed from the local demo.");
      }
    }),
  );

  document.querySelectorAll("[data-billing]").forEach((button) =>
    button.addEventListener("click", () => {
      const annual = button.dataset.billing === "annual";
      document
        .querySelectorAll("[data-billing]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      document.querySelectorAll("[data-monthly]").forEach((price) => {
        price.textContent =
          "$" + (annual ? price.dataset.annual : price.dataset.monthly);
      });
      document.querySelectorAll("[data-period]").forEach((period) => {
        period.textContent = annual ? "/year" : "/month";
      });
      document.querySelector("[data-billing-status]").textContent = annual
        ? "Annual billing selected: Startup 120 dollars, Enterprise 240 dollars, Free zero dollars per year."
        : "Monthly billing selected: Startup 12 dollars, Enterprise 24 dollars, Free zero dollars per month.";
    }),
  );
  document.querySelectorAll(".faq-question").forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-question").forEach((question) => {
        question.setAttribute("aria-expanded", "false");
        document.getElementById(question.getAttribute("aria-controls")).hidden =
          true;
      });
      button.setAttribute("aria-expanded", String(opening));
      document.getElementById(button.getAttribute("aria-controls")).hidden =
        !opening;
    }),
  );

  // Original illustrative quotes; portraits mirror the reference's public image set.
  const testimonials = [
    [
      "Alex Rivera",
      "CTO at InnovateTech",
      "men-91",
      "Our engineering conversations are much more focused now. The assistant prepares the repetitive work, so we can spend review time on architecture, edge cases, and the decisions that matter.",
    ],
    [
      "Samantha Lee",
      "Marketing Director at NextGen Solutions",
      "women-12",
      "A shared place for briefs and implementation makes a real difference. We can explain what we need, see the proposed direction, and give the team useful feedback while the idea is still taking shape.",
    ],
    [
      "Raj Patel",
      "Founder & CEO at StartUp Grid",
      "men-45",
      "A small team needs a clear way to move forward. Having an assistant organize the first draft gives us something concrete to discuss, test, and improve together. It fits the way we already work.",
    ],
    [
      "Emily Chen",
      "Product Manager at Digital Wave",
      "women-83",
      "The best improvement is continuity. Our project context stays close to the work, and the next person can see why a decision was made. That makes handoffs feel like a conversation instead of a restart.",
    ],
    [
      "Michael Brown",
      "Data Scientist at FinTech Innovations",
      "men-1",
      "We can get a prototype into a reviewable state with less repeated setup. The team still owns the reasoning and validation, but the first pass is a much more useful starting point.",
    ],
    [
      "Linda Wu",
      "VP of Operations at LogiChain Solutions",
      "women-5",
      "Clear steps and visible ownership help us keep recurring work under control. A concise summary with the right context is often more useful than another dashboard full of numbers.",
    ],
    [
      "Carlos Gomez",
      "Head of R&D at EcoInnovate",
      "men-14",
      "We like being able to inspect the changes before accepting them. It turns an assistant into a collaborator: something that proposes useful work while leaving the final judgment with our team.",
    ],
    [
      "Aisha Khan",
      "Chief Marketing Officer at Fashion Forward",
      "women-56",
      "Ideas are easier to develop when everyone can follow the same thread. A shared brief, a visible draft, and a clear review step keep our creative and technical teams moving together.",
    ],
    [
      "Tom Chen",
      "Director of IT at HealthTech Solutions",
      "men-18",
      "The workspace gives each project an understandable boundary. We can keep reference material organized and make the next action visible without asking people to reconstruct a long conversation.",
    ],
    [
      "Sofia Patel",
      "CEO at EduTech Innovations",
      "women-73",
      "Our team learns from examples, so a readable first draft is valuable. It gives us something to question, explain, and improve. The process feels more collaborative from the beginning.",
    ],
    [
      "Jake Morrison",
      "CTO at SecureNet Tech",
      "men-25",
      "A good assistant should make its work easier to review. Clear diffs and explicit checkpoints help us stay deliberate about what changes and why, even when a project is moving quickly.",
    ],
    [
      "Nadia Ali",
      "Product Manager at Creative Solutions",
      "women-78",
      "Design context used to get lost between tools. Keeping the references near the implementation helps everyone understand the intent and makes feedback far more specific.",
    ],
    [
      "Omar Farooq",
      "Founder at Startup Hub",
      "men-54",
      "Starting small has worked well for us. One project, a few useful connections, and a clear outcome. We can see where the workflow helps before adding more complexity to the team.",
    ],
  ];
  document.querySelectorAll("[data-testimonials]").forEach((track, row) => {
    const items = row === 0 ? testimonials.slice(0, 7) : testimonials.slice(7);
    for (let repeat = 0; repeat < 2; repeat++) {
      items.forEach(([name, role, portrait, quote]) => {
        const card = document.createElement("article");
        card.className = "testimonial";
        if (repeat) card.setAttribute("aria-hidden", "true");
        const text = document.createElement("p");
        text.textContent = quote;
        const person = document.createElement("div");
        person.className = "testimonial-person";
        const image = document.createElement("img");
        image.src = "assets/portrait-" + portrait + ".jpg";
        image.alt = name;
        image.width = 40;
        image.height = 40;
        image.decoding = "async";
        const info = document.createElement("div");
        const author = document.createElement("strong");
        author.textContent = name;
        const title = document.createElement("span");
        title.textContent = role;
        info.append(author, title);
        person.append(image, info);
        card.append(text, person);
        track.append(card);
      });
    }
  });

  if (!paused) root.classList.add("has-motion");
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        if (entry.target.matches("[data-terminal]") && !paused)
          entry.target.classList.add("terminal-running");
        revealObserver.unobserve(entry.target);
      }),
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
  const sceneObserver = new IntersectionObserver((entries) =>
    entries.forEach((entry) =>
      entry.target.classList.toggle("offscreen", !entry.isIntersecting),
    ),
  );
  document
    .querySelectorAll("#testimonials,.network-stage,.map-stage,.agents-stage")
    .forEach((el) => sceneObserver.observe(el));
  const stepObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const labels = [
          "Plan, search",
          "Connect your tools",
          "Build the next feature",
        ];
        document.querySelector("[data-step-prompt]").textContent =
          labels[Number(entry.target.dataset.step)];
      }),
    { rootMargin: "-20% 0px -35% 0px", threshold: 0.1 },
  );
  document
    .querySelectorAll("[data-step]")
    .forEach((el) => stepObserver.observe(el));

  // Animated monochrome dot fields echo the reference's textured separators.
  const textures = [...document.querySelectorAll(".hash-strip")].map(
    (container, index) => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      container.append(canvas);
      return {
        canvas,
        context: canvas.getContext("2d"),
        visible: false,
        seed: index * 7,
      };
    },
  );
  let textureFrame = 0,
    textureLast = 0,
    textureTime = 0;
  function drawTextures() {
    textures.forEach((scene) => {
      if (!scene.context || !scene.visible) return;
      const { canvas, context, seed } = scene;
      const width = Math.round(canvas.clientWidth),
        height = Math.round(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      const light = root.dataset.theme === "light";
      const t = textureTime * 0.00018 + seed;
      for (let y = 1; y < height; y += 3) {
        for (let x = 1; x < width; x += 3) {
          const wave =
            Math.sin(x * 0.038 + Math.sin(y * 0.1 + t) * 2 + t) +
            Math.cos(y * 0.12 - x * 0.017 - t) +
            Math.sin(x * 0.011 + y * 0.07 + t * 0.7);
          const grain =
            (Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453) % 1;
          if (wave > 0.45 + Math.abs(grain) * 1.25) {
            context.fillStyle = light
              ? "rgba(30,30,30,.62)"
              : "rgba(230,230,230,.72)";
            context.fillRect(x, y, 1.4, 1.4);
          }
        }
      }
    });
  }
  function textureTick(now) {
    textureFrame = 0;
    if (paused || document.hidden || !textures.some((scene) => scene.visible))
      return;
    if (now - textureLast > 100) {
      textureTime += Math.min(now - textureLast, 150);
      textureLast = now;
      drawTextures();
    }
    textureFrame = requestAnimationFrame(textureTick);
  }
  function restartTextures() {
    cancelAnimationFrame(textureFrame);
    textureFrame = 0;
    drawTextures();
    if (!paused && !document.hidden && textures.some((scene) => scene.visible))
      textureFrame = requestAnimationFrame(textureTick);
  }
  textures.forEach((scene) =>
    new IntersectionObserver((entries) => {
      scene.visible = entries[0].isIntersecting;
      restartTextures();
    }).observe(scene.canvas),
  );
  document.addEventListener("motionchange", restartTextures);
  document.addEventListener("themechange", drawTextures);
  document.addEventListener("visibilitychange", restartTextures);
  window.addEventListener("resize", drawTextures);
  window.addEventListener("pagehide", () => {
    clearInterval(carouselTimer);
    cancelAnimationFrame(textureFrame);
  });
})();
