# Theme Samples

An independent static website sample gallery. Open [the gallery](docs/index.html) to browse designs, search by name, switch pages, and try desktop or mobile previews. You can also open `docs/index.html` directly in a browser.

## Files

- `docs/index.html` — the manually maintained gallery.
- `docs/Preview-Themes-Github/` — sample folders with their HTML pages and static assets.
- `.gitignore` — local, editor, and OS clutter exclusions.

There are 13 samples: **000–006, 011, and 013–017**. Numbers **007–010 and 012** are absent. Original folder and HTML filenames are retained.

## Add a sample manually

1. Add the next sample folder under `docs/Preview-Themes-Github/`, such as `018_nolan_young_theme_<description>/`.
2. Include its HTML pages and required CSS, JavaScript, images, icons, SVGs, and other static assets.
3. Add a corresponding entry/link to `docs/index.html` using the existing gallery conventions. Copy a card and update its unique ID, search text, title, page links, iframe name/target/source, and full-preview link. Update the collection and results counts.
4. Check links and layout before uploading the changes, including search, page switching, desktop/mobile previews, and sample interactions.

Keep URLs relative and required assets inside `docs/` so the gallery works locally and beneath a website subdirectory. No installation or build step is needed.

## Static previews

Sample content and interactions are preserved. Forms are demonstrations, not a delivery service. Some older samples retain form actions pointing to an unavailable `admin-post.php` endpoint; submitting those forms will fail on static hosting. Newer samples show local demo feedback. External attribution, email, and telephone links are retained.

## Optional hosting

Any static host can serve these files. GitHub Pages can optionally serve a selected branch's `/docs` folder: in repository **Settings → Pages**, choose **Deploy from a branch**, the desired branch, and **/docs**. No custom workflow is needed. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Hosting is optional and is not configured by these files.
