/*
  SINGLE ENTRY. Loads entries/{id}.json, falls back to the catalog.
*/
(function () {
  const root = document.getElementById("article");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    root.innerHTML = '<p class="empty">No entry selected. <a href="index.html">Back</a>.</p>';
    return;
  }

  fetch("entries/" + encodeURIComponent(id) + ".json?t=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("missing");
      return r.json();
    })
    .then(render)
    .catch(function () {
      return DZF.loadCatalog().then(function (posts) {
        const p = posts.filter(function (x) { return x.id === id; })[0];
        if (!p) throw new Error("missing");
        render(p);
      });
    })
    .catch(function () {
      root.innerHTML = '<p class="empty">That entry was not found. <a href="index.html">Back to the journal</a>.</p>';
    });

  function render(post) {
    if (post.published === false) {
      root.innerHTML = '<p class="empty">This entry is not published.</p>';
      return;
    }
    document.title = post.title + " \u00b7 Journal";
    const images = post.images || [];
    let imageBlock = "";
    if (images.length) {
      imageBlock =
        '<div class="article-images">' +
        images.map(function (src) {
          return '<img src="' + DZF.escapeHtml(src) + '" alt="" />';
        }).join("") +
        "</div>";
    }
    const chips = (post.topics || []).map(function (t) {
      return '<a class="topic" href="index.html?topic=' + encodeURIComponent(t) + '">' +
        DZF.escapeHtml(t) + "</a>";
    }).join("");
    const paragraphs = String(post.body || "")
      .split(/\n\n+/)
      .map(function (p) {
        return "<p>" + DZF.escapeHtml(p).replace(/\n/g, "<br>") + "</p>";
      })
      .join("");
    root.innerHTML =
      '<p class="article-date">' + DZF.escapeHtml(DZF.formatDate(post.date)) + "</p>" +
      '<h1 class="article-title">' + DZF.escapeHtml(post.title) + "</h1>" +
      (chips ? '<div class="topics" style="margin-bottom:20px">' + chips + "</div>" : "") +
      imageBlock +
      '<div class="article-body">' + paragraphs + "</div>";
  }
})();
