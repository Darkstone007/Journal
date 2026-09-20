/*
  OWNER STUDIO
  Unlocks with a GitHub fine-grained token, then writes entries to this repo
  through the GitHub Contents API. Public pages read those files.

  Edit SITE in js/core.js if the repo name ever changes.
*/
(function () {
  const lock = document.getElementById("lock");
  const desk = document.getElementById("desk");
  if (!lock || !desk) return;

  const KEY = "dzf_journal_pat";
  const API = "https://api.github.com";
  const owner = DZF.SITE.owner;
  const repo = DZF.SITE.repo;
  const branch = DZF.SITE.branch;

  const patInput = document.getElementById("pat");
  const lockStatus = document.getElementById("lock-status");
  const saveStatus = document.getElementById("save-status");
  const who = document.getElementById("who");
  const form = document.getElementById("form");
  const existing = document.getElementById("existing");
  const thumbs = document.getElementById("thumbs");
  const filesInput = document.getElementById("files");

  let pendingImages = [];
  let keptImages = [];

  if (localStorage.getItem(KEY)) {
    unlock(localStorage.getItem(KEY), true);
  }

  document.getElementById("unlock").addEventListener("click", function () {
    unlock((patInput.value || "").trim(), false);
  });

  document.getElementById("forget").addEventListener("click", function () {
    localStorage.removeItem(KEY);
    location.reload();
  });

  document.getElementById("new-entry").addEventListener("click", function () {
    fillForm(blank());
    setStatus(saveStatus, "New entry.", "");
  });

  filesInput.addEventListener("change", function () {
    compressFiles(filesInput.files);
    filesInput.value = "";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    publish();
  });

  function headers(token) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function unlock(token, silent) {
    if (!token) {
      setStatus(lockStatus, "Paste a token first.", "err");
      return;
    }
    setStatus(lockStatus, "Checking token\u2026", "");
    fetch(API + "/user", { headers: headers(token) })
      .then(function (r) {
        if (!r.ok) throw new Error("Token was refused. Check it still exists and has not expired.");
        return r.json();
      })
      .then(function (me) {
        if (String(me.login || "").toLowerCase() !== owner.toLowerCase()) {
          throw new Error("That token belongs to " + me.login + ", not " + owner + ".");
        }
        return fetch(API + "/repos/" + owner + "/" + repo, { headers: headers(token) })
          .then(function (r) {
            if (!r.ok) throw new Error("Token cannot see the " + repo + " repo.");
            return me;
          });
      })
      .then(function (me) {
        localStorage.setItem(KEY, token);
        lock.hidden = true;
        desk.hidden = false;
        who.textContent = me.login;
        fillForm(blank());
        refreshList();
        if (!silent) setStatus(lockStatus, "Unlocked.", "ok");
      })
      .catch(function (err) {
        setStatus(lockStatus, err.message || String(err), "err");
      });
  }

  function token() {
    return localStorage.getItem(KEY) || "";
  }

  function api(path, opt) {
    opt = opt || {};
    return fetch(API + path, {
      method: opt.method || "GET",
      headers: Object.assign(headers(token()), opt.json ? { "Content-Type": "application/json" } : {}),
      body: opt.body || null
    }).then(function (r) {
      if (r.status === 404) return null;
      return r.json().then(function (data) {
        if (!r.ok) {
          const msg = (data && (data.message || data.error)) || ("HTTP " + r.status);
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  function getFile(path) {
    return api("/repos/" + owner + "/" + repo + "/contents/" + path + "?ref=" + branch);
  }

  function putFile(path, rawUtf8OrB64, message, sha, alreadyB64) {
    const content = alreadyB64 ? rawUtf8OrB64 : utf8ToB64(rawUtf8OrB64);
    const body = { message: message, content: content, branch: branch };
    if (sha) body.sha = sha;
    return api("/repos/" + owner + "/" + repo + "/contents/" + path, {
      method: "PUT",
      json: true,
      body: JSON.stringify(body)
    });
  }

  function utf8ToB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function b64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(String(b64 || "").replace(/\s/g, ""))));
  }

  function blank() {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    return {
      id: "",
      date: iso,
      title: "",
      topics: [],
      images: [],
      excerpt: "",
      body: "",
      published: true
    };
  }

  function fillForm(post) {
    document.getElementById("entry-id").value = post.id || "";
    document.getElementById("date").value = post.date || "";
    document.getElementById("title").value = post.title || "";
    document.getElementById("topics-input").value = (post.topics || []).join(", ");
    document.getElementById("body").value = post.body || "";
    document.getElementById("published").checked = post.published !== false;
    keptImages = (post.images || []).slice();
    pendingImages = [];
    drawThumbs();
  }

  function drawThumbs() {
    const bits = [];
    keptImages.forEach(function (src, i) {
      bits.push('<img src="../' + DZF.escapeHtml(src) + '" alt="" data-keep="' + i + '" title="existing" />');
    });
    pendingImages.forEach(function (img) {
      bits.push('<img src="' + img.dataUrl + '" alt="" />');
    });
    thumbs.innerHTML = bits.join("");
  }

  function compressFiles(list) {
    const jobs = [];
    for (let i = 0; i < list.length; i++) jobs.push(compressOne(list[i]));
    Promise.all(jobs)
      .then(function (imgs) {
        pendingImages = pendingImages.concat(imgs);
        drawThumbs();
      })
      .catch(function (err) {
        setStatus(saveStatus, err.message || String(err), "err");
      });
  }

  function compressOne(file) {
    return new Promise(function (resolve, reject) {
      if (!file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("Choose an image file."));
        return;
      }
      const img = new Image();
      img.onload = function () {
        const max = 1600;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          const s = max / Math.max(w, h);
          w = Math.round(w * s);
          h = Math.round(h * s);
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#0c0b0e";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = c.toDataURL("image/jpeg", 0.82);
        const b64 = dataUrl.split(",")[1];
        const safe = String(file.name || "image")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40) || "image";
        resolve({ dataUrl: dataUrl, b64: b64, name: safe });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = function () { reject(new Error("Could not read that image.")); };
      img.src = URL.createObjectURL(file);
    });
  }

  function publish() {
    const date = document.getElementById("date").value;
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value;
    const topics = DZF.parseTopics(document.getElementById("topics-input").value);
    const published = document.getElementById("published").checked;
    let id = document.getElementById("entry-id").value.trim() || DZF.slugify(title, date);
    if (!title || !date) {
      setStatus(saveStatus, "Date and title are required.", "err");
      return;
    }
    setStatus(saveStatus, "Publishing\u2026", "");
    const btn = document.getElementById("save");
    btn.disabled = true;

    const imageJobs = pendingImages.map(function (img, i) {
      const path = "entries/images/" + id + "-" + (i + 1) + "-" + img.name + ".jpg";
      return getFile(path).then(function (existingFile) {
        return putFile(
          path,
          img.b64,
          "journal: photo for " + id,
          existingFile && existingFile.sha,
          true
        ).then(function () { return path; });
      });
    });

    Promise.all(imageJobs)
      .then(function (newPaths) {
        const images = keptImages.concat(newPaths);
        const post = {
          id: id,
          date: date,
          title: title,
          topics: topics,
          images: images,
          excerpt: DZF.excerptOf(body),
          body: body,
          published: published
        };
        const json = JSON.stringify(post, null, 2);
        return getFile("entries/" + id + ".json").then(function (file) {
          return putFile("entries/" + id + ".json", json, "journal: " + (published ? "publish " : "draft ") + id, file && file.sha)
            .then(function () { return post; });
        });
      })
      .then(function (post) {
        return updateCatalog(post).then(function () { return post; });
      })
      .then(function (post) {
        return updateLog(post).then(function () { return post; });
      })
      .then(function (post) {
        document.getElementById("entry-id").value = post.id;
        keptImages = post.images.slice();
        pendingImages = [];
        drawThumbs();
        refreshList();
        setStatus(
          saveStatus,
          (post.published ? "Published. " : "Saved as draft. ") +
            "Public page: ../post.html?id=" + post.id,
          "ok"
        );
      })
      .catch(function (err) {
        setStatus(saveStatus, err.message || String(err), "err");
      })
      .then(function () {
        btn.disabled = false;
      });
  }

  function updateCatalog(post) {
    return getFile("entries/index.json").then(function (file) {
      let data = { posts: [] };
      if (file && file.content) {
        try { data = JSON.parse(b64ToUtf8(file.content)); } catch (e) { data = { posts: [] }; }
      }
      const posts = data.posts || [];
      const summary = {
        id: post.id,
        date: post.date,
        title: post.title,
        topics: post.topics,
        images: post.images,
        excerpt: post.excerpt,
        published: post.published
      };
      let found = false;
      const next = posts.map(function (p) {
        if (p.id === post.id) { found = true; return summary; }
        return p;
      });
      if (!found) next.unshift(summary);
      next.sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });
      const json = JSON.stringify({ posts: next }, null, 2);
      return putFile("entries/index.json", json, "journal: catalog " + post.id, file && file.sha);
    });
  }

  function updateLog(post) {
    return getFile("entries/log.json").then(function (file) {
      let data = { events: [] };
      if (file && file.content) {
        try { data = JSON.parse(b64ToUtf8(file.content)); } catch (e) { data = { events: [] }; }
      }
      const events = data.events || [];
      events.unshift({
        at: new Date().toISOString(),
        kind: post.published ? "published" : "draft",
        id: post.id,
        title: post.title
      });
      const json = JSON.stringify({ events: events.slice(0, 200) }, null, 2);
      return putFile("entries/log.json", json, "journal: log " + post.id, file && file.sha);
    });
  }

  function refreshList() {
    DZF.loadCatalog()
      .then(function (posts) {
        if (!posts.length) {
          existing.innerHTML = '<p class="quiet">No entries yet.</p>';
          return;
        }
        existing.innerHTML = posts.map(function (p) {
          return (
            '<div class="entry-row" data-id="' + DZF.escapeHtml(p.id) + '">' +
              '<div><div class="nm">' + DZF.escapeHtml(p.title) + "</div>" +
              '<div class="quiet">' + DZF.escapeHtml(DZF.formatDate(p.date)) + "</div></div>" +
              '<div class="badge">' + (p.published === false ? "draft" : "live") + "</div>" +
            "</div>"
          );
        }).join("");
        existing.querySelectorAll(".entry-row").forEach(function (row) {
          row.addEventListener("click", function () {
            loadEntry(row.getAttribute("data-id"));
          });
        });
      })
      .catch(function () {
        existing.innerHTML = '<p class="quiet">Catalog not loaded yet.</p>';
      });
  }

  function loadEntry(id) {
    fetch("../entries/" + encodeURIComponent(id) + ".json?t=" + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error("Could not open that entry.");
        return r.json();
      })
      .then(function (post) {
        fillForm(post);
        window.scrollTo(0, 0);
        setStatus(saveStatus, "Loaded " + id + ".", "");
      })
      .catch(function (err) {
        setStatus(saveStatus, err.message || String(err), "err");
      });
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.className = "status" + (kind ? " " + kind : "");
  }
})();
