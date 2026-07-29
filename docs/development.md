# Development workflow

Interlou is a Micro.blog theme built from Hugo-style templates plus Tailwind CSS v4.

## Requirements

- Node.js 22 or newer
- `pnpm@11.1.3`

## Setup

```bash
pnpm install
```

## Common commands

```bash
pnpm dev
pnpm build
pnpm gen:fallback
```

- `pnpm dev` watches `src/styles.css` and rebuilds `static/css/styles.css`.
- `pnpm build` creates the production CSS that should be committed with source changes.
- `pnpm gen:fallback` regenerates the metric-matched fallback font faces after font-family or font-weight changes.

## File map

- `src/styles.css`: source theme styles and tokens
- `static/css/styles.css`: generated output committed for Micro.blog to serve
- `layouts/`: homepage, single-post, list, and partial templates
- `layouts/partials/`: shared template fragments
- `scripts/gen-font-fallback.mjs`: fallback font generator

## Working on the theme

1. Edit source files such as `src/styles.css` or templates under `layouts/`.
2. Run `pnpm build`.
3. Review both the source diff and the regenerated `static/css/styles.css` diff.
4. Push the branch.
5. In Micro.blog, open **Design → Edit Custom Themes**, open the theme, and use the sync button.

Micro.blog does not automatically pull every GitHub push into an installed custom theme, so that final sync step is required.

## Validation

There is currently no automated test suite. For theme work, the main validation step is a clean `pnpm build` plus reviewing the generated CSS diff and checking the rendered site in Micro.blog.
