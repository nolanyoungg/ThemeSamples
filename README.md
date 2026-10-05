# Theme Samples

An independent static website sample gallery. Open [the gallery](docs/index.html) to browse designs, search by name, switch pages, and try desktop, tablet, or mobile previews. You can also open `docs/index.html` directly in a browser.

## Files

- `docs/index.html` — the manually maintained gallery.
- `docs/Preview-Themes-Github/` — sample folders with their HTML pages and static assets.
- `.gitignore` — local, editor, and OS clutter exclusions.

There are 27 samples: **000–006, 011, and 013–031**. Numbers **007–010 and 012** are absent. Original folder and HTML filenames are retained.

The latest sample is **Nocturne Observatory (031)**, an original seven-page design for a fictional mountain observatory and museum. It includes a cinematic Milky Way hero, three real photographs sourced from ESO’s official archive under CC BY 4.0, an interactive canvas sky study, category-switching dropdowns, an editorial menu, a mobile drawer, experience filters, an exhibition chapter selector and orbit control, and a local visit planner with admission calculations and a step-free itinerary option. Pages cover Home, Experiences, Exhibition, Observatory, Visit, Field Notes, and a complete article. Motion respects reduced-motion settings and can be paused; canvas animation stops off screen and in hidden tabs. The venue, prices, schedule, and sky are illustrative. Nothing is booked, paid, submitted, or stored by the visit planner. Every photograph has a visible, linked credit and license next to it, including in dropdowns. Image source pages, original download URLs, full credits, license terms, and resizing details are recorded in `docs/Preview-Themes-Github/031_nolan_young_theme_nocturne_observatory/assets/sources.txt`; local font licensing is in `assets/font-license.txt`. Sample 031 contains no AI-generated raster images.

