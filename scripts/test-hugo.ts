import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type RouteCheck = {
  path: string;
  includes: string[];
  excludes?: string[];
};

type MovieCardCheck = {
  path: string;
  permalink: string;
  includes: string[];
  excludes?: string[];
};

const root = resolve(import.meta.dir, "..");
const fixture = join(root, "testdata", "hugo-site");
const blankThemeFixture = join(root, "testdata", "microblog-theme-blank");
const themeName = "interlou";
const themeOverlayEntries = [
  "archetypes",
  "assets",
  "data",
  "i18n",
  "layouts",
  "static",
  "theme.toml",
  "plugin.json",
];

function argument(name: string, fallback?: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;

  if (value && !value.startsWith("--")) return value;
  if (fallback !== undefined && index < 0) return fallback;
  throw new Error(`Missing required value for argument: ${name}`);
}

function isAtLeastVersion(version: string, major: number, minor: number): boolean {
  const [actualMajor = 0, actualMinor = 0] = version.split(".").map(Number);
  return actualMajor > major || (actualMajor === major && actualMinor >= minor);
}

function copyIfPresent(source: string, destination: string): void {
  if (!existsSync(source)) return;
  cpSync(source, destination, { recursive: true, force: true });
}

function createMergedMicroBlogTheme(destination: string): void {
  cpSync(blankThemeFixture, destination, { recursive: true });

  for (const entry of themeOverlayEntries) {
    copyIfPresent(join(root, entry), join(destination, entry));
  }
}

function assertBaseofCopiesMatch(): void {
  const modernBaseof = join(root, "layouts", "baseof.html");
  const legacyBaseof = join(root, "layouts", "_default", "baseof.html");

  if (!existsSync(legacyBaseof)) {
    throw new Error(
      "Missing layouts/_default/baseof.html. It must stay byte-for-byte identical to layouts/baseof.html for Micro.blog Hugo 0.158 compatibility.",
    );
  }

  const modernContent = readFileSync(modernBaseof);
  const legacyContent = readFileSync(legacyBaseof);

  if (!modernContent.equals(legacyContent)) {
    throw new Error(
      "layouts/baseof.html and layouts/_default/baseof.html must be byte-for-byte identical for Micro.blog Hugo 0.158 compatibility. Update both copies together.",
    );
  }
}

function assertLinksPageUsesGenericPageTemplate(): void {
  const pathSpecificTemplates = [
    "layouts/links/all.html",
    "layouts/_partials/links.html",
  ];

  for (const templatePath of pathSpecificTemplates) {
    if (existsSync(join(root, templatePath))) {
      throw new Error(
        `${templatePath} must not exist. Micro.blog serves /links/ as a standalone page, so it must render through the generic page template instead of a path-specific links template.`,
      );
    }
  }
}

function assertIndexUsesInterlouBase(publicDir: string): void {
  const outputPath = join(publicDir, "index.html");
  const output = readFileSync(outputPath, "utf8");

  const requiredMarkers = [
    `class="wrapper"`,
    `class="site-header"`,
    `class="page-content"`,
  ];

  for (const marker of requiredMarkers) {
    if (!output.includes(marker)) {
      throw new Error(`index.html is missing Interlou base wrapper marker: ${marker}`);
    }
  }

  if (!/<link rel="stylesheet" href="\/css\/styles\.css\?v=\d+">/.test(output)) {
    throw new Error("index.html is missing Interlou stylesheet link: /css/styles.css?v=<timestamp>");
  }

  const blankMarkers = [`data-microblog-blank-baseof`, `microblog-blank-wrapper`];
  for (const marker of blankMarkers) {
    if (output.includes(marker)) {
      throw new Error(`index.html unexpectedly used Micro.blog Blank base wrapper marker: ${marker}`);
    }
  }
}

const hugoArgument = argument("--hugo", process.env.HUGO_BIN ?? "hugo");
const hugoBin = hugoArgument.includes("/") ? resolve(hugoArgument) : hugoArgument;
const expectedVersion = argument("--expected-version", "0.158.0");
const config = argument("--config", "hugo.toml");

