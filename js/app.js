/*
  HOME: search, topic chips, dated titled cards.
  Photos only render when the entry actually has them.
*/
(function () {
  const list = document.getElementById("post-list");
  const search = document.getElementById("search");
  const topicsEl = document.getElementById("topics");
  const heading = document.getElementById("list-heading");
  if (!list) return;

  const params = new URLSearchParams(window.location.search);
  let q = (params.get("q") || "").trim();
  let topic = (params.get("topic") || "").trim().toLowerCase();
  let all = [];

  if (search) search.value = q;

  DZF.loadCatalog()
    .then(function (posts) {
      all = DZF.publishedOnly(posts);
      drawTopics();
      draw();
    })
    .catch(function () {
      list.innerHTML = '<p class="empty">No entries yet.</p>';
    });

  if (search) {
    search.addEventListener("input", function () {
      q = search.value.trim();
      syncUrl();
      draw();
    });
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (topic) next.set("topic", topic);
    const qs = next.toString();
    const url = window.location.pathname + (qs ? "?" + qs : "");
    window.history.replaceState({}, "", url);
  }

  function drawTopics() {
    if (!topicsEl) return;
    const set = {};
    all.forEach(function (p) {
      (p.topics || []).forEach(function (t) { set[t] = true; });
    });
    const names = Object.keys(set).sort();
    if (!names.length) {
      topicsEl.innerHTML = "";
      return;
    }
    topicsEl.innerHTML =
      '<button type="button" class="topic' + (!topic ? " is-on" : "") + '" data-topic="">All</button>' +
      names.map(function (t) {
        return '<button type="button" class="topic' + (topic === t ? " is-on" : "") + '" data-topic="' +
          DZF.escapeHtml(t) + '">' + DZF.escapeHtml(t) + "</button>";
      }).join("");
    topicsEl.querySelectorAll(".topic").forEach(function (btn) {
      btn.addEventListener("click", function () {
        topic = btn.getAttribute("data-topic") || "";
        syncUrl();
        drawTopics();
        draw();
      });
    });
  }

  function matches(p) {
    if (topic && (p.topics || []).indexOf(topic) === -1) return false;
    if (!q) return true;
    const blob = [p.title, p.excerpt, p.body, (p.topics || []).join(" "), p.date]
      .join(" ")
      .toLowerCase();
    return blob.indexOf(q.toLowerCase()) !== -1;
  }

  function draw() {
    const shown = all.filter(matches);
    if (heading) {
      heading.textContent = topic ? ("Topic  " + topic) : (q ? "Search" : "Entries");
    }
    if (!shown.length) {
      list.innerHTML =
        !all.length && !q && !topic
          ? '<p class="empty">No entries yet.</p>'
          : '<p class="empty">Nothing matches. Try another word or topic.</p>';
      return;
    }
    list.innerHTML = shown.map(card).join("");
  }

  function card(post) {
    const href = "post.html?id=" + encodeURIComponent(post.id);
    const images = (post.images || (post.cover ? [post.cover] : [])).filter(Boolean);
    let imageBlock = "";
    if (images.length) {
      const cls = images.length === 1 ? "post-images single" : "post-images";
      imageBlock =
        '<div class="' + cls + '">' +
        images.map(function (src) {
          return '<img src="' + DZF.escapeHtml(src) + '" alt="" />';
        }).join("") +
        "</div>";
    }
    const chips = (post.topics || []).map(function (t) {
      return "<span>" + DZF.escapeHtml(t) + "</span>";
    }).join("");
    return (
      '<a class="post-card" href="' + href + '">' +
        '<p class="post-date">' + DZF.escapeHtml(DZF.formatDate(post.date)) + "</p>" +
        '<h3 class="post-title">' + DZF.escapeHtml(post.title) + "</h3>" +
        (chips ? '<div class="post-topics">' + chips + "</div>" : "") +
        imageBlock +
        (post.excerpt ? '<p class="post-excerpt">' + DZF.escapeHtml(post.excerpt) + "</p>" : "") +
      "</a>"
    );
  }
})();
