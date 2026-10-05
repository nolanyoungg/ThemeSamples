/* Acme AI: static navigation and clearly labeled local product demonstrations. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  try {
    root.dataset.theme = localStorage.getItem("acme-preview-theme") || "light";
    userPaused = localStorage.getItem("acme-preview-paused") === "true";
  } catch (_) {
    /* The preview also works without browser storage. */
  }
  let paused = userPaused || reduced.matches;
  function updateTheme() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = root.dataset.theme === "dark";
      button.textContent = dark ? "Light mode" : "Dark mode";
      button.setAttribute("aria-pressed", String(dark));
    });
    document.querySelector('meta[name="theme-color"]').content =
      root.dataset.theme === "dark" ? "#0a0a0a" : "#ffffff";
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("acme-preview-theme", root.dataset.theme);
      } catch (_) {}
      updateTheme();
    }),
  );
  updateTheme();
  function updateMotion() {
    paused = userPaused || reduced.matches;
    root.classList.toggle("motion-paused", paused);
    document.querySelectorAll("[data-motion-toggle]").forEach((button) => {
      button.disabled = reduced.matches;
      button.textContent = reduced.matches
        ? "Reduced motion"
        : paused
          ? "Resume motion"
          : "Pause motion";
      button.setAttribute("aria-pressed", String(paused));
    });
  }
  document.querySelectorAll("[data-motion-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      userPaused = !userPaused;
      try {
        localStorage.setItem("acme-preview-paused", String(userPaused));
      } catch (_) {}
      updateMotion();
    }),
  );
  reduced.addEventListener("change", updateMotion);
  updateMotion();

  const header = document.querySelector(".site-header");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const triggers = [...document.querySelectorAll(".nav-trigger")];
  const drawer = document.querySelector("#mobile-drawer");
  const menuButton = document.querySelector(".menu-button");
  const shade = document.querySelector(".nav-shade");
  let activeTrigger = null;
  function closeDropdown(restore = false) {
    document.querySelectorAll(".nav-dropdown").forEach((menu) => {
      menu.hidden = true;
    });
    triggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    if (restore && activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  }
  function positionDropdown() {
    if (!activeTrigger) return;
    const menu = document.getElementById(
      activeTrigger.getAttribute("aria-controls"),
    );
    const rect = activeTrigger.getBoundingClientRect();
    const width = menu.getBoundingClientRect().width;
    menu.style.left =
      Math.max(16, Math.min(rect.left - 16, innerWidth - width - 16)) + "px";
    menu.style.top = header.getBoundingClientRect().bottom - 4 + "px";
  }
  triggers.forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      closeDropdown();
      if (opening) {
        activeTrigger = button;
        document.getElementById(button.getAttribute("aria-controls")).hidden =
          false;
        button.setAttribute("aria-expanded", "true");
        positionDropdown();
      }
    }),
  );
  function closeDrawer(restore = true) {
    if (!drawer) return;
    drawer.hidden = true;
    shade.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("locked");
    main.inert = false;
    header.inert = false;
    if (footer) footer.inert = false;
    if (restore) menuButton.focus();
  }
  menuButton?.addEventListener("click", () => {
    closeDropdown();
    drawer.hidden = false;
    shade.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("locked");
    main.inert = true;
    header.inert = true;
    if (footer) footer.inert = true;
    drawer.querySelector(".drawer-close").focus();
  });
  drawer
    ?.querySelector(".drawer-close")
    .addEventListener("click", () => closeDrawer());
  shade?.addEventListener("click", () => closeDrawer());
  document
    .querySelectorAll(".nav-dropdown a,.mobile-drawer a")
    .forEach((link) =>
      link.addEventListener("click", () => {
        closeDropdown();
        if (drawer && !drawer.hidden) closeDrawer(false);
      }),
    );
  document.addEventListener("click", (event) => {
    if (activeTrigger && !header.contains(event.target)) closeDropdown();
  });
  document.addEventListener("focusin", (event) => {
    if (activeTrigger && !header.contains(event.target)) closeDropdown();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (drawer && !drawer.hidden) closeDrawer();
      else closeDropdown(true);
    }
    if (event.key !== "Tab" || !drawer || drawer.hidden) return;
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
    if (innerWidth > 899 && drawer && !drawer.hidden) closeDrawer(false);
    if (innerWidth <= 899) closeDropdown();
    else positionDropdown();
  });
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Native dialogs preserve Escape dismissal and keyboard focus handling.
  let dialogOpener = null;
  function openDialog(dialog, opener) {
    if (!dialog) return;
    closeDropdown();
    if (drawer && !drawer.hidden) closeDrawer(false);
    dialogOpener = opener;
    dialog.showModal();
    document.body.classList.add("locked");
  }
  document.querySelectorAll("[data-contact]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog(document.querySelector("#contact"), link);
    }),
  );
  document
    .querySelector("[data-open-tour]")
    ?.addEventListener("click", (event) =>
      openDialog(document.querySelector("#tour"), event.currentTarget),
    );
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog
      .querySelectorAll("[data-close]")
      .forEach((button) =>
        button.addEventListener("click", () => dialog.close()),
      );
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("locked");
      if (dialogOpener?.getClientRects().length) dialogOpener.focus();
      else if (menuButton?.getClientRects().length) menuButton.focus();
    });
  });
  const tour = [
    [
      "1. Bring your information together",
      "Choose the references that matter to your project. This sample uses pre-made dashboard imagery.",
    ],
    [
      "2. Give the work a clear direction",
      "Define the question and review the sample analysis. No data is uploaded, processed, or sent to an AI service.",
    ],
    [
      "3. Review a useful next step",
      "Inspect the result and decide what should happen next. The demonstration keeps the final decision with you.",
    ],
  ];
  document.querySelectorAll("[data-tour-step]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-tour-step]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const content = tour[Number(button.dataset.tourStep)];
      document.querySelector("[data-tour-title]").textContent = content[0];
      document.querySelector("[data-tour-copy]").textContent = content[1];
    }),
  );

  document.querySelectorAll("form[data-local-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector('[role="status"]');
      status.hidden = false;
      status.textContent =
        "Demo complete. Nothing was sent or saved, and no account or subscription was created.";
      // A demonstration never needs to retain a password after validation.
      form.querySelectorAll('input[type="password"]').forEach((field) => {
        field.value = "";
      });
    }),
  );
  document.querySelectorAll("[data-oauth]").forEach((button) =>
    button.addEventListener("click", () => {
      const status = button.closest("form").querySelector('[role="status"]');
      status.hidden = false;
      status.textContent =
        button.dataset.oauth +
        " sign-in is a local preview. No account connection or authentication request was made.";
    }),
  );
  document.querySelector("[data-reset]")?.addEventListener("click", (event) => {
    const status = event.currentTarget
      .closest("form")
      .querySelector('[role="status"]');
    status.hidden = false;
    status.textContent =
      "Password reset is a local demonstration. No reset email was sent and no credentials were changed.";
  });
  const plan = new URLSearchParams(location.search).get("plan");
  if (
    ["basic", "pro", "enterprise"].includes(plan) &&
    document.querySelector("[data-signup-copy]")
  ) {
    document.querySelector("[data-signup-copy]").textContent =
      "Explore the " +
      plan.toUpperCase() +
      " plan in this local demonstration.";
  }

  const stepDescriptions = [
    ["Step 1 / Import", "Start with the information you already have."],
    [
      "Step 2 / Analyze",
      "Organize the context around a clear, useful question.",
    ],
    [
      "Step 3 / Review",
      "Look at the result and choose the next step together.",
    ],
  ];
  const steps = [...document.querySelectorAll("[data-step]")];
  function chooseStep(index) {
    steps.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    document.querySelector("[data-step-tag]").textContent =
      stepDescriptions[index][0];
    document.querySelector("[data-step-caption]").textContent =
      stepDescriptions[index][1];
    document.querySelector("#workflow-panel img").alt =
      stepDescriptions[index][1];
  }
  steps.forEach((button, index) =>
    button.addEventListener("click", () => chooseStep(index)),
  );
  const featureDescriptions = [
    "AI-Powered Dashboard — a shared view of the information that matters.",
    "Natural Language Processing — ask a clear question in everyday language.",
    "Predictive Analytics — explore patterns and possible next steps.",
    "Automated Reporting — bring the findings into a shareable format.",
  ];
  const features = [...document.querySelectorAll("[data-feature]")];
  function chooseFeature(index, focus = false) {
    features.forEach((button, i) => {
      button.setAttribute("aria-selected", String(index === i));
      button.tabIndex = index === i ? 0 : -1;
    });
    document
      .querySelector("#feature-panel")
      .setAttribute("aria-labelledby", features[index].id);
    document.querySelector("[data-feature-caption]").textContent =
      featureDescriptions[index];
    document.querySelector("#feature-panel img").alt =
      featureDescriptions[index];
    if (focus) features[index].focus();
  }
  features.forEach((button, index) => {
    button.addEventListener("click", () => chooseFeature(index));
    button.addEventListener("keydown", (event) => {
      const move = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (move) {
        event.preventDefault();
        chooseFeature((index + move + features.length) % features.length, true);
      }
      if (event.key === "Home") {
        event.preventDefault();
        chooseFeature(0, true);
      }
      if (event.key === "End") {
        event.preventDefault();
        chooseFeature(features.length - 1, true);
      }
    });
  });

  const highlightStories = [
    {
      logo: "google",
      name: "Leslie Alexander",
      role: "Product designer",
      quote:
        "Our team used to spend the morning stitching together files and status reports. Now the useful context has a shared home. We can move from a question to a considered next step without rebuilding the same picture every day. The work feels calmer, and our conversations are about decisions instead of finding the right document.",
    },
    {
      logo: "microsoft",
      name: "Jordan Lee",
      role: "Operations lead",
      quote:
        "The most useful change has been the handoff. A colleague can open the workspace and understand what we know, what is still uncertain, and where we need a decision. We spend less time explaining the background and more time improving the result. That small shift has made the whole process feel more connected.",
    },
    {
      logo: "amazon",
      name: "Morgan Chen",
      role: "Product manager",
      quote:
        "We started with one recurring report and a clear question. Having the references, the analysis, and the review in one place made it much easier to see what belonged in the final summary. The team kept its judgment, while the repetitive parts of preparing the conversation became simpler and easier to follow.",
    },
    {
      logo: "netflix",
      name: "Alex Rivera",
      role: "Engineering lead",
      quote:
        "A useful workflow does not need to be complicated. We wanted a shared starting point, a visible next step, and a result that someone else could inspect. This concept brings those pieces together in a way that feels familiar. The interface leaves room for the work instead of turning every task into a new system.",
    },
    {
      logo: "youtube",
      name: "Sam Parker",
      role: "Creative operations",
      quote:
        "Our projects change direction as we learn. Keeping the current brief and the supporting material together gives everyone a better place to return to. We can ask a follow-up question without losing the original context. That makes it easier to move from a first impression to a direction the whole team understands.",
    },
    {
      logo: "instagram",
      name: "Taylor Williams",
      role: "Customer experience",
      quote:
        "The quality of a summary depends on whether the next person can use it. We like being able to keep the evidence close, explain what changed, and leave a clear action at the end. It gives our conversations a more useful starting point and helps us notice where the process could be better.",
    },
    {
      logo: "uber",
      name: "Casey Morgan",
      role: "Team coordinator",
      quote:
        "Bringing a team together often means connecting a lot of small details. The workspace makes those details easier to find without asking everyone to change the way they think. A clear overview, a few useful questions, and an understandable result are a thoughtful foundation for the next piece of work.",
    },
  ];
  let highlightIndex = 0;
  function updateHighlight() {
    const story = highlightStories[highlightIndex];
    document.querySelector("[data-highlight-quote]").textContent = story.quote;
    document.querySelector("[data-highlight-name]").textContent = story.name;
    document.querySelector("[data-highlight-role]").textContent =
      story.role + " · Illustrative story";
    const logo = document.querySelector("[data-highlight-logo]");
    logo.src = "assets/logo-" + story.logo + ".svg";
    logo.alt = story.logo + " reference logo";
    document.querySelector("[data-highlight-prev]").disabled =
      highlightIndex === 0;
    document.querySelector("[data-highlight-next]").disabled =
      highlightIndex === highlightStories.length - 1;
  }
  document
    .querySelector("[data-highlight-prev]")
    ?.addEventListener("click", () => {
      if (highlightIndex > 0) {
        highlightIndex--;
        updateHighlight();
      }
    });
  document
    .querySelector("[data-highlight-next]")
    ?.addEventListener("click", () => {
      if (highlightIndex < highlightStories.length - 1) {
        highlightIndex++;
        updateHighlight();
      }
    });

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Engineering lead",
      portrait: "men-91",
      quote:
        "A clearer starting point makes a difference. We can keep the brief and the useful references together, so the first conversation is about the work instead of where to find it.",
    },
    {
      name: "Samantha Lee",
      role: "Marketing director",
      portrait: "women-12",
      quote:
        "The important context stays close to the project. We can see the proposed direction and give the team useful feedback before an idea becomes difficult to change.",
    },
    {
      name: "Raj Patel",
      role: "Startup founder",
      portrait: "men-45",
      quote:
        "A small team needs a practical way to move forward. One question, a focused set of references, and a result we can review together is a good beginning.",
    },
    {
      name: "Emily Chen",
      role: "Product manager",
      portrait: "women-83",
      quote:
        "The best part is continuity. The next person can follow the reasoning behind a decision and pick up the thread without needing another long introduction.",
    },
    {
      name: "Michael Brown",
      role: "Data scientist",
      portrait: "men-1",
      quote:
        "A useful result should be easy to inspect. Keeping the evidence with the summary helps us ask better follow-up questions and notice what still needs work.",
    },
    {
      name: "Linda Wu",
      role: "Operations lead",
      portrait: "women-5",
      quote:
        "Clear ownership and a visible next step make recurring work easier to coordinate. The process feels lighter when the whole team can see the same picture.",
    },
    {
      name: "Carlos Gomez",
      role: "Research lead",
      portrait: "men-14",
      quote:
        "We want tools that support our judgment. A shared workspace can make a first pass more useful while leaving the important decisions with the people doing the work.",
    },
    {
      name: "Aisha Khan",
      role: "Brand strategist",
      portrait: "women-56",
      quote:
        "Good feedback starts with a shared understanding. Connecting the brief to the result makes our creative and technical conversations much more specific.",
    },
    {
      name: "Tom Chen",
      role: "IT director",
      portrait: "men-18",
      quote:
        "A project boundary should be understandable. We like a workspace that makes it clear which references belong to the task and what a finished outcome should look like.",
    },
    {
      name: "Sofia Patel",
      role: "Learning designer",
      portrait: "women-73",
      quote:
        "Our team learns by looking at examples. A clear draft gives us something to question, explain, and improve together, without starting from an empty page.",
    },
    {
      name: "Jake Morrison",
      role: "Platform engineer",
      portrait: "men-25",
      quote:
        "Useful automation leaves a trace that people can follow. An organized summary and a clear review step make the next action easier to choose.",
    },
    {
      name: "Nadia Ali",
      role: "Creative director",
      portrait: "women-78",
      quote:
        "The context of a design should travel with it. Keeping references near the implementation helps everyone understand the intention behind the details.",
    },
    {
      name: "Omar Farooq",
      role: "Business founder",
      portrait: "men-54",
      quote:
        "Starting with one focused workflow lets us see what improves. We can add structure when there is a reason, instead of asking the team to learn everything at once.",
    },
  ];
  document.querySelectorAll("[data-quotes]").forEach((track) => {
    const column = Number(track.dataset.quotes);
    const items = testimonials.filter((_, index) => index % 5 === column);
    for (let repeat = 0; repeat < 2; repeat++) {
      items.forEach((story) => {
        const card = document.createElement("article");
        card.className = "quote-card";
        if (repeat) card.setAttribute("aria-hidden", "true");
        const quote = document.createElement("p");
        quote.textContent = story.quote;
        const stars = document.createElement("div");
        stars.className = "stars";
        stars.textContent = "★★★★★";
        stars.setAttribute("aria-label", "Five-star illustrative rating");
        const person = document.createElement("div");
        person.className = "quote-person";
        const image = document.createElement("img");
        image.src = "assets/portrait-" + story.portrait + ".jpg";
        image.width = 36;
        image.height = 36;
        image.alt = story.name;
        image.decoding = "async";
        const info = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = story.name;
        const role = document.createElement("span");
        role.textContent = story.role;
        info.append(name, role);
        person.append(image, info);
        card.append(quote, stars, person);
        track.append(card);
      });
    }
  });

  const billing = document.querySelector(".billing-switch");
  billing?.addEventListener("click", () => {
    const yearly = billing.getAttribute("aria-checked") !== "true";
    billing.setAttribute("aria-checked", String(yearly));
    document.querySelectorAll("[data-monthly]").forEach((price) => {
      price.textContent =
        "$" + (yearly ? price.dataset.yearly : price.dataset.monthly);
    });
    document.querySelectorAll("[data-billing-note]").forEach((note) => {
      note.textContent = yearly ? "billed annually" : "billed monthly";
    });
    document.querySelector("[data-price-status]").textContent = yearly
      ? "Yearly billing selected. Monthly equivalents: Basic 16 dollars, Pro 40 dollars, Enterprise 82 dollars."
      : "Monthly billing selected. Basic 19 dollars, Pro 49 dollars, Enterprise 99 dollars.";
  });
  document.querySelectorAll(".faq-question").forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-question").forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        document.getElementById(item.getAttribute("aria-controls")).hidden =
          true;
      });
      button.setAttribute("aria-expanded", String(opening));
      document.getElementById(button.getAttribute("aria-controls")).hidden =
        !opening;
    }),
  );

  if ("IntersectionObserver" in window) {
    if (!paused) root.classList.add("motion-enabled");
    const reveals = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            reveals.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => reveals.observe(el));
    const scenes = new IntersectionObserver((entries) =>
      entries.forEach((entry) =>
        entry.target.classList.toggle("offscreen", !entry.isIntersecting),
      ),
    );
    document
      .querySelectorAll("#logos,#testimonials")
      .forEach((el) => scenes.observe(el));
  }
  document.addEventListener("visibilitychange", () => {
    document
      .querySelectorAll(".logo-track,.testimonial-track")
      .forEach((track) => {
        track.style.animationPlayState = document.hidden ? "paused" : "";
      });
  });
})();
