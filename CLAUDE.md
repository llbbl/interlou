# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interlou is a Micro.blog theme built with Hugo templating and Tailwind CSS. The theme outputs static HTML/CSS that Micro.blog pulls from GitHub.

## Commands

```bash
# Install dependencies
pnpm install

# Build CSS (minified for production)
pnpm build

# Watch mode for development
pnpm dev
```

## Architecture

**Build Pipeline**: Tailwind CSS processes `src/styles.css` → outputs to `static/css/styles.css`

**Hugo Templates** (`layouts/`):
- `_default/baseof.html` - Base template with head, header, footer
- `_default/list.html` - Home/archive pages
- `_default/single.html` - Individual post pages
- `partials/` - Reusable components (navigation, pagination, post, conversation)

**Styling** (`src/styles.css`):
- Uses Tailwind's `@layer base` and `@layer components` for organization
- CSS custom properties in `:root` define the color palette
- Mobile breakpoint at 800px

**Theme Colors** (configured in both `tailwind.config.js` and `src/styles.css`):
- `--background`: #371554 (deep purple)
- `--accent`: rgb(217, 70, 239) (fuchsia)
- `--text`: #eeeeee (light gray)

## Workflow

1. Edit styles in `src/styles.css`
2. Run `pnpm build`
3. Commit the built CSS (`static/css/styles.css`)
4. Push to GitHub - Micro.blog auto-pulls updates
