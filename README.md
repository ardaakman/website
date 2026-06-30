# arda akman — personal site

A minimal static site. The homepage is hand-written HTML; the blog is generated
from markdown files. No frameworks, no database.

## Structure

```
site/               # what Netlify publishes (static output)
  index.html        #   homepage (edit directly)
  profile.jpg
  blog/             #   GENERATED — do not edit by hand
content/blog/*.md   # blog posts, written in markdown (the source of truth)
build-blog.js       # zero-dependency generator: content/blog/*.md -> site/blog/*.html
netlify.toml        # build = `node build-blog.js`, publish = `site`
```

## Writing a post

1. Create a markdown file in `content/blog/`, e.g. `content/blog/my-post.md`.
   The filename (without `.md`) becomes the URL slug: `/blog/my-post.html`.
2. Start it with frontmatter:

   ```markdown
   ---
   title: My Post Title
   date: 2026-06-29
   ---

   Write the body in markdown...
   ```

3. Generate the HTML:

   ```bash
   npm run build      # or: node build-blog.js
   ```

4. Commit both the `.md` and the regenerated `site/blog/` files, then push.
   (Netlify also runs the build on deploy, so the blog stays in sync either way.)

Supported markdown: headings, paragraphs, **bold**, *italic*, `inline code`,
fenced code blocks, links, images, lists, blockquotes, and horizontal rules.

## Links

Homepage and blog link to GitHub, LinkedIn, and Twitter. Update those URLs in
`site/index.html` and in `build-blog.js` (the `siteHeader()` function).