const versionResult = spawnSync(hugoBin, ["version"], { encoding: "utf8" });
if (versionResult.error) {
  throw new Error(`Unable to run ${hugoBin}: ${versionResult.error.message}`);
}
if (versionResult.status !== 0) {
  throw new Error(
    `Unable to run ${hugoBin}: ${versionResult.stderr || versionResult.stdout || `exit ${versionResult.status}`}`,
  );
}

const versionOutput = `${versionResult.stdout}${versionResult.stderr}`.trim();
if (!versionOutput.includes(`v${expectedVersion}`)) {
  throw new Error(`Expected Hugo ${expectedVersion}, received: ${versionOutput}`);
}

const workspace = mkdtempSync(join(tmpdir(), "interlou-hugo-"));
const site = join(workspace, "site");
const themes = join(workspace, "themes");
const publicDir = join(site, "public");

const routeChecks: RouteCheck[] = [
  {
    path: "index.html",
    includes: ["post-card-grid", "Titled fixture post", "A very short note."],
    excludes: ["Link roundup", "END-OF-LONG-POST", "Moon", "Super Size Me", "Mystery Feature"],
  },
  {
    path: "page/2/index.html",
    includes: ["post-card-grid", "Image-first post", "Media post — open to view."],
  },
  {
    path: "page/3/index.html",
    includes: ["post-card-grid", "Older fixture post"],
  },
  {
    path: "2026/07/06/titled-fixture-post/index.html",
    includes: ["h-entry post", "Titled fixture post", "page-content--single", "END-OF-LONG-POST", "microblog_conversation"],
  },
  {
    path: "2026/07/05/short-note/index.html",
    includes: ["h-entry post", "A very short note."],
    excludes: ["p-name"],
  },
  {
    path: "2026/07/04/image-first-post/index.html",
    includes: ["fixture-image.jpg", "og:image", "twitter:image"],
  },
  {
    path: "archive/index.html",
    includes: ["category-summary", "Browse all categories", "archive-feed", "Moon (2009)", "Super Size Me (2004)", "Mystery Feature"],
  },
  {
    path: "categories/index.html",
    includes: ["category-directory", "data-category-filter", "Writing ✨"],
  },
  {
    path: "categories/development/index.html",
    includes: ["Development", "post-list", "Titled fixture post"],
    excludes: ["movie-card-grid", "Moon (2009)"],
  },
  {
    path: "categories/writing-/index.html",
    includes: ["Writing ✨", "post-list", "Titled fixture post"],
  },
  {
    path: "links/index.html",
    includes: ["links-header", "Bookmarks and interesting finds from around the web.", "link-cards"],
    excludes: ["Logan Links", "Link roundup"],
  },
  {
    path: "posts/index.html",
    includes: ["post-list", "Titled fixture post", "A very short note."],
    excludes: ["Link roundup", "Moon (2009)", "Super Size Me (2004)", "Mystery Feature"],
  },
  {
    path: "categories/movies/index.html",
    includes: ["movie-library", "movie-card-grid", "Moon", "Super Size Me", "Flickchart rank #42", "Flickchart rank #173", "Poster unavailable", "Older"],
    excludes: ["Mystery Feature", "Year unavailable"],
  },
  {
    path: "categories/movies/page/2/index.html",
    includes: ["movie-library", "movie-card-grid", "Mystery Feature", "Year unavailable", "Newer"],
    excludes: ["Moon", "Super Size Me", "Flickchart rank #"],
  },
  {
    path: "replies/index.html",
    includes: ["replies-list", "View conversation"],
  },
  {
    path: "photos/index.html",
    includes: ["photos-grid", "fixture-image.jpg", "photo-modal"],
  },
  {
    path: "index.xml",
    includes: ["<rss", "Titled fixture post"],
  },
  {
    path: "css/styles.css",
    includes: [".post-card-grid", ".category-directory", ".movie-card-grid", ".movie-card__poster"],
  },
];

