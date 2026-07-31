# Custom pages

Interlou includes a small number of route-specific templates for llbbl.blog.

## Current templates

- `/links/`: path-aware template in [`layouts/links/all.html`](../layouts/links/all.html) with shared rendering in [`layouts/_partials/links.html`](../layouts/_partials/links.html)
- `/replies/`: section template in [`layouts/replies/section.html`](../layouts/replies/section.html)
- `/photos/`: path-aware template in [`layouts/photos/all.html`](../layouts/photos/all.html), with Micro.blog compatibility fallback in [`layouts/list.photoshtml.html`](../layouts/list.photoshtml.html)
- `/archive/`: path-aware template in [`layouts/archive/all.html`](../layouts/archive/all.html), with Micro.blog compatibility fallback in [`layouts/list.archivehtml.html`](../layouts/list.archivehtml.html)
- `/categories/`: taxonomy directory in [`layouts/categories/taxonomy.html`](../layouts/categories/taxonomy.html) and individual category lists in [`layouts/categories/term.html`](../layouts/categories/term.html)

These are site-specific decisions, not a promise of a broad template API.

## Pages managed outside this repo

Some Micro.blog-managed page content is maintained outside this public theme repository and then synced into Micro.blog separately. This repo is the theme layer, not the full content-management workflow.

## Future ideas

Possible additions, inspired in part by <https://slashpages.net/>:

- `/now/`
- `/uses/`
- `/recommendations/`
- `/defaults/`
- `/blogroll/`
- `/colophon/`
