import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type RouteCheck = {
  path: string;
  includes: string[];
  excludes?: string[];
};

const root = resolve(import.meta.dir, "..");
const fixture = join(root, "testdata", "hugo-site");

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
    excludes: ["Link roundup", "END-OF-LONG-POST"],
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
    includes: ["category-summary", "Browse all categories", "archive-feed"],
  },
  {
    path: "categories/index.html",
    includes: ["category-directory", "data-category-filter", "Writing ✨"],
  },
  {
    path: "categories/development/index.html",
    includes: ["Development", "post-list", "Titled fixture post"],
  },
  {
    path: "categories/writing-/index.html",
    includes: ["Writing ✨", "post-list", "Titled fixture post"],
  },
  {
    path: "links/index.html",
    includes: ["Logan Links", "Link roundup"],
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
    includes: [".post-card-grid", ".category-directory"],
  },
];

try {
  cpSync(fixture, site, { recursive: true });
  mkdirSync(themes, { recursive: true });
  symlinkSync(root, join(themes, "interlou"), process.platform === "win32" ? "junction" : "dir");

  const targetIsModern = isAtLeastVersion(expectedVersion, 0, 146);
  const buildArgs = [
    "--source",
    site,
    "--themesDir",
    themes,
    "--theme",
    "interlou",
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

  console.log(`Hugo ${expectedVersion} fixture passed (${routeChecks.length} routes).`);
  console.log(`Binary: ${basename(hugoBin)} (${dirname(hugoBin)})`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
