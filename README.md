# Journal — David Ziklag Foster

Personal journal. **Only I write. Everyone else reads.**

Matte black + dull royal purple. Tree mark top-left, the same family as the portfolio tree (`Media/Lo.jpg`), restyled for this site.

## Links

- **Repo (this site lives here):** https://github.com/Darkstone007/Journal
- **Live site:** https://darkstone007.github.io/Journal/
- **Owner studio (bookmark this, not in the public nav):** https://darkstone007.github.io/Journal/studio/
- **Portfolio (style reference):** https://darkstone007.github.io/Portfolio/

Turn the live site on once (takes 15 seconds): repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main` / folder `/ (root)` → Save**. After a minute it is at https://darkstone007.github.io/Journal/

---

## How to publish (the whole job)

1. Open **`/studio/`**.
2. Paste a GitHub token (see below). Unlock.
3. Date, title, topics, writing, images.
4. Publish. The home list, search, topics, and log update from `entries/`.

Drafts (untick Publish) stay off the public pages.

### GitHub token (one time)

1. https://github.com/settings/personal-access-tokens
2. Fine-grained token. Resource owner: **Darkstone007**.
3. Only the **Journal** repository.
4. Permissions: **Contents → Read and write**.
5. Generate, paste into studio. Forget it from the studio when you are done on a shared computer.

Nobody else can do this unless you add them as a collaborator **and** they have a token. Readers have no editor.

---

## Finding things

- **Search** on the home page looks through titles, topics, and text.
- **Topics** are chips under search. Each entry can have several.
- **Log** is a chronological list of what was published.
- Every entry has a **date**, a **title**, and an **image well**.

---

## What each file is

| File | What it is | Edit it? |
|---|---|---|
| `studio/` | Owner writing desk | Bookmark it |
| `entries/` | Posts, log, photos | Studio writes these |
| `js/core.js` | Shared helpers + site name | Rarely |
| `js/app.js` | Home: search, topics, cards | No |
| `js/post.js` | One entry | No |
| `js/log.js` | The log page | No |
| `js/studio.js` | Publisher (GitHub Contents API) | If you change how publish works |
| `css/style.css` | Colors and layout | If you want to restyle |
| `assets/mark.svg` | Tree mark | If you replace the logo |
| `index.html` `post.html` `log.html` | Page shells | Rarely |

Every file is commented in plain language.
