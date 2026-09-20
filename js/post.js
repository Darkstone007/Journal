/*
  SINGLE POST RENDERER
  --------------------
  Looks at ?id= in the URL, finds that post in js/posts.js,
  and fills in date, title, images, and body.
  You do not need to edit this unless you want a different layout.
*/

(function () {
  const root = document.getElementById("article");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const posts = typeof POSTS === "undefined" ? [] : POSTS;
  const post = posts.find(function (p) { return p.id === id; });

  if (!post) {
    root.innerHTML =
      '<p class="empty">That entry was not found. <a href="index.html">Back to the journal</a>.</p>';
    return;
  }

  document.title = post.title + " · Journal";

  const images = Array.isArray(post.images) ? post.images : [];
  let imageBlock = "";
  if (images.length) {
    imageBlock =
      '<div class="article-images">' +
      images.map(function (src) {
        return '<img src="' + escapeAttr(src) + '" alt="" />';
      }).join("") +
      "</div>";
  } else {
    imageBlock = '<div class="image-slot" style="height:180px;margin-bottom:28px">No images on this entry yet</div>';
  }

  const paragraphs = String(post.body || "")
    .split(/\n\n+/)
    .map(function (p) { return "<p>" + escapeHtml(p).replace(/\n/g, "<br>") + "</p>"; })
    .join("");

  root.innerHTML =
    '<p class="article-date">' + escapeHtml(formatDate(post.date)) + "</p>" +
    "<h1 class=\"article-title\">" + escapeHtml(post.title) + "</h1>" +
    imageBlock +
    '<div class="article-body">' + paragraphs + "</div>";

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
