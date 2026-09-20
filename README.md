# Sybil He · CV

Bilingual (中文 / EN) personal CV website. Static — plain HTML/CSS/JS, no build step.

## Local preview

Open `index.html` in any browser. Or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add a photo (optional)

Drop a square image named `photo.jpg` into this folder. If it's missing, an "SH" monogram shows instead.

## Edit content

All text lives in `index.html`. Each item has two spans:

```html
<span lang="zh">中文文本</span>
<span lang="en">English text</span>
```

Edit the text between the tags — leave the tags in place.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick this repo. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy** → your site goes live at `https://<project>.pages.dev`.

Every `git push` to the main branch redeploys automatically.
