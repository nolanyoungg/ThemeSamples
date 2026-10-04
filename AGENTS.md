# Theme Samples

An independent static website sample gallery. Keep it simple and manually maintained.

## Repository basics

- Keep root deliverables to `AGENTS.md`, `.gitignore`, `README.md`, and `docs/`.
- Keep the gallery in `docs/index.html` and numbered samples in `docs/Preview-Themes-Github/`.
- Use plain HTML, CSS, JavaScript, and local static assets. Do not add dependencies, package files, build tooling, generators, PHP, theme ZIPs, or custom deployment workflows.
- Use relative URLs that work locally and under a project-site subdirectory. Keep required assets inside `docs/`.
- Preserve existing sample designs, content, filenames, and interactions unless a requested change calls for editing them.
- Keep code readable and gallery style variables together at the top. Do not push or change hosting settings unless requested.

## Adding a new sample

- Follow the manual process in `README.md`. Check existing numbers before choosing the next folder name; do not invent missing samples.
- Include all pages and their required assets, then manually add the gallery card and update counts.
- Follow the existing gallery conventions: one Home tab, working page links, and Desktop, Tablet, and Mobile controls.
- Keep new forms as clearly labeled local demonstrations; do not depend on server endpoints.
- Build complete, elegant websites with developed interior pages, business-specific content, restrained typography, and appropriate imagery. Give each preview its own visual character and avoid sparse mockups or repeated generic layouts.

## Header navigation preference

Every new preview should include a developed, interactive header with click-to-open dropdown navigation. Adapt its colors, typography, imagery, and menu content to the individual design.

- Use a sticky header with branding on the left, clearly spaced main navigation, and a prominent contact or equivalent action on the right. Keep it consistent across pages, with a subtle border or shadow when scrolling.
- Open wide, centered dropdown panels immediately beneath the header. Give them a solid background, generous padding, a fine border, softly rounded lower corners, and a restrained shadow. A dimmed backdrop separates the open navigation from the page.
- For grouped content, use a narrow category column on the left, separated by a vertical divider from a larger content area. Hovering, focusing, or tapping a category updates the adjacent image, heading, short description, supporting details, and destination link. Clearly highlight the active category.
- Use image-led cards for editorial dropdowns, with consistent image proportions, category labels, titles, and short summaries. Keep ordinary destinations as direct links where a dropdown adds no value.
- Keep one dropdown open at a time. Clicking its trigger again, clicking outside/on the backdrop, or pressing Escape closes it.
- On smaller screens, replace the desktop navigation with a right-side drawer containing branding, an obvious close button, expandable navigation groups, and a prominent action. Keep it within the viewport, allow internal scrolling, and prevent the page behind it from scrolling while open. Ensure it works inside the gallery iframe.
- Use real buttons for toggles, links for destinations, accurate `aria-expanded` and `aria-controls`, visible focus styles, and keyboard/touch access. Return focus appropriately when closing.

## Check before delivery

Check page links, assets, gallery counts, and preview switching. Inspect new samples at desktop, tablet, and mobile widths, including dropdowns, category switching, drawer navigation, keyboard dismissal, and overflow. Report any browser checks that could not be completed. Keep temporary checks and reports out of the repository.
