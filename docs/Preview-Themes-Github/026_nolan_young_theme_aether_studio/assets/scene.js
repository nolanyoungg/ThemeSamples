(() => {
  const prompt = document.querySelector("[name=prompt]");
  document.querySelectorAll("[data-prompt]").forEach((button) =>
    button.addEventListener("click", () => {
      prompt.value = button.dataset.prompt;
      document
        .querySelectorAll("[data-prompt]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      prompt.focus();
    }),
  );
  const form = document.querySelector("[data-prompt-form]");
  if (form) {
    const incoming = new URLSearchParams(location.hash.slice(1)).get("idea");
    prompt.value = incoming
      ? incoming.slice(0, 280)
      : document.querySelector("[data-prompt]").dataset.prompt;
    const objectDirection = /chrome|object|sphere|sculpt|glass|silver/i.test(
      prompt.value,
    );
    document
      .querySelectorAll("[data-prompt]")
      .forEach((button, index) =>
        button.setAttribute(
          "aria-pressed",
          String(index === (objectDirection ? 1 : 0)),
        ),
      );
    function showStudy() {
      const objectStudy = /chrome|object|sphere|sculpt|glass|silver/i.test(
        prompt.value,
      );
      const image = document.querySelector("[data-result-image]");
      image.src = objectStudy
        ? "assets/chrome-study.jpg"
        : "assets/silk-world.jpg";
      image.alt = objectStudy
        ? "Pre-made chrome and violet glass study"
        : "Pre-made lavender landscape study";
      document.querySelector("[data-result-title]").textContent = objectStudy
        ? "A study in material."
        : "A world worth exploring.";
      document.querySelector("[data-result-copy]").textContent =
        "Your direction: “" +
        prompt.value +
        "”. This pre-made artwork is a starting point for the concept, not a newly generated image.";
    }
    if (incoming && document.querySelector("[data-result-image]")) showStudy();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!prompt.value.trim()) {
        prompt.setCustomValidity("Add a few words to begin.");
        prompt.reportValidity();
        return;
      }
      prompt.setCustomValidity("");
      if (document.querySelector("[data-result-image]")) showStudy();
      else
        location.href =
          "studio.html#idea=" + encodeURIComponent(prompt.value.slice(0, 280));
    });
    prompt.addEventListener("input", () => prompt.setCustomValidity(""));
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
      document.querySelector("[data-filter-status]").textContent =
        count + " studies";
    }),
  );
})();
