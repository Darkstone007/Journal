# Journal — David Ziklag Foster

Personal journal. **Only I can write** (this GitHub account). **Everyone else can read.**

## Links
- **Live site:** https://darkstone007.github.io/Journal/
- **This repo (edit here):** https://github.com/Darkstone007/Journal
- **Portfolio (style reference):** https://darkstone007.github.io/Portfolio/

The round **tree mark** (`Media/Lo.jpg` from the portfolio) is the signature on every page.

---

## How to add a post (this is the whole job)

1. Open **[`js/posts.js`](js/posts.js)** on GitHub.
2. Click the pencil (Edit).
3. Copy the example post at the top of that file, paste a new block **above** the older ones.
4. Fill in `date`, `title`, `images`, and `body`.
5. To add photos: **assets/** → **Add file** → **Upload files** → then list them in `images` like `"assets/my-photo.jpg"`.
6. Commit. After a minute the live site updates.

Nobody else can do this unless you add them as a collaborator. Readers have no editor.

## What each file is

| File | What it is | Edit it? |
|---|---|---|
| `js/posts.js` | **Your posts live here** (date, title, images, text) | **YES — this is the one** |
| `assets/` | Photos you upload for posts | **YES — drop images here** |
| `index.html` | Home page shell | Rarely |
| `post.html` | Single-post page shell | Rarely |
| `css/style.css` | Colors, layout (matte black + dull royal purple) | If you want to restyle |
| `js/app.js` | Draws the home list | No, unless you change the layout |
| `js/post.js` | Draws one post | No, unless you change the layout |
| `.github/workflows/pages.yml` | Publishes the site to GitHub Pages | No |

Every file is commented in plain language so you can see what each block does.
