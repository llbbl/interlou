# Development workflow

Interlou is a Micro.blog theme built from Hugo-style templates plus Tailwind CSS v4.

## Requirements

- Node.js 22 or newer
- `pnpm@11.1.3`
- [Bun](https://bun.sh/) for the local layout preview server
- Hugo 0.158.0 for rendered-template compatibility checks

## Setup

```bash
pnpm install
```

## Common commands

```bash
pnpm dev
pnpm preview
pnpm build
pnpm test
pnpm test:hugo -- --hugo /path/to/hugo-0.158.0
pnpm gen:fallback
```

- `pnpm dev` watches `src/styles.css` and rebuilds `static/css/styles.css`.
- `pnpm preview` serves the tracked layout fixtures at <http://127.0.0.1:48137/>.
- `pnpm build` creates the production CSS that should be committed with source changes.
- `pnpm test` runs the Vitest coverage for browser-side theme behavior.
- `pnpm test:hugo` builds representative Micro.blog content with Hugo 0.158.0 and verifies critical generated routes. Pass an exact binary with `--hugo` or `HUGO_BIN`.
- `pnpm gen:fallback` regenerates the metric-matched fallback font faces after font-family or font-weight changes.

## File map

- `src/styles.css`: source theme styles and tokens
- `static/css/styles.css`: generated output committed for Micro.blog to serve
- `layouts/`: Hugo 0.146+ homepage, page-kind, and route-specific templates
- `layouts/_partials/`: shared template fragments
- `preview/`: tracked HTML fixtures for local layout review
- `scripts/preview-server.ts`: Bun server for the local preview fixtures
- `scripts/test-hugo.ts`: isolated Hugo build and generated-route assertions
- `testdata/hugo-site/`: representative Micro.blog content and pinned-version fixture configuration
- `scripts/gen-font-fallback.mjs`: fallback font generator

## Working on the theme

1. Edit source files such as `src/styles.css` or templates under `layouts/`.
2. Run `pnpm build`.
3. Review both the source diff and the regenerated `static/css/styles.css` diff.
4. Push the branch.
5. In Micro.blog, open **Design → Edit Custom Themes**, open the theme, and use the sync button.

Micro.blog does not automatically pull every GitHub push into an installed custom theme, so that final sync step is required.

## Validation

Run `pnpm test`, `pnpm build`, and the pinned `pnpm test:hugo` command for every template change. Review the generated CSS diff and use `pnpm preview` for representative layout and interaction checks. The local Hugo fixture cannot reproduce Micro.blog's optimized renderer or installed plug-ins, so validate on a Hugo 0.158 Micro.blog test blog before changing production. See [Hugo 0.158 compatibility](hugo-0.158.md).