The preceding sample is **Acme AI (030)**, based on the [Magic UI SaaS template](https://magicui.design/docs/templates/saas) and its [live reference](https://saas-magicui.vercel.app/). It includes five static pages: the complete landing page, blog index, article, login, and signup. The light design retains the reference’s red accents, local Inter fonts, dashboard imagery, solution-card layout, selectors, testimonial carousel, pricing switch, and FAQ. Supporting copy is adapted, and the video area opens a local guided walkthrough. Authentication, password reset, social sign-in, and contact forms are explicitly local demonstrations with no backend or external submission. Theme and motion controls are in the footer. Asset provenance and font licensing are stored in the sample’s `assets/sources.txt` and `assets/inter-license.txt`.

The preceding sample is **NolanCodes (029)**, a single-page static reconstruction of the visual layout in the [CodeForge reference](https://codeforge-magicui.vercel.app/). It includes the reference-style ruled grid, cyan hero glow, locally hosted Geist fonts and showcase photographs, product dropdown, full-screen mobile navigation, light/dark themes, rotating image tabs, code and integration demonstrations, animated network, dotted developer map, and testimonials, monthly/annual billing, and accordion FAQ. The branding and supporting copy are adapted for NolanCodes. Animations are independently implemented in plain JavaScript and CSS; the paid template source and framework bundles are not included. Placeholder actions lead to clearly labeled local demonstrations. Font licensing and image provenance are in the sample’s `assets/geist-license.txt` and `assets/sources.txt`.

The previous additions are **Aether Studio (026)**, **Chroma (027)**, and **Waypoint (028)**. Each includes six complete pages, grouped and editorial dropdown navigation, a mobile drawer, a billing switch, a local contact demonstration, and a motion control. They are independent static interpretations of the visual directions in React Bits Pro's [AI SaaS](https://pro.reactbits.dev/docs/templates/ai-saas-landing), [Shader](https://pro.reactbits.dev/docs/templates/shader-template), and [Agentframe](https://pro.reactbits.dev/docs/templates/agentframe-template) references, with original branding, copy, artwork, and implementation. No React Bits source code or paid assets are included.

- **Aether Studio:** a violet creative platform with a prompt playground, filterable artwork collection, pricing, and a complete journal essay. Its playground pairs a brief with one of two pre-made studies; it does not generate images or call an AI service.
- **Chroma:** an immersive product platform with an original WebGL fluid-color shader, three live palettes, interactive workflow stages, and team-specific solution views. A CSS background remains visible when WebGL is unavailable.
- **Waypoint:** a cobalt and paper agent platform with a pixel-rendered alpine landscape, animated water, three scripted task scenarios, workspace context and permission demonstrations, and TypeScript/Python example switching with clipboard feedback. The SDK is fictional; there is no package or connected agent service.

Animations respect reduced-motion preferences and can be paused with the footer control. Canvas animations also pause when their scene is off screen or the document is hidden. Required assets are local. Contact forms do not send or persist entered details. Aether passes a submitted prompt to its studio page through the URL fragment, which is not sent to the server; the motion preference is stored in browser local storage when available.

## Add a sample manually

1. Add the next sample folder under `docs/Preview-Themes-Github/`, such as `032_nolan_young_theme_<description>/`.
2. Include its HTML pages and required CSS, JavaScript, images, icons, SVGs, and other static assets. For new previews, source photographs online from providers with explicit reuse permissions; do not generate images. Check each selected image's license, keep required visible credits, and record the source, license, and any modifications alongside the assets.
3. Add a corresponding entry/link to `docs/index.html` using the existing gallery conventions. Copy a card and update its unique ID, search text, title, page links, iframe name/target/source, and full-preview link. Update the collection and results counts.
4. Check links and layout before uploading the changes, including search, page switching, desktop/tablet/mobile previews, and sample interactions.

Keep URLs relative and required assets inside `docs/` so the gallery works locally and beneath a website subdirectory. No installation or build step is needed.

## Artwork for samples 026–028

The built-in image generation tool created the three raster assets below specifically for these samples. They are stored as local JPEGs. Chroma's shader and diagram, and Waypoint's topology diagram, are original code-based visuals.

<details>
<summary>Generated asset paths and original prompts</summary>

**`docs/Preview-Themes-Github/026_nolan_young_theme_aether_studio/assets/silk-world.jpg`**

> Use case: stylized-concept. Asset type: immersive hero artwork and creative AI showcase for an elegant website. Create a cinematic panoramic 3D landscape of enormous flowing silk-like dunes made of iridescent pale lavender, cobalt violet and pearlescent silver. Sweeping rippled surfaces, beautifully fine tactile grain, impossibly smooth ridges, a tiny solitary dark human silhouette near lower right for scale. A luminous atmospheric pale lavender sky occupying the upper half, distant arc-shaped pale moon, deep violet shadow valleys at bottom. High-end digital fashion campaign, surreal serene world, exquisite art direction, clean restrained composition. Wide landscape 3:2, no text, no logos, no UI, no borders. Full bleed artwork.

**`docs/Preview-Themes-Github/026_nolan_young_theme_aether_studio/assets/chrome-study.jpg`**

> Use case: stylized-concept. Asset type: art-directed editorial image for a premium creative AI design platform. A sculptural liquid chrome ribbon twisted into an open loop floats above a perfectly still pale lilac reflective plane, with a translucent frosted violet glass sphere nestled in its curl. Macro product photography meets surreal 3D render. Soft luminous lavender and pearl background, one hard sunlight ray, long architectural shadow, silver liquid reflections, tactile subtle grain. Minimal art gallery composition, the full sculpture centered with generous breathing room, arresting beautiful sculptural form. Wide 3:2 composition, no text no border no logo.

**`docs/Preview-Themes-Github/028_nolan_young_theme_waypoint/assets/alpine-workspace.jpg`**

> Use case: photorealistic-natural. Asset type: wide immersive landscape for an AI developer platform website. A majestic untouched alpine valley with dense dark spruce forests on the left and right, distant jagged granite mountains, wisps of low morning cloud, a calm turquoise alpine lake in the foreground reflecting mountains and pale cool sky. A tiny warm ivory observatory cabin with a single orange window sits on the far shoreline on the right. Calm thoughtful exploratory mood, cinematic analog medium-format landscape photograph, pale blue atmospheric haze, muted pine greens, natural realistic detail and fine grain, balanced symmetrical valley perspective that draws the eye toward the far horizon. Composition is very wide, 3:2 landscape, no text, no logos, no people, no border.

</details>

## Static previews

Sample content and interactions are preserved. Forms are demonstrations, not a delivery service. Some older samples retain form actions pointing to an unavailable `admin-post.php` endpoint; submitting those forms will fail on static hosting. Newer samples show local demo feedback. External attribution, email, and telephone links are retained.

## Optional hosting

Any static host can serve these files. GitHub Pages can optionally serve a selected branch's `/docs` folder: in repository **Settings → Pages**, choose **Deploy from a branch**, the desired branch, and **/docs**. No custom workflow is needed. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Hosting is optional and is not configured by these files.
