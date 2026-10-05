/* Local task playback, conceptual SDK controls, and a pixel-rendered landscape. */
(() => {
  const tasks = {
    research: {
      description:
        "Research a new idea. Turn the useful findings into a clear, considered brief.",
      steps: [
        "Reading the project brief and scoped references…",
        "Comparing findings and marking open questions…",
        "Drafting a brief with linked source notes…",
      ],
      result:
        "Research brief ready. 12 sample references reviewed, 3 themes identified, and 2 open questions noted. Demo artifact: findings.md.",
    },
    release: {
      description:
        "Review the release notes. Bring the changes, checks, and open questions together.",
      steps: [
        "Reading the sample change log and release brief…",
        "Checking the review list and outstanding items…",
        "Preparing a release summary for a person to review…",
      ],
      result:
        "Release summary ready for review. 8 sample changes grouped, 2 review items flagged, and a draft note prepared. No release was published.",
    },
    operations: {
      description:
        "Review the weekly operations notes. Make the next actions clear and useful.",
      steps: [
        "Opening the scoped sample operations notes…",
        "Grouping decisions and identifying dependencies…",
        "Preparing a concise action brief…",
      ],
      result:
        "Operations brief ready. 5 sample actions organized, owners outlined, and 1 dependency highlighted. No tasks were created externally.",
    },
  };
  const selector = document.querySelector("[data-task-select]");
  const run = document.querySelector("[data-run]");
  let timers = [];
  if (selector && run) {
    function reset() {
      timers.forEach(clearTimeout);
      timers = [];
      document.querySelector("[data-task-description]").textContent =
        tasks[selector.value].description;
      document
        .querySelectorAll(".run-track span")
        .forEach((item) => item.classList.remove("complete"));
      document.querySelector("[data-run-status]").textContent =
        "Ready for a local playback. No external tools are connected.";
      document.querySelector("[data-run-output]").hidden = true;
      document.querySelector(".landscape").classList.remove("demo-complete");
      run.disabled = false;
      run.textContent = "Run task ↑";
    }
    selector.addEventListener("change", reset);
    run.addEventListener("click", () => {
      reset();
      run.disabled = true;
      selector.disabled = true;
      run.textContent = "Running…";
      const task = tasks[selector.value];
      const status = document.querySelector("[data-run-status]");
      const stepDelay = document.documentElement.classList.contains(
        "motion-paused",
      )
        ? 40
        : 750;
      task.steps.forEach((step, index) =>
        timers.push(
          setTimeout(() => {
            status.textContent = index + 1 + "/3 · " + step;
            document
              .querySelectorAll(".run-track span")
              [index].classList.add("complete");
          }, index * stepDelay),
        ),
      );
      timers.push(
        setTimeout(() => {
          const output = document.querySelector("[data-run-output]");
          output.textContent = task.result;
          output.hidden = false;
          document.querySelector(".landscape").classList.add("demo-complete");
          status.textContent =
            "Complete · Local demonstration finished. Your result is below.";
          run.disabled = false;
          selector.disabled = false;
          run.textContent = "Replay ↻";
        }, 3 * stepDelay),
      );
    });
    window.addEventListener("pagehide", () => timers.forEach(clearTimeout));
  }
  const codeExamples = {
    typescript:
      'const workspace = await waypoint.workspace({\n  name: "a-good-start",\n  context: ["brief.md", "references/"],\n});\n\nconst run = await workspace.run({\n  task: "Turn the research into a clear brief.",\n  approval: "before_write",\n});',
    python:
      'workspace = waypoint.workspace(\n    name="a-good-start",\n    context=["brief.md", "references/"],\n)\n\nrun = workspace.run(\n    task="Turn the research into a clear brief.",\n    approval="before_write",\n)',
  };
  document.querySelectorAll("[data-language]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-language]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      document.querySelector("[data-code]").textContent =
        codeExamples[button.dataset.language];
      document.querySelector("[data-copy-status]").textContent =
        "Illustrative SDK · Not an installable package";
    }),
  );
  document.querySelector("[data-copy]")?.addEventListener("click", async () => {
    const status = document.querySelector("[data-copy-status]");
    try {
      await navigator.clipboard.writeText(
        document.querySelector("[data-code]").textContent,
      );
      status.textContent =
        "Example copied. This is a fictional API for design reference.";
    } catch (_) {
      status.textContent =
        "Clipboard is unavailable here. Select the example text and copy it manually.";
    }
  });
  const contexts = {
    research: [
      "research-workspace",
      "A useful brief, with its sources.",
      "Keep references, evidence, and open questions in view. Let the next run start with what you already know.",
      ["brief.md", "sources/", "findings.md", "open-questions.md"],
    ],
    engineering: [
      "release-workspace",
      "A clear path to a considered release.",
      "Keep the change list, review notes, and release criteria together. Make readiness an inspectable decision.",
      ["release-brief.md", "changes/", "review-notes.md", "checklist.md"],
    ],
    operations: [
      "operations-workspace",
      "A working picture of what comes next.",
      "Connect recurring work to the decisions and dependencies that shape it. Leave the next person a useful starting point.",
      ["weekly-brief.md", "processes/", "decisions.md", "next-actions.md"],
    ],
  };
  document.querySelectorAll("[data-context]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-context]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const data = contexts[button.dataset.context];
      document.querySelector("[data-context-name]").textContent =
        "▧ " + data[0];
      document.querySelector("[data-context-title]").textContent = data[1];
      document.querySelector("[data-context-copy]").textContent = data[2];
      const files = document.querySelector("[data-context-files]");
      files.replaceChildren();
      data[3].forEach((file) => {
        const row = document.createElement("div");
        row.textContent = file;
        files.append(row);
      });
    }),
  );
  document.querySelectorAll("[data-permission]").forEach((input) =>
    input.addEventListener("change", () => {
      document.querySelector("[data-permission-status]").textContent =
        [...document.querySelectorAll("[data-permission]")]
          .map(
            (item) => item.dataset.permission + (item.checked ? " on" : " off"),
          )
          .join(" · ") + ". Demonstration controls only.";
    }),
  );

  const canvas = document.querySelector("[data-landscape]");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.hidden = true;
    return;
  }
  const source = document.createElement("canvas"),
    sourceContext = source.getContext("2d");
  const image = new Image();
  let ready = false,
    visible = true,
    paused = document.documentElement.classList.contains("motion-paused"),
    frame = 0,
    last = 0,
    time = 0,
    pointer = null;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.min(620, Math.round(rect.width / 2));
    canvas.height = Math.round((canvas.width * rect.height) / rect.width);
    source.width = canvas.width;
    source.height = canvas.height;
    if (ready) {
      const scale = Math.max(
        source.width / image.width,
        source.height / image.height,
      );
      const width = image.width * scale,
        height = image.height * scale;
      sourceContext.drawImage(
        image,
        (source.width - width) / 2,
        (source.height - height) / 2,
        width,
        height,
      );
      draw();
    }
  }
  function draw() {
    if (!ready) return;
    const w = canvas.width,
      h = canvas.height;
    context.drawImage(source, 0, 0);
    const water = Math.floor(h * 0.65);
    for (let y = water; y < h; y += 2) {
      const strength = (y - water) / (h - water);
      const offset = Math.sin(y * 0.22 + time * 0.0013) * strength * 1.5;
      context.drawImage(source, 0, y, w, 2, offset, y, w, 2);
    }
    if (pointer && !paused) {
      context.strokeStyle = "#e1eee055";
      context.lineWidth = 0.8;
      const radius = 7 + Math.sin(time * 0.002) * 3;
      context.beginPath();
      context.ellipse(
        pointer[0] * w,
        pointer[1] * h,
        radius,
        radius * 0.35,
        0,
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
    context.fillStyle = "#e8f4ef22";
    for (let i = 0; i < 14; i++) {
      const x = (i * 61 + time * 0.005) % w,
        y = 30 + Math.sin(i * 1.9 + time * 0.0003) * 25;
      context.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }
  }
  function tick(now) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (now - last > 65) {
      time += Math.min(now - last, 90);
      last = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = performance.now();
    if (!paused && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
    else draw();
  }
  image.onload = () => {
    ready = true;
    resize();
    restart();
  };
  image.onerror = () => {
    canvas.hidden = true;
  };
  image.src = "assets/alpine-workspace.jpg";
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    restart();
  }).observe(canvas);
  canvas.parentElement.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = [
      (event.clientX - rect.left) / rect.width,
      (event.clientY - rect.top) / rect.height,
    ];
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    pointer = null;
  });
  document.addEventListener("motionchange", (event) => {
    paused = event.detail.paused;
    restart();
  });
  document.addEventListener("visibilitychange", restart);
})();
