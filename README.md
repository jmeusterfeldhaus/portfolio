# Portfolio — Senior Performance Designer

A single-page, no-build-step portfolio (plain HTML/CSS/JS) built for GitHub
Pages. Full-bleed video hero, a swipeable "My Process" gallery, scroll
reveals, and a "spec HUD" overlay on project images that mimics a technical
garment tech-pack. Every placeholder image and video is already filled in
with generated stand-ins so you can preview the real layout immediately —
swap them for your own whenever you're ready.

## 1. Files

```
index.html            → all content lives here
style.css              → all visual design (colors, type, layout, animation)
script.js              → scroll reveals, nav behavior, snow canvas, HUD taps
assets/hero/           → hero-reel.mp4 + hero-poster.jpg (video backdrop)
assets/process/        → process-1.jpg … process-5.jpg ("My Process" strip)
assets/projects/       → project-1.jpg … project-3.jpg (Work section)
assets/resume/         → resume.pdf
```

Every file under `assets/` already has a placeholder in it, generated for
this project — an abstract animated gradient for the hero video, and
topographic-line "spec plate" graphics for the process/project images.
Open the site now and it'll look complete; replace files at your own pace.

## 2. Personalize the content (do this first)

Open `index.html` in any text editor and search for `[ EDIT ]` — every
instance marks copy you should replace with your own words. Also do a
find-and-replace for:

- `YOUR NAME` → your actual name (appears in the hero, title tag, and footer)
- `your.email@example.com` → your real email
- `https://linkedin.com/in/yourprofile` → your real LinkedIn URL
- The three `PREVIOUS COMPANY` / `YOUR DEGREE` / `YOUR SCHOOL` lines in the
  Experience timeline

### Add your hero video
The whole landing section is a full-bleed video backdrop with a small
viewfinder-style HUD floating on top (a nod to the danielspatzek.com
reference — a "device" showing a reel, minus the retro CRT). To add yours:

1. Drop a short looping clip (process footage, fabric detail, a runway or
   fit-session clip — anything under ~15s that loops cleanly works best)
   into `assets/hero/` as `hero-reel.mp4`
2. Optionally replace `hero-poster.jpg` with a still frame from your clip
   — it shows for a split second while the video loads
3. Update or delete the small `hud-file` label in `index.html`
   (`PREVIEW REEL — swap at /assets/hero/...`) once your real video is in
4. The `hud-tag-1` / `hud-tag-2` labels are editable spec callouts — change
   them to reference your real fabric/construction details, the same way
   the project HUD dots work further down the page

### Swap "My Process" photos
The process strip scrolls horizontally (drag or swipe) and holds 5 cards.
To swap a photo, replace the file in `assets/process/` keeping the same
filename, or point a card's `<img src>` at a new file. To add or remove a
step, copy/delete a whole `<figure class="process-card">` block in
`index.html` — each one is self-contained (image + step number + title +
one-line description).

### Swap Work / project images
Each project's `<img class="project-img">` points at a file in
`assets/projects/`. Replace the file (same filename) or update the `src`.
The 2–3 glowing HUD dots (`.spec-point`) on each image are positioned with
`--x` / `--y` percentages and their popup text lives in `data-spec="..."`
— move them or edit the copy to describe your real construction details.

### Change the fonts
Open `style.css` and find the **FONT CONTROL PANEL** block near the top
(inside `:root`). There are 3 curated presets — all already loaded, so
switching is instant:

1. Comment out the current "ACTIVE" 3 lines (`--font-display`, `--font-body`, `--font-mono`)
2. Uncomment one of the "Preset 2" / "Preset 3" blocks below it
3. Save and refresh — every heading, paragraph, and label updates automatically

Want a font that isn't one of the 3 presets? Grab it from
[fonts.google.com](https://fonts.google.com), add it to the `<link>` tag
in `index.html` (next to the existing families), then set it as one of
the three `--font-*` variables.

### Swap the résumé
Replace `assets/resume/resume.pdf` with your real résumé, keeping the same
filename — the download buttons already point to it. (If you rename it,
update the two `href="assets/resume/resume.pdf"` links in `index.html`.)

## 3. Preview locally

No build tools needed. Easiest options:
- Open `index.html` directly in a browser, **or**
- From this folder, run `python3 -m http.server 8000` and visit
  `http://localhost:8000` (recommended — some browsers restrict local
  video autoplay when opened as a plain file, and it matches how GitHub
  Pages actually serves the site).

## 4. Publish for free on GitHub Pages

1. Create a new GitHub repository (public), e.g. `portfolio`.
2. Upload all files in this folder to the repo, keeping the same structure
   (`index.html` at the root, `style.css`, `script.js`, `assets/` folder).
   - Easiest way: on the repo page, click **Add file → Upload files**, drag
     everything in, and commit.
3. Go to the repo's **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. Wait ~1 minute, then refresh — GitHub shows your live URL, typically:
   `https://your-username.github.io/portfolio/`

That link is what you share with companies — free, no hosting cost, and it
updates automatically any time you push changes to the repo.

## 5. Notes on the design

- Colors, fonts, and spacing are all controlled by CSS variables at the top
  of `style.css` (`:root { --ink, --flare, --glacier, --volt ... }`) if you
  want to nudge the palette.
- Motion respects `prefers-reduced-motion` automatically.
- The site is responsive down to mobile (hamburger nav under ~860px, the
  process strip becomes a touch-swipe carousel).
- Video file size: the placeholder clip is under 1MB. If your real footage
  is large, compress it (e.g. with HandBrake or `ffmpeg -crf 28`) so the
  hero still loads fast on mobile connections.
