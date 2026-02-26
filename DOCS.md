# DMM Woodworking — Static Site

Clean, framework-free static website for **DMM Woodworking LLC** (Lancaster, PA).  
Built with plain HTML5, CSS3, and vanilla JS — no build step required.

---

## Project Structure

```
clean-site/
├── index.html          # Homepage
├── about-us.html       # About page
├── gallery.html        # Photo gallery
├── contact.html        # Contact & quote request
├── styles.css          # Shared stylesheet
├── sitemap.xml
├── robots.txt
├── .gitignore
└── assets/
    └── images/         # Local copies of all site images
```

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

The form currently uses `mailto:` (opens the visitor's email client).  
For a zero-server solution, replace it with a **free [Formspree](https://formspree.io)** endpoint:

In `contact.html` change the opening `<form>` tag:
```html
<!-- Before -->
<form action="mailto:info@dmmwoodworking.com" method="POST" enctype="text/plain" novalidate>

<!-- After (remove enctype too) -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
```

---

## After Going Live

Update the domain in `sitemap.xml` and `robots.txt` to match your final URL.
