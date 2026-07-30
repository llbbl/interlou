# Custom pages

Interlou includes a small number of route-specific templates for llbbl.blog.

## Current templates

- `/links/`: section template in [`layouts/section/links.html`](../layouts/section/links.html), page template in [`layouts/page/links.html`](../layouts/page/links.html), and link-entry rendering in [`layouts/links/single.html`](../layouts/links/single.html)
- `/replies/`: section template in [`layouts/section/replies.html`](../layouts/section/replies.html)
- `/archive/`: Micro.blog Archive output overridden by [`layouts/list.archivehtml.html`](../layouts/list.archivehtml.html) and the shared archive partial
- `/categories/`: category terms directory in [`layouts/categories/terms.html`](../layouts/categories/terms.html); individual category post lists remain in [`layouts/taxonomy/category.html`](../layouts/taxonomy/category.html)

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
