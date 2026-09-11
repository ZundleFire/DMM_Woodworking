# DMM Woodworking — Static Site

Clean, framework-free static website for **DMM Woodworking LLC** (Lancaster, PA).  
Built with plain HTML5, CSS3, and vanilla JS — no build step required.

---

## Project Structure

```
.
├── index.html           # Homepage — served at /
├── about-us/index.html  # About page — served at /about-us/
├── gallery/index.html   # Our Work — photo gallery, served at /gallery/ (reads ../gallery.json)
├── contact/index.html   # Contact & quote request — served at /contact/
├── 404.html             # Not-found page — must stay at the repo root for GitHub
│                        #   Pages / Cloudflare Pages to pick it up automatically
├── styles.css           # Shared stylesheet (brand style guide v2.0)
├── resize-photos.py     # Shrinks work-example photos to web size — run before build-gallery.js
├── build-gallery.js     # Regenerates gallery.json from assets/work-examples/
├── gallery.json         # Generated gallery manifest — do not edit by hand
├── sitemap.xml
├── robots.txt
├── .gitignore
└── assets/
    ├── images/          # Logo + brand line-art icons (icons/)
    └── work-examples/   # Project photos, one folder per gallery category
        ├── kitchen/
        ├── bathroom/
        ├── built-ins/
        └── details/
```

### Why the extra folders — and why every link must keep the trailing slash

`about-us.html`, `gallery.html` and `contact.html` each moved into their own folder
as `index.html`, so the site has clean URLs — `/about-us/` instead of
`/about-us.html` — with nothing beyond static files. Every static host serves a
directory's `index.html` when you request the directory itself, so this needs no
server config, redirect rules, or Jekyll.

`index.html` and `404.html` stay at the root: the root *is* a directory as far as
this trick is concerned (`/` already serves `index.html` with no extension), and
GitHub Pages / Cloudflare Pages only look for a custom 404 page at the repo root.

Internal links always write the folder **with its trailing slash** —
`href="gallery/"`, not `href="gallery"`. Hosts redirect the slash-less form to the
slashed one, but that's an extra round trip, and page-relative asset links (`../`)
inside the target page resolve against whatever URL is actually in the address
bar — so a page reached without the slash would compute `../` one level wrong and
break its own logo, stylesheet and nav. Always link with the slash.

Adding a fifth page later means creating `new-page/index.html`, not
`new-page.html` — and every asset reference inside it needs a `../` prefix, since
it lives one folder below the ones at the root (see the existing pages for the
pattern: `../styles.css`, `../assets/...`, and for the nav/footer, `../about-us/`
etc. — everything except in-page anchors, which use the shared root's own hash,
e.g. `../#services`).

## Gallery

Drop images into `assets/work-examples/<category>/`, then run both steps:

```bash
python resize-photos.py    # shrink to web size (needs: pip install Pillow)
node build-gallery.js      # rewrite gallery.json
```

`build-gallery.js` rewrites `gallery.json`. Filenames become captions — underscores
become spaces, words are title-cased, hyphens are kept (`Built-In` stays `Built-In`),
and small words like *and* / *with* stay lowercase. The folder name becomes the
filter label (see `CATEGORY_LABELS` in `build-gallery.js`).

So name files the way you want the caption to read:
`Cream Kitchen with Lanterns.jpg` → **Cream Kitchen with Lanterns**.

### Photo sizing — don't skip this

**Always run `resize-photos.py` before committing new photos.** Straight off a
camera these run ~4900px and 1–4 MB each. The gallery displays them at 270px and
the lightbox at ~1800px, so full-size files cost visitors megabytes for pixels they
never see — the full gallery was a 28 MB page load before this was added, and is
5.6 MB after.

The script caps the longest edge at 1800px, saves progressive JPEG at quality 82,
and strips EXIF (which on phone photos can carry the GPS location of a customer's
home). It skips files that are already web-sized, so it is safe to re-run.

## Hero overlays — don't lighten these

The dark gradients over the hero photos in `styles.css` (`.hero`) and
`about-us/index.html` (`.about-hero`) are not styling preference — their alpha values are set so white body
text clears the WCAG AA 4.5:1 contrast minimum against the brightest pixels of the
photo behind it. The photos run to near-white, so lightening the overlay drops the
sub-heading below AA. Each breakpoint has its own overlay for the same reason: once
text spans the full width on phones, a left-to-right fade leaves the end of every line
on the bright side of the image, so those widths use an even wash instead.

---

## Local Preview

**Option 1 — VS Code Live Server** (recommended)  
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, open `index.html`, then click **Go Live** in the status bar.

**Option 2 — Python**
```bash
python -m http.server 8080    # from the repo root
# Open http://localhost:8080
```

**Option 3 — Node**
```bash
npx serve .
```

---

## Deploy to GitHub Pages

1. **Create a GitHub repo** (e.g. `dmmwoodworking`).

2. **Push the repo contents** to the root of the GitHub repo:
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/dmmwoodworking.git
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**  
   Go to **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → **Save**.

4. Your site will be live at:  
   `https://YOUR_USERNAME.github.io/dmmwoodworking/`

5. **Custom domain** (optional)  
   - Add a `CNAME` file to the repo root containing `www.dmmwoodworking.com`.  
   - In your DNS provider, add a CNAME record: `www` → `YOUR_USERNAME.github.io`.  
   - In Settings → Pages, enter your custom domain and enable **Enforce HTTPS**.

---

## Deploy to Cloudflare Pages

1. Push the repo contents to a GitHub repo (steps 1–2 above).

2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.

3. Select your repository and configure the build:

   | Setting | Value |
   |---|---|
   | **Framework preset** | None |
   | **Build command** | *(leave blank)* |
   | **Build output directory** | `/` |

4. Click **Save and Deploy**. Cloudflare assigns a `*.pages.dev` URL immediately.

5. **Custom domain**  
   Pages project → **Custom domains** → **Set up a custom domain** → enter `www.dmmwoodworking.com` → follow the DNS prompts (SSL is auto-provisioned).

---

## Contact Form

The form in `contact/index.html` is wired to **[Formspree](https://formspree.io)** at
`https://formspree.io/f/mdeobdpl`, which delivers to sales@dmmwoodworkingpa.com. It
supports file uploads (plans, photos, sketches) — keep `enctype="multipart/form-data"`
on the `<form>` or attachments will be dropped.

### The form is currently on hold

The page shows a call/email fallback notice instead, and the form itself is dimmed and
`inert` so nothing can be typed or submitted. To turn it back on:

1. Delete the `<p class="form-hold">…</p>` notice.
2. Remove `inert` and `style="opacity:.55;pointer-events:none"` from the `<form>`.
3. Change the submit button back to `type="submit"` and drop its `disabled` attribute.

The same steps are noted in a comment directly above the form.

---

## After Going Live

Update the domain in `sitemap.xml` and `robots.txt` to match your final URL.
