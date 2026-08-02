# Customization

Most theme-level changes live in `src/styles.css`. Interlou uses Tailwind CSS v4's CSS-first setup, so there is no separate `tailwind.config.js` in this repository.

## Colors and tokens

The site palette is defined with CSS custom properties near the top of `src/styles.css`:

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

Changing those tokens updates the core background, text, accent, and alternate surface colors across the theme.

## Fonts

Interlou currently uses:

- `Rubik` for body text
- `Roboto Mono` for dates, navigation, and mono accents

The Google Fonts request lives in `layouts/baseof.html`, and the font stacks live in `src/styles.css` through `--font-sans` and `--font-mono`.

If you change the families or weights:

1. Update the Google Fonts URL in `layouts/baseof.html`.
2. Update the stacks in `src/styles.css`.
3. Run `pnpm gen:fallback`.
4. Run `pnpm build`.

## Tables

Markdown pipe tables receive the default styling automatically. Alternate table treatments such as `table-grid`, `table-panel`, and the color-panel variants require raw HTML with a class on the `<table>` element.

See [Tables](tables.md) for the full class list and copy-paste examples.

## Homepage cards

The homepage card excerpt is derived automatically from the rendered post text. Authors do not need to provide a separate summary field or manual preview value.

See [Homepage cards](homepage-cards.md) for the exact excerpt pipeline, the 240-character truncation rule, empty-post fallback behavior, and the local preview fixture server.
