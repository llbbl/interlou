// Generates metric-matched @font-face fallbacks so the system fallback font
// occupies the exact same box as the web font — eliminating the load-time
// "fat title that shrinks" layout shift (FOUT resize).
//
// Run: pnpm gen:fallback
// Then paste the printed @font-face blocks into src/styles.css and make sure
// the font stacks reference the fallback families:
//   --font-sans: "Rubik", "Rubik fallback", sans-serif;
//   --font-mono: "Roboto Mono", "Roboto Mono fallback", monospace;
//
// Metrics come from @capsizecss/metrics (bundled in fontaine) — no network,
// no font files needed. Re-run if the web fonts ever change.

import { getMetricsForFamily, generateFontFace } from 'fontaine'

const targets = [
  { family: 'Rubik', fallbackName: 'Rubik fallback', system: 'Arial' },
  { family: 'Roboto Mono', fallbackName: 'Roboto Mono fallback', system: 'Courier New' },
]

for (const { family, fallbackName, system } of targets) {
  const metrics = await getMetricsForFamily(family)
  const systemMetrics = await getMetricsForFamily(system)
  if (!metrics) {
    console.error(`!! no metrics found for "${family}" — skipped`)
    continue
  }
  const css = generateFontFace(metrics, {
    name: fallbackName,
    font: system,
    metrics: systemMetrics ?? undefined,
  })
  console.log(`/* ${family} → ${system}, metric-matched */`)
  console.log(css.trim())
  console.log('')
}
