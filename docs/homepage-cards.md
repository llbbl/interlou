# Homepage cards

The homepage renders regular blog posts as linked cards. This behavior is defined in `layouts/index.html`; single-post pages and specialized list pages continue to render full post content.

## How preview text is selected

Micro.blog supplies the post content to Hugo, but it does not generate a separate card description for this theme. Interlou derives the preview automatically from the post itself:

```go-html-template
{{ $excerpt := strings.Trim (.Plain | htmlUnescape) " \t\r\n" }}
...
<p class="p-summary post-card__excerpt">{{ $excerpt | truncate 240 }}</p>
```

The steps are:

1. Hugo renders the post content.
2. Hugo's [`Page.Plain`](https://gohugo.io/methods/page/plain/) method removes HTML tags, leaving readable text.
3. `htmlUnescape` converts entities such as `&amp;` back to their characters.
4. `strings.Trim` removes whitespace at the beginning and end.
5. Hugo's [`truncate`](https://gohugo.io/functions/strings/truncate/) function limits the result to 240 characters without cutting through a word. Longer previews end with an ellipsis.

Authors do not need to add front matter, a manual summary, or special Micro.blog metadata. The card always uses the beginning of the rendered post text. Interlou does not currently read Hugo's `.Summary`, so a manual `<!--more-->` divider does not control the card excerpt.

To change the maximum length for every card, update `truncate 240` in `layouts/index.html`.

## Titles and empty posts

- If a post has a title, the title appears above the excerpt.
- Titleless posts still receive a card and link normally.
- If a post has no plain text—for example, an image-only post—the card displays `Media post — open to view.`

## Images and social metadata

Images embedded in a post do not currently appear in homepage cards. `Page.Plain` removes the `<img>` element, and image attributes such as `src` and `alt` are not part of the text excerpt.

Micro.blog may also expose a post image through `.Params.images` and use it for Open Graph or Twitter card metadata. That social metadata is rendered in the document `<head>` and does not affect the homepage card body.

Supporting images inside homepage cards requires explicit theme logic. The theme would need to inspect the rendered `.Content` or Micro.blog's image parameters, choose an image, and render dedicated image markup and styles. It should also define whether an image near the start of a post is included while an image after the excerpt cutoff is ignored.

## Local layout preview

The tracked local preview includes titled, titleless, media-only, image-first, early-image, and image-last fixtures. Start it from the repository root:

```bash
pnpm preview
```

Then open <http://127.0.0.1:48137/>. The server runs with Bun and serves `preview/homepage-cards.html` using the generated `static/css/styles.css`, so run `pnpm build` first after changing source styles.
