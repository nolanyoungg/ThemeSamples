/* Nocturne: local, dependency-free navigation, artwork, and visit planning. */
(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const backdrop = document.querySelector(".nav-backdrop");
  const drawer = document.querySelector(".drawer");
  const menuButton = document.querySelector(".menu-toggle");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const triggers = [...document.querySelectorAll(".nav-trigger")];
  let activeTrigger = null;
  function closeMenus(restore = false) {
    document.querySelectorAll(".nav-panel").forEach((panel) => {
      panel.hidden = true;
    });
    triggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    if (drawer.hidden) backdrop.hidden = true;
    if (restore && activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  }
  triggers.forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      closeMenus();
      if (opening) {
        document.getElementById(button.getAttribute("aria-controls")).hidden =
          false;
        button.setAttribute("aria-expanded", "true");
        activeTrigger = button;
        backdrop.hidden = false;
      }
    }),
  );
  document.querySelectorAll("[data-category]").forEach((button) => {
    function select() {
      document
        .querySelectorAll("[data-category]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      document.querySelector("[data-menu-title]").textContent =
        button.dataset.title;
      document.querySelector("[data-menu-copy]").textContent =
        button.dataset.copy;
      document.querySelector("[data-menu-detail]").textContent =
        button.dataset.detail;
      const image = document.querySelector("[data-menu-image]");
      image.src = button.dataset.image;
      image.alt = button.dataset.imageAlt;
      image.width = 2400;
      image.height = Number(button.dataset.imageHeight);
      const credit = document.querySelector("[data-menu-credit]");
      credit.textContent = button.dataset.credit;
      credit.href = button.dataset.source;
      document.querySelector("[data-menu-link]").href = button.dataset.href;
    }
    ["pointerenter", "focus", "click"].forEach((event) =>
      button.addEventListener(event, select),
    );
  });
  function closeDrawer(restore = true) {
    drawer.hidden = true;
    backdrop.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("locked");
    main.inert = false;
    footer.inert = false;
    header.inert = false;
    if (restore) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    closeMenus();
    drawer.hidden = false;
    backdrop.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("locked");
    main.inert = true;
    footer.inert = true;
    header.inert = true;
    drawer.querySelector(".drawer-close").focus();
  });
  drawer
    .querySelector(".drawer-close")
    .addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () => {
    if (!drawer.hidden) closeDrawer();
    else closeMenus(true);
  });
  document.querySelectorAll(".nav-panel a,.drawer a").forEach((a) =>
    a.addEventListener("click", () => {
      closeMenus();
      if (!drawer.hidden) closeDrawer(false);
    }),
  );
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
    const nodes = [...drawer.querySelectorAll("a,button,summary")].filter(
      (el) => el.getClientRects().length,
    );
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (innerWidth > 920 && !drawer.hidden) closeDrawer(false);
    if (innerWidth <= 920) closeMenus();
  });
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 15);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".desktop-nav>a,.footer-links a").forEach((a) => {
    if (a.getAttribute("href") === current)
      a.setAttribute("aria-current", "page");
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  try {
    userPaused = localStorage.getItem("nocturne-motion-paused") === "true";
  } catch (_) {}
  let paused = userPaused || reduced.matches;
  function updateMotion() {
    paused = userPaused || reduced.matches;
    root.classList.toggle("motion-paused", paused);
    document.querySelectorAll(".motion-toggle").forEach((button) => {
      button.disabled = reduced.matches;
      button.textContent = reduced.matches
        ? "Reduced motion"
        : paused
          ? "Resume motion"
          : "Pause motion";
      button.setAttribute("aria-pressed", String(paused));
    });
    document.dispatchEvent(new Event("nocturne-motion"));
  }
  document.querySelectorAll(".motion-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      userPaused = !userPaused;
      try {
        localStorage.setItem("nocturne-motion-paused", String(userPaused));
      } catch (_) {}
      updateMotion();
    }),
  );
  reduced.addEventListener("change", updateMotion);
  updateMotion();
  if ("IntersectionObserver" in window) {
    if (!paused) root.classList.add("has-motion");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      let count = 0;
      document.querySelectorAll("[data-kind]").forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          card.dataset.kind !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      document.querySelector(".filter-status").textContent =
        count + " " + (count === 1 ? "experience" : "experiences");
    }),
  );
  const chapters = [
    [
      "Chapter 01",
      "A line that keeps going.",
      "Follow the ring around the room. A simple line becomes a horizon, a path, and a way to understand the space differently. This first chapter is about movement, repetition, and the pleasure of finding a pattern.",
    ],
    [
      "Chapter 02",
      "A small change in the way you see.",
      "Move to the other side of the installation. A circle becomes an ellipse, an edge becomes a surface, and the familiar finds a new shape. This chapter invites you to notice how much a point of view can change an experience.",
    ],
    [
      "Chapter 03",
      "Part of a bigger picture.",
      "Step back and take in the whole room. The objects, the light, and the people around you become part of one composition. The final chapter is about connection: the feeling of belonging to a world that extends beyond your own view.",
    ],
  ];
  const chapterButtons = [...document.querySelectorAll("[data-chapter]")];
  function selectChapter(index, focus = false) {
    chapterButtons.forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    ["label", "title", "copy"].forEach((key, i) => {
      document.querySelector("[data-chapter-" + key + "]").textContent =
        chapters[index][i];
    });
    document
      .querySelector("#chapter-panel")
      .setAttribute("aria-labelledby", chapterButtons[index].id);
    if (focus) chapterButtons[index].focus();
  }
  chapterButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectChapter(index));
    button.addEventListener("keydown", (event) => {
      const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (move) {
        event.preventDefault();
        selectChapter((index + move + 3) % 3, true);
      }
      if (event.key === "Home") {
        event.preventDefault();
        selectChapter(0, true);
      }
      if (event.key === "End") {
        event.preventDefault();
        selectChapter(2, true);
      }
    });
  });
  document
    .querySelector("[data-orbit-range]")
    ?.addEventListener("input", (event) => {
      document
        .querySelector(".orbit-study")
        .style.setProperty("--tilt", event.target.value + "deg");
    });

  const experiences = {
    dome: {
      name: "The open dome",
      adult: 38,
      child: 18,
      duration: "90 minutes",
      stops: [
        "Begin with an introduction in the gallery.",
        "Join your guide at the telescope in the great dome.",
        "Finish with time to look out from the terrace.",
      ],
    },
    worlds: {
      name: "Worlds in motion",
      adult: 24,
      child: 12,
      duration: "60 minutes",
      stops: [
        "Meet your gallery host and find your own starting point.",
        "Explore the orbit, perspective, and connection chapters.",
        "Pause in the gathering room and compare what you noticed.",
      ],
    },
    private: {
      name: "A quieter hour",
      adult: 95,
      child: 45,
      duration: "120 minutes",
      stops: [
        "Begin with a private introduction and a conversation about your group.",
        "Explore the gallery and dome at a more personal pace.",
        "End with a quieter hour on the terrace.",
      ],
    },
  };
  const planner = document.querySelector("#visit-planner");
  if (planner) {
    const choice = planner.elements.experience;
    const incoming = new URLSearchParams(location.search).get("experience");
    if (Object.hasOwn(experiences, incoming)) choice.value = incoming;
    const result = planner.querySelector("#plan-result");
    function readPlan() {
      const adults = Number(planner.elements.adults.value),
        children = Number(planner.elements.children.value);
      const valid =
        Number.isInteger(adults) &&
        adults >= 1 &&
        adults <= 8 &&
        Number.isInteger(children) &&
        children >= 0 &&
        children <= 8 &&
        planner.elements.children.value !== "";
      const experience = experiences[choice.value];
      return {
        adults,
        children,
        experience,
        valid,
        total: valid
          ? adults * experience.adult + children * experience.child
          : 0,
      };
    }
    function updatePrice() {
      const plan = readPlan();
      document.querySelector("[data-total]").textContent = plan.valid
        ? "$" + plan.total
        : "—";
      result.hidden = true;
    }
    planner.addEventListener("input", updatePrice);
    planner.addEventListener("change", updatePrice);
    updatePrice();
    planner.addEventListener("submit", (event) => {
      event.preventDefault();
      const plan = readPlan();
      if (!plan.valid) {
        planner.reportValidity();
        return;
      }
      const access = planner.elements["step-free"].checked;
      const summary =
        plan.experience.name +
        " · " +
        planner.elements.day.value +
        " at " +
        planner.elements.time.value +
        " · " +
        plan.experience.duration +
        ". " +
        plan.adults +
        " adult" +
        (plan.adults === 1 ? "" : "s") +
        (plan.children
          ? ", " + plan.children + " child" + (plan.children === 1 ? "" : "ren")
          : "") +
        ". Illustrative total: $" +
        plan.total +
        ".";
      document.querySelector("[data-plan-summary]").textContent = summary;
      const list = document.querySelector("[data-plan-stops]");
      list.replaceChildren();
      const stops = [...plan.experience.stops];
      if (access && choice.value !== "worlds")
        stops[1] =
          "Follow the step-free route, with a telescope-viewing screen in the gallery.";
      if (access && choice.value === "worlds")
        stops[0] =
          "Begin with your gallery host on the step-free exhibition route.";
      stops.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        list.append(li);
      });
      result.hidden = false;
      result.focus();
    });
  }

  const skyStories = [
    [
      "01 / Moonlight",
      "Begin with the familiar.",
      "A moonlit evening is an invitation to slow down. Look closely, ask a question, and discover how much there is to notice in something you thought you knew.",
      "Find an observing session ↗",
      "visit.html?experience=dome",
    ],
    [
      "02 / Star fields",
      "Find a thread in the dark.",
      "A field of small lights becomes a place for shared stories. Follow a guide, compare what you notice, and discover how a simple question can open a much wider conversation.",
      "Explore our night experiences ↗",
      "experiences.html",
    ],
    [
      "03 / Deep space",
      "Make room for the unknown.",
      "Some experiences are about a change of scale. Step into our artist-imagined gallery and let a ringed world, a line of light, and a little open space shift your point of view.",
      "Enter Worlds in Motion ↗",
      "exhibition.html",
    ],
  ];
  let skyIndex = 0;
  document.querySelectorAll("[data-sky]").forEach((button) =>
    button.addEventListener("click", () => {
      skyIndex = Number(button.dataset.sky);
      document
        .querySelectorAll("[data-sky]")
        .forEach((item) =>
          item.setAttribute(
            "aria-pressed",
            String(Number(item.dataset.sky) === skyIndex),
          ),
        );
      const data = skyStories[skyIndex];
      ["label", "title", "copy"].forEach((key, i) => {
        document.querySelector("[data-sky-" + key + "]").textContent = data[i];
      });
      const link = document.querySelector("[data-sky-link]");
      link.textContent = data[3];
      link.href = data[4];
      drawAll();
    }),
  );

  // Original canvas sky artwork. This is a visual study, not astronomical data.
  let seed = 31;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const scenes = [...document.querySelectorAll("[data-stars]")]
    .map((canvas) => ({
      canvas,
      ctx: canvas.getContext("2d"),
      type: canvas.dataset.stars,
      visible: false,
      w: 0,
      h: 0,
      ratio: 1,
      pointer: [0, 0],
      stars: Array.from(
        { length: canvas.dataset.stars === "hero" ? 100 : 210 },
        () => ({
          x: random(),
          y: random(),
          size: random() * 1.2 + 0.3,
          phase: random() * 6.28,
        }),
      ),
    }))
    .filter((scene) => scene.ctx);
  let frame = 0,
    last = 0,
    time = 0;
  function resize(scene) {
    const r = scene.canvas.getBoundingClientRect();
    scene.w = r.width;
    scene.h = r.height;
    if (!r.width || !r.height) return;
    scene.ratio = Math.min(devicePixelRatio || 1, 1.5, 1800 / r.width);
    scene.canvas.width = Math.round(r.width * scene.ratio);
    scene.canvas.height = Math.round(r.height * scene.ratio);
    draw(scene);
  }
  function draw(scene) {
    if (!scene.w || !scene.h) return;
    const c = scene.ctx,
      w = scene.w,
      h = scene.h;
    c.setTransform(scene.ratio, 0, 0, scene.ratio, 0, 0);
    c.clearRect(0, 0, w, h);
    scene.stars.forEach((star) => {
      const twinkle = paused
        ? 0.55
        : 0.5 + Math.sin(time * 0.00065 + star.phase) * 0.25;
      c.fillStyle =
        "rgba(225,234,237," + twinkle * (scene.type === "hero" ? 0.5 : 1) + ")";
      c.beginPath();
      c.arc(
        star.x * w + scene.pointer[0] * star.size,
        star.y * h + scene.pointer[1] * star.size,
        star.size * 0.75,
        0,
        Math.PI * 2,
      );
      c.fill();
    });
    if (scene.type !== "atlas") return;
    if (skyIndex === 0) {
      const x = w * 0.69,
        y = h * 0.57,
        r = Math.min(w, h) * 0.17;
      const halo = c.createRadialGradient(x, y, r * 0.7, x, y, r * 2);
      halo.addColorStop(0, "#d8c5a329");
      halo.addColorStop(1, "transparent");
      c.fillStyle = halo;
      c.fillRect(0, 0, w, h);
      const moon = c.createRadialGradient(x - r * 0.5, y - r * 0.4, 0, x, y, r);
      moon.addColorStop(0, "#dbd1b7");
      moon.addColorStop(0.7, "#b9b8ab");
      moon.addColorStop(1, "#696e70");
      c.fillStyle = moon;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      c.save();
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.clip();
      for (let i = 0; i < 22; i++) {
        const a = i * 2.4,
          dist = r * (((i * 13) % 23) / 25);
        c.fillStyle = i % 2 ? "#555d6728" : "#f2e5bd22";
        c.beginPath();
        c.arc(
          x + Math.cos(a) * dist,
          y + Math.sin(a) * dist,
          r * (0.035 + (i % 5) * 0.023),
          0,
          Math.PI * 2,
        );
        c.fill();
      }
      c.restore();
    } else if (skyIndex === 1) {
      const points = [
        [0.16, 0.27],
        [0.34, 0.19],
        [0.46, 0.4],
        [0.39, 0.61],
        [0.59, 0.72],
        [0.79, 0.58],
        [0.72, 0.32],
      ];
      c.strokeStyle = "#d4b48355";
      c.lineWidth = 0.7;
      c.beginPath();
      points.forEach((p, i) =>
        i ? c.lineTo(p[0] * w, p[1] * h) : c.moveTo(p[0] * w, p[1] * h),
      );
      c.stroke();
      points.forEach((p) => {
        c.fillStyle = "#f7dfb5";
        c.shadowColor = "#d4b483";
        c.shadowBlur = 14;
        c.beginPath();
        c.arc(p[0] * w, p[1] * h, 2, 0, Math.PI * 2);
        c.fill();
      });
      c.shadowBlur = 0;
    } else {
      c.save();
      c.translate(w * 0.51, h * 0.53);
      c.rotate(-0.36);
      for (let i = 0; i < 520; i++) {
        const radius = Math.sqrt(i / 520) * Math.min(w * 0.36, h * 0.58),
          a = i * 2.399 + radius * 0.035 + (paused ? 0 : time * 0.000012);
        const fade = 1 - i / 650;
        c.fillStyle =
          "rgba(" +
          (i % 4 ? "190,199,204" : "224,190,135") +
          "," +
          fade * 0.6 +
          ")";
        c.beginPath();
        c.arc(
          Math.cos(a) * radius,
          Math.sin(a) * radius * 0.38,
          1.15,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
      const glow = c.createRadialGradient(0, 0, 0, 0, 0, 42);
      glow.addColorStop(0, "#f9e5bdcc");
      glow.addColorStop(1, "transparent");
      c.fillStyle = glow;
      c.fillRect(-42, -42, 84, 84);
      c.restore();
    }
  }
  function drawAll() {
    scenes.forEach(draw);
  }
  function tick(now) {
    frame = 0;
    if (paused || document.hidden || !scenes.some((scene) => scene.visible))
      return;
    if (now - last >= 40) {
      time += Math.min(now - last, 80);
      last = now;
      scenes.filter((scene) => scene.visible).forEach(draw);
    }
    frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = performance.now();
    drawAll();
    if (!paused && !document.hidden && scenes.some((scene) => scene.visible))
      frame = requestAnimationFrame(tick);
  }
  scenes.forEach((scene) => {
    new ResizeObserver(() => resize(scene)).observe(scene.canvas);
    new IntersectionObserver((entries) => {
      scene.visible = entries[0].isIntersecting;
      restart();
    }).observe(scene.canvas);
    scene.canvas.parentElement.addEventListener("pointermove", (event) => {
      if (paused) return;
      const r = scene.canvas.getBoundingClientRect();
      scene.pointer = [
        ((event.clientX - r.left) / r.width - 0.5) * 4,
        ((event.clientY - r.top) / r.height - 0.5) * 4,
      ];
    });
    scene.canvas.parentElement.addEventListener("pointerleave", () => {
      scene.pointer = [0, 0];
    });
    resize(scene);
  });
  document.addEventListener("nocturne-motion", restart);
  document.addEventListener("visibilitychange", restart);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
})();
