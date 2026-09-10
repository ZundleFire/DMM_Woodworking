# DMM Woodworking — Static Site

Clean, framework-free static website for **DMM Woodworking LLC** (Lancaster, PA).  
Built with plain HTML5, CSS3, and vanilla JS — no build step required.

---

## Project Structure

```
.
├── index.html          # Homepage
├── about-us.html       # About page
├── gallery.html        # Our Work — photo gallery (reads gallery.json)
├── contact.html        # Contact & quote request
├── styles.css          # Shared stylesheet (brand style guide v2.0)
├── build-gallery.js    # Regenerates gallery.json from assets/work-examples/
├── gallery.json        # Generated gallery manifest — do not edit by hand
├── sitemap.xml
├── robots.txt
├── .gitignore
└── assets/
    ├── images/         # Logo + brand line-art icons (icons/)
    └── work-examples/  # Project photos, one folder per gallery category
        ├── kitchen/
        ├── bathroom/
        ├── built-ins/
        └── details/
```

## Gallery

Drop images into `assets/work-examples/<category>/`, then run:

```bash
node build-gallery.js
```

This rewrites `gallery.json`. Filenames become captions (dashes/underscores → spaces,
title-cased), and the folder name becomes the filter label (see `CATEGORY_LABELS`
in `build-gallery.js`).

---

## Local Preview

**Option 1 — VS Code Live Server** (recommended)  
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, open `index.html`, then click **Go Live** in the status bar.

**Option 2 — Python**
```bash
cd clean-site
python -m http.server 8080
# Open http://localhost:8080
```

**Option 3 — Node**
```bash
npx serve clean-site
```

---

## Deploy to GitHub Pages

1. **Create a GitHub repo** (e.g. `dmmwoodworking`).

2. **Push the `clean-site` folder contents** to the root of the repo:
   ```bash
   cd clean-site
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

1. Push the `clean-site` contents to a GitHub repo (steps 1–2 above).

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

The contact form supports **file uploads** (plans, photos, sketches), which needs a
form backend. It's pre-wired for **free [Formspree](https://formspree.io)** — create a
form and replace `YOUR_FORM_ID` in the `<form action>` in `contact.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" enctype="multipart/form-data">
```

Keep `enctype="multipart/form-data"` so attachments come through.

---

## After Going Live

Update the domain in `sitemap.xml` and `robots.txt` to match your final URL.
