/*
  Shared helpers for public pages and studio/.
  escapeHtml uses unicode escapes so this file cannot be corrupted.
*/
(function (w) {
  const SITE = {
    owner: "Darkstone007",
    repo: "Journal",
    branch: "main",
    author: "David Ziklag Foster",
    name: "Journal"
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function slugify(title, date) {
    const base = String(title || "entry")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "entry";
    return (date || "entry") + "-" + base;
  }

  function parseTopics(s) {
    return String(s || "")
      .split(",")
      .map(function (t) { return t.trim().toLowerCase(); })
      .filter(Boolean);
  }

  function excerptOf(body) {
    const text = String(body || "").replace(/\s+/g, " ").trim();
    if (text.length <= 180) return text;
    return text.slice(0, 180).replace(/\s+\S*$/, "") + "\u2026";
  }

  function catalogUrl() {
    const here = window.location.pathname;
    const prefix = /\/studio\//.test(here) ? "../" : "";
    return prefix + "entries/index.json";
  }

  function loadCatalog() {
    return fetch(catalogUrl() + "?t=" + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error("Could not load entries");
        return r.json();
      })
      .then(function (data) {
        const posts = (data && data.posts) || [];
        return posts.slice().sort(function (a, b) {
          return String(b.date || "").localeCompare(String(a.date || ""));
        });
      });
  }

  function publishedOnly(posts) {
    return posts.filter(function (p) { return p.published !== false; });
  }

  w.DZF = {
    SITE: SITE,
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    slugify: slugify,
    parseTopics: parseTopics,
    excerptOf: excerptOf,
    loadCatalog: loadCatalog,
    publishedOnly: publishedOnly
  };
})(window);
