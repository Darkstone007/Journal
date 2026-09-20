/*
  ============================================================
  THIS IS THE FILE YOU EDIT TO ADD A POST
  ============================================================

  How to add a new entry:
  1. Copy the whole { ... }, block of the example (the first one).
  2. Paste it ABOVE the older posts (newest at the top).
  3. Change id, date, title, images, body.
  4. If you have photos:
       - On GitHub: open the assets/ folder → Add file → Upload files
       - Then write the path here: "assets/your-filename.jpg"
  5. Commit. The live site updates in about a minute.

  Only this GitHub account can change this file, so only you can post.
  Everyone else just sees the published page.

  FIELDS
  ------
  id      Unique short name. No spaces. Used in the URL.
  date    Year-month-day, like "2026-09-20". This is the date shown on the card.
  title   The headline.
  images  List of photo paths. Use [] if this post has no photos yet.
          The home page and the post page both show this list.
  body    The writing. Use \n\n between paragraphs.
*/

const POSTS = [

  // ----- EXAMPLE / FIRST POST — duplicate this block to make a new one -----
  {
    id: "opening-the-book",
    date: "2026-09-20",
    title: "Opening the book",
    images: [
      // The tree mark from the portfolio sits here until you add your own photos.
      // Replace this line with "assets/your-photo.jpg" after you upload a file.
      "https://darkstone007.github.io/Portfolio/Media/Lo.jpg"
    ],
    body:
      "This journal is the other half of the portfolio — same tree mark, same quiet black, a dull royal purple instead of shine.\n\n" +
      "To add the next entry, open js/posts.js in this GitHub repo, copy the block above this sentence, and fill in a new date, title, images, and text. Drop photos in the assets folder. That is the whole process."
  }

  // To add another post, put a comma after the } above, then paste a new { ... }
  // {
  //   id: "a-new-day",
  //   date: "2026-09-21",
  //   title: "A new day",
  //   images: ["assets/photo-1.jpg", "assets/photo-2.jpg"],
  //   body: "What happened."
  // }

];
