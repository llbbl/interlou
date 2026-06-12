# Tables

Interlou styles HTML tables in post content. There is one default style and three opt-in variants.

## Default style (markdown tables)

Any GFM pipe table in a post gets the default style automatically — no class, no extra markup:

```markdown
| Tool | What It Solves | Best For |
|---|---|---|
| **[Atlantis](https://www.runatlantis.io/)** | PR-based workflow automation | Teams that want a TACO-style PR workflow |
| **[Digger](https://digger.dev/)** | Same PR workflow, runs in your CI | Teams with secretless OIDC pipelines |
```

Default look:

- Header row: fuchsia accent, uppercase, bold, 2px accent underline
- Even body rows: zebra-striped with the lighter purple (`--background-alt`)
- Thin row separators; wide tables scroll horizontally instead of breaking the layout

## Switching themes on a table

Markdown pipe-table syntax cannot carry a CSS class, so to use a variant you write the table as **raw HTML** in the post body. Micro.blog passes raw HTML in markdown straight through to the rendered page.

The variant classes go on the `<table>` element:

**Structural variants:**

| Class | Look |
|---|---|
| *(none)* | Default: accent header + zebra striping |
| `table-minimal` | Header rule + hairline row separators only, no zebra. Quietest, closest to prose. |
| `table-grid` | 1px borders around every cell, no zebra. Classic data table — best for number-heavy content. |
| `table-panel` | Dark rounded panel matching the code blocks (`#1a1b26`), mono headers. Reads as "data". |

**Color panels** — standout backgrounds that complement the purple theme, same rounded-panel structure as `table-panel`:

| Class | Palette |
|---|---|
| `table-midnight` | Dark navy panel (`#16213e`), light blue text, gold headers |
| `table-ember` | Deep maroon panel (theme `--accent-alt`), warm text, gold headers |
| `table-ocean` | Dark teal panel (`#0c3338`), pale aqua text, aqua headers |

## HTML table template

Copy-paste starting point — swap the class (or remove it for the default):

```html
<table class="table-grid">
  <thead>
    <tr>
      <th>Tool</th>
      <th>What It Solves</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong><a href="https://www.runatlantis.io/">Atlantis</a></strong></td>
      <td>PR-based workflow automation</td>
      <td>Teams that want a TACO-style PR workflow</td>
    </tr>
    <tr>
      <td><strong><a href="https://digger.dev/">Digger</a></strong></td>
      <td>Same PR workflow, runs in your CI</td>
      <td>Teams with secretless OIDC pipelines</td>
    </tr>
  </tbody>
</table>
```

Notes for HTML tables in markdown posts:

- Markdown inside a raw HTML block is **not** processed — use `<a>`, `<strong>`, `<code>` etc. inside cells, not `[]()` / `**` / backticks.
- Keep the `<thead>`/`<tbody>` structure; the zebra striping and last-row rules target `tbody`.
- Raw HTML also unlocks things pipe tables can't do: multi-line cell content, `colspan`/`rowspan`, multiple paragraphs per cell.

## Where the styles live

All table CSS is in `src/styles.css` (search for `/* Tables */`). The colors come from the theme tokens (`--accent`, `--background-alt`, and the code-block palette for `table-panel`), so palette changes propagate to tables automatically.

After editing table styles, run `pnpm build` and commit the rebuilt `static/css/styles.css` — Micro.blog serves the committed file. Pushing to GitHub is not enough: trigger a theme sync from your Micro.blog account (Design → Edit Custom Themes → open the theme → sync button). There is no local preview; verify on the live site afterwards.
