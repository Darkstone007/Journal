/*
  LOG. Prefer entries/log.json; otherwise build from catalog dates.
*/
(function () {
  const root = document.getElementById("log-list");
  if (!root) return;

  fetch("entries/log.json?t=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("missing");
      return r.json();
    })
    .then(function (data) { draw(data.events || []); })
    .catch(function () {
      return DZF.loadCatalog().then(function (posts) {
        draw(DZF.publishedOnly(posts).map(function (p) {
          return { at: p.date, kind: "published", id: p.id, title: p.title };
        }));
      });
    })
    .catch(function () {
      root.innerHTML = '<p class="empty">No log yet.</p>';
    });

  function draw(events) {
    if (!events.length) {
      root.innerHTML = '<p class="empty">No log yet.</p>';
      return;
    }
    events = events.slice().sort(function (a, b) {
      return String(b.at || "").localeCompare(String(a.at || ""));
    });
    root.innerHTML = events.map(function (e) {
      const kind = e.kind || "published";
      const href = e.id ? ("post.html?id=" + encodeURIComponent(e.id)) : "index.html";
      return (
        '<div class="log-item">' +
          '<div class="when">' + DZF.escapeHtml(DZF.formatDate(String(e.at || "").slice(0, 10))) + "</div>" +
          '<div class="what">' +
            DZF.escapeHtml(kind) + " \u00b7 " +
            '<a href="' + href + '">' + DZF.escapeHtml(e.title || e.id || "entry") + "</a>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }
})();