const movieCardChecks: MovieCardCheck[] = [
  {
    path: "categories/movies/index.html",
    permalink: "https://example.test/2026/07/09/movie-complete/",
    includes: [
      "moon-poster.jpg",
      "alt=\"Poster for Moon\"",
      "Flickchart rank #42",
      "https://letterboxd.com/film/moon/",
      "https://www.themoviedb.org/movie/17431",
      "https://www.flickchart.com/movie/moon-2009",
    ],
    excludes: ["Poster unavailable", "Year unavailable"],
  },
  {
    path: "categories/movies/index.html",
    permalink: "https://example.test/2026/07/08/movie-missing-poster/",
    includes: [
      "Poster unavailable for Super Size Me",
      "Flickchart rank #173",
      "https://letterboxd.com/film/super-size-me/",
    ],
    excludes: ["<img", "movie-review-link--tmdb", "movie-review-link--flickchart"],
  },
  {
    path: "categories/movies/page/2/index.html",
    permalink: "https://example.test/2026/07/07/movie-missing-year/",
    includes: [
      "mystery-feature-poster.jpg",
      "alt=\"Poster for Mystery Feature\"",
      "Year unavailable",
      "https://www.themoviedb.org/movie/999999",
    ],
    excludes: ["Flickchart rank #", "movie-review-link--letterboxd", "movie-review-link--flickchart"],
  },
];

function movieCardMarkup(output: string, permalink: string): string {
  const cards = output.match(/<li class="h-entry movie-card">[\s\S]*?<\/li>/g) ?? [];
  const card = cards.find((candidate) => candidate.includes(`href="${permalink}"`));
  if (!card) throw new Error(`Unable to find movie card for ${permalink}`);
  return card;
}

try {
  assertBaseofCopiesMatch();
  assertLinksPageUsesGenericPageTemplate();
  cpSync(fixture, site, { recursive: true });
  mkdirSync(themes, { recursive: true });
  createMergedMicroBlogTheme(join(themes, themeName));

  const targetIsModern = isAtLeastVersion(expectedVersion, 0, 146);
  const buildArgs = [
    "--source",
    site,
    "--themesDir",
    themes,
    "--theme",
    themeName,
    "--config",
    config,
    "--destination",
    publicDir,
    "--cleanDestinationDir",
    "--environment",
    "production",
  ];

  if (targetIsModern) {
    buildArgs.push("--logLevel", "info", "--printPathWarnings", "--panicOnWarning");
  }

  const build = spawnSync(hugoBin, buildArgs, {
    cwd: site,
    encoding: "utf8",
    env: { ...process.env, HUGO_CACHEDIR: join(workspace, "cache") },
  });
  const buildOutput = `${build.stdout}${build.stderr}`;

  if (build.status !== 0) {
    throw new Error(`Hugo build failed:\n${buildOutput}`);
  }

  if (/deprecated/i.test(buildOutput)) {
    throw new Error(`Hugo reported a deprecation:\n${buildOutput}`);
  }

  if (/^(WARN|ERROR)\s/m.test(buildOutput)) {
    throw new Error(`Hugo reported a warning or error:\n${buildOutput}`);
  }

  for (const check of routeChecks) {
    const outputPath = join(publicDir, check.path);
    if (!existsSync(outputPath)) {
      throw new Error(`Expected generated route: ${check.path}`);
    }

    const output = readFileSync(outputPath, "utf8");
    for (const marker of check.includes) {
      if (!output.includes(marker)) {
        throw new Error(`${check.path} is missing marker: ${marker}`);
      }
    }
    for (const marker of check.excludes ?? []) {
      if (output.includes(marker)) {
        throw new Error(`${check.path} unexpectedly includes marker: ${marker}`);
      }
    }
  }

  for (const check of movieCardChecks) {
    const output = readFileSync(join(publicDir, check.path), "utf8");
    const card = movieCardMarkup(output, check.permalink);
    for (const marker of check.includes) {
      if (!card.includes(marker)) {
        throw new Error(`${check.path} card ${check.permalink} is missing marker: ${marker}`);
      }
    }
    for (const marker of check.excludes ?? []) {
      if (card.includes(marker)) {
        throw new Error(`${check.path} card ${check.permalink} unexpectedly includes marker: ${marker}`);
      }
    }
  }

  assertIndexUsesInterlouBase(publicDir);

  console.log(`Hugo ${expectedVersion} fixture passed (${routeChecks.length} routes).`);
  console.log(`Binary: ${basename(hugoBin)} (${dirname(hugoBin)})`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
