# ICS — International Chemical Supplier & Manufacturer
Static website — 16 pages, no build step required.

## What's inside
```
index.html            Homepage
about.html             services.html          industries.html
products.html          contact.html            quote.html
faq.html                downloads.html          careers.html
blog.html               privacy.html             terms.html
cookies.html            sitemap.html             404.html
css/style.css          All styling — single stylesheet, CSS custom properties
js/main.js             Mobile nav, scroll reveal, FAQ accordion, product filter/search
robots.txt             Search engine crawl rules
sitemap.xml            XML sitemap for search console submission
media/
  products/             Product photography — add new images here
  documents/
    tds/                One PDF per product, e.g. calabond-lc.pdf
    msds/               One PDF per product, matching filenames to tds/
    company/             Catalog, company profile, certificates, brochures
```

### Adding product photos
Drop a new image into `media/products/`, then reference it as the `image` field
for that product in `content_products.py` (see the `calabond-lc` entry for the
pattern) and re-run `python3 build.py`. Products without an image fall back to
an icon tile automatically, so this is optional per product.

### TDS / MSDS documents
Every product on `products.html` has a **View** link (opens the PDF in a new
tab) and a **Download** link (saves it directly) for both its TDS and MSDS —
generated as real PDF files in `media/documents/tds/` and
`media/documents/msds/`. The **Download Center** (`downloads.html`) lists all
of them in one searchable table, plus company-level documents (catalog,
profile, ISO/REACH statements, brochure).

**These are template/representative documents**, not verified lab data —
except Calabond LC's MSDS, which uses the exact data supplied for that
product. Before real-world use:
- Replace template TDS values (pH, viscosity, solids, dosage) with your
  actual formulation data.
- Replace template MSDS hazard/first-aid/PPE sections with your certified
  safety data, or a full GHS/OSHA-format SDS for each destination market.
- Every generated PDF carries a small disclaimer note saying so — remove it
  once real data is in place.

To regenerate all 43 PDFs after editing product data, run:
```
python3 generate_docs.py
```
This reads `content_products.py` directly, so update product info there first.

Everything is plain HTML/CSS/JS — no npm install, no build tool, no server-side
dependency. It runs by opening `index.html` directly, and deploys as-is to any
static host.

## Deploy — pick one

**Netlify / Vercel (drag & drop)**
Drag this whole folder onto the Netlify or Vercel dashboard. Done — both auto-detect
static sites with no config needed.

**GitHub Pages**
1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Your site is live at `https://<username>.github.io/<repo>/`.

**Any shared host / cPanel**
Upload the contents of this folder (not the folder itself) to `public_html/`
via FTP or the File Manager. No server config required — it's static files.

**ERPNext / Frappe website hosting**
If you want this served from the same instance as your ERPNext, drop the files
into a Frappe `www` folder as static assets, or serve them from a separate
subdomain (e.g. `www.thesmarterp.com` style) and connect the forms to
ERPNext's REST API per the notes below.

## Before you go live — update these placeholders

| What | Where | Replace with |
|---|---|---|
| Domain | `robots.txt`, `sitemap.xml`, every page's `<link rel="canonical">` and `og:*` tags | your real domain, e.g. `https://www.yourdomain.com` |
| Address / phone / WhatsApp / email | `contact.html`, footer in every page (via `helpers.py header()`/`footer()` if rebuilding) | your real office details |
| Google Map embed | `contact.html` — the `<iframe src="https://www.google.com/maps?q=...">` | your actual coordinates or a Google Maps Embed API key for production use |
| Product data | `products.html` | your real catalog, TDS/MSDS links |
| Social links | footer `#` placeholders | your real LinkedIn/Twitter/Facebook URLs |

## Forms — currently front-end only
All forms (`contact.html`, `quote.html`, `careers.html`, newsletter in the
footer) show a success state on submit but don't send data anywhere yet —
there's no backend wired up. To make them functional, either:

- **Point them at ERPNext:** POST to a Frappe REST endpoint (e.g. a custom
  API method that creates a CRM Lead / Quotation) using `fetch()` from
  `js/main.js`, or
- **Use a form service** (Formspree, Netlify Forms, etc.) by adding an
  `action` attribute to each `<form>`, or
- **Wire a lightweight backend** (Node/Express, Frappe custom app) that
  receives the POST and creates the corresponding ERPNext document.

The forms currently use `data-demo-form` — search for that attribute in
`js/main.js` to find and replace the demo submit handler with a real one.

## Regenerating the site
The site is built from Python templates (`build.py`, `helpers.py`,
`content*.py`) — these source files are not required for deployment (only
the generated HTML/CSS/JS is), but are included if you want to add pages or
edit copy without hand-editing repeated header/footer markup in every file.
Run `python3 build.py` after editing any `content_*.py` file to regenerate
all HTML pages.

## Checked before packaging
- Every internal link and asset path resolves to a real file — no 404s.
- Every category link (nav mega-menu, footer, homepage cards) into the
  product catalog matches a real filter and has at least one product under it.
- Canonical URLs match actual filenames on every page.
- 404 page included and linked nowhere except as the host's error document.
