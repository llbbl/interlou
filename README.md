# Interlou

Interlou is the personal [Micro.blog](https://micro.blog) theme for [llbbl.blog](https://llbbl.blog). This repository is public so other people can inspect the implementation, but the theme is tuned for one site and changes to fit that site rather than serving as a general-purpose starter theme.

## Install

In Micro.blog, go to **Design → Edit Custom Themes → New Theme** and paste:

```text
https://github.com/llbbl/interlou
```

## Local development

Interlou uses Tailwind CSS v4 and requires Node.js 22+ with `pnpm@11.1.3`.

```bash
pnpm install
pnpm build
```

Use `pnpm dev` while iterating. Edit `src/styles.css`, keep the generated `static/css/styles.css` committed alongside it, and manually sync the theme in Micro.blog after pushing.

## Docs

- [Documentation index](docs/README.md)
- [Development workflow](docs/development.md)
- [Customization](docs/customization.md)
- [Homepage cards](docs/homepage-cards.md)
- [Tables](docs/tables.md)
- [Dependencies and updates](docs/dependencies.md)
- [Custom pages](docs/custom-pages.md)

## Credits

Inspired by [Outpost](https://github.com/mchlhyns/theme-outpost) by Mike Haynes.

## License

MIT
