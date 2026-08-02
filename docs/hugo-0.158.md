# Hugo 0.158 compatibility

Interlou 2.x targets Hugo 0.158.0 on Micro.blog. The last Hugo 0.91-compatible theme snapshot is the annotated Git tag `v1.0.0` at commit `d9f9645`.

This is a breaking compatibility boundary. Hugo 0.146 replaced the template lookup system, and Hugo 0.158 removed `.Site.Author` while deprecating `.Site.LanguageCode`. Interlou now uses root page-kind templates, path-aware route templates, `layouts/_partials`, `.Site.Params.author`, `.Site.Language.Locale`, page stores, and embedded templates through `partial`.

## Exact local validation

Download or install the exact Hugo 0.158.0 release, then provide its binary path:

```bash
pnpm install
pnpm test
pnpm build
pnpm test:hugo -- --hugo /path/to/hugo-0.158.0
```

`pnpm test:hugo` verifies the binary reports version 0.158.0 before building. It copies `testdata/hugo-site` into an isolated temporary directory, mounts the current checkout as the `interlou` theme, runs Hugo in production mode with info-level deprecation logging and warnings promoted to failures, then removes the temporary build.

Set `HUGO_BIN` instead of passing `--hugo` if preferred:

```bash
HUGO_BIN=/path/to/hugo-0.158.0 pnpm test:hugo
```

The retained `hugo-0.91.toml` fixture config supports comparison against the `v1.0.0` tag. It is a baseline aid, not a promise that Interlou 2.x remains compatible with Hugo 0.91.

## Regression matrix

The generated-output check covers:

- homepage cards and pagination;
- titled, titleless, long, image-first, and media-only posts;
- single-post spacing and conversation markup;
- Archive popular/recent categories and chronological entries;
- the category directory, category term pages, and an emoji category name;
- Links, Replies, and Photos routes;
- RSS output, copied production CSS, Open Graph, and Twitter image metadata.

The standalone fixture does not reproduce Micro.blog's generated front matter, optimized segmented rendering, dashboard settings, or installed plug-ins. A Micro.blog test blog is therefore a release gate, not an optional visual check.

## Micro.blog test-blog gate

Before changing llbbl.blog:

1. Use a dedicated Micro.blog test blog configured for Hugo 0.158.
2. Install or sync the candidate Interlou theme and every plug-in required by llbbl.blog.
3. Publish or copy representative titled, titleless, short, long, image-first, media-only, and emoji-category posts.
4. Verify `/`, a single post, `/archive/`, `/categories/`, an individual category, `/links/`, `/replies/`, `/photos/`, pagination, and `/feed.xml`.
5. Inspect page source for canonical, Open Graph, Twitter card, author, favicon, and feed metadata.
6. Confirm the Micro.blog build log contains no theme errors or unexpected warnings.

## Production rollout

Changing the production Hugo version requires explicit approval.

1. Record the current production theme revision and confirm `v1.0.0` is available as the Hugo 0.91 source baseline.
2. Preserve a copy of the currently installed Micro.blog custom theme so it can be restored without reconstructing templates.
3. Confirm the candidate commit passed local checks and the Micro.blog test-blog gate.
4. In a short maintenance window, sync the validated theme and change **Design → Hugo version** to 0.158.
5. Rebuild and repeat the critical-route, feed, metadata, navigation, image, and category smoke tests.
6. If any gate fails, restore the saved theme, return the dashboard to Hugo 0.91, rebuild, and verify the homepage, a post, Archive, Categories, and feed before ending the rollback.

Pushing or merging this repository does not refresh the installed Micro.blog theme and does not change the blog's Hugo version. Both remain manual dashboard actions.
