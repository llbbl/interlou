# Dependencies and updates

## Runtime CDN assets

These assets are loaded from `layouts/baseof.html`:

| Dependency | Current value | Purpose |
|---|---|---|
| [Highlight.js](https://highlightjs.org/) | `11.11.1` | Syntax highlighting for code blocks |
| [Google Fonts](https://fonts.google.com/) | `Rubik` (`400`, `700`, `800`) and `Roboto Mono` (`700`) | Theme typography |

## Local tooling

`package.json` currently pins:

- `pnpm@11.1.3` as the package manager
- Node.js `>=22`
- `@tailwindcss/cli` and `tailwindcss` for CSS builds
- `fontaine` for generated fallback font metrics

## Updating Highlight.js

1. Check the latest release notes at <https://github.com/highlightjs/highlight.js/releases>.
2. Update both Highlight.js URLs in `layouts/baseof.html` so the CSS and JS versions stay aligned.
3. Rebuild and verify that code blocks still match the theme visually.

The current URL pattern is:

```html
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/tokyo-night-dark.min.css
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js
```

## Updating fonts

1. Change the Google Fonts request in `layouts/baseof.html`.
2. Update the font stacks in `src/styles.css` if the family names change.
3. Run `pnpm gen:fallback` if the metrics or weights change.
4. Run `pnpm build`.

## After dependency changes

Micro.blog serves the committed theme files from the repository. After updating dependencies and pushing the branch, sync the installed theme manually in **Design → Edit Custom Themes**.
