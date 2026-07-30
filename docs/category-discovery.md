# Archive and category discovery

Interlou gives the Archive and Categories routes different jobs:

- `/archive/` is a compact entry point into categories followed by the chronological post archive.
- `/categories/` is the complete alphabetical category directory.
- `/categories/<name>/` keeps the existing per-category post list.

## Archive category selection

The Archive summary is rendered by Hugo, so it does not need JavaScript to choose categories.

The **Most used** group takes the first five entries from `Site.Taxonomies.categories.ByCount`. The **Recently used** group walks posts from newest to oldest and collects the first five unique categories that are not already present in Most used. Excluding that overlap gives visitors up to ten distinct starting points.

Each category link includes its total post count. The complete directory is one click away through **Browse all categories**.

Micro.blog's base `theme-blank` includes a top-level `layouts/list.archivehtml.html`. Interlou provides its own template at the same path because the top-level template takes precedence over the `_default` fallback. Both Interlou archive template paths delegate to `layouts/partials/archive.html` so their output stays consistent.

## Categories directory

`layouts/categories/terms.html` renders every category alphabetically with a post count. `layouts/taxonomy/category.html` remains responsible for showing posts within one category.

The complete directory is present in the original HTML. This keeps category navigation functional when JavaScript is disabled or fails to load.

## Filtering behavior

`static/js/category-filter.js` progressively reveals the search controls and filters the server-rendered directory:

- queries are trimmed and compared case-insensitively;
- zero to two characters leave the full directory visible;
- three or more characters perform a substring match;
- the result status, clear button, and empty state update with the query;
- clearing the input restores every category.

The script has no runtime dependency and does not require Vite or another bundler. Vitest covers the filter logic as a development dependency.

## Local preview

Run:

```bash
pnpm build
pnpm preview
```

Open <http://127.0.0.1:48137/> and choose **Archive and Categories**. The fixture includes popular and recent groups, overlapping source data already deduplicated in the rendered summary, long category names, substring matches, and an empty-result query.

To check the progressive fallback, disable JavaScript or prevent `static/js/category-filter.js` from loading. The filter form stays hidden and the full directory remains visible.
