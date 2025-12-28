# Interlou

A theme for [Micro.blog](https://micro.blog). An interlude for your thoughts.

## Installation

In Micro.blog, go to **Design → Edit Custom Themes → New Theme** and paste:

```
https://github.com/llbbl/interlou
```

## Development

This theme uses Vite + Tailwind CSS for styling.

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Setup

```bash
pnpm install
```

### Build CSS

```bash
# One-time build
pnpm build

# Watch for changes
pnpm dev
```

The built CSS outputs to `static/css/styles.css`.

### Workflow

1. Edit styles in `src/styles.css`
2. Run `pnpm build`
3. Commit the built CSS
4. Push to GitHub
5. Micro.blog will pull the updated theme

## Customization

### Colors

Edit the CSS custom properties in `src/styles.css`:

```css
:root {
  --background: #371554;
  --background-alt: #451d67;
  --text: #eeeeee;
  --text-alt: #cda0f4;
  --accent: rgb(217, 70, 239);
  --accent-alt: #490123;
}
```

Or modify `tailwind.config.js` for deeper changes.

### Fonts

The theme uses:
- **Rubik** for body text
- **Roboto Mono** for dates and navigation

Loaded via Google Fonts in the base template.

## Credits

Inspired by [Outpost](https://github.com/mchlhyns/theme-outpost) by Mike Haynes.

## License

MIT
