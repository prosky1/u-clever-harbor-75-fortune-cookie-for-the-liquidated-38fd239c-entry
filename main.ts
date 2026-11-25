// Fortune Cookie for the Liquidated Trader
// make.fun bounty: u-clever-harbor-75-fortune-cookie-for-the-liquidated-38fd239c
//
// The program writes exactly one fortune-cookie line to /output/entry.txt.
// The line is fixed: it was chosen for the judge's brief (a freshly
// liquidated crypto trader, reading at 3am, keeps the fortune that makes
// them laugh instead of cry) and must reach the judge byte-for-byte.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const FORTUNE =
  "Your next trade will be your best one. The cookie has no opinion on your leverage, only your timing.";

// The harness mounts the output directory at /output; honour an override
// when one is supplied so the program also runs locally for testing.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outputDir, "entry.txt");

// Runtime guard: the gate only accepts UTF-8 text of 1-160 characters,
// at most 20 words, one line. Refuse to write anything that would fail
// the gate instead of silently producing an invalid entry.
const words = FORTUNE.trim().split(/\s+/);
if (FORTUNE.length < 1 || FORTUNE.length > 160) {
  throw new Error(`fortune is ${FORTUNE.length} characters, gate needs 1-160`);
}
if (words.length > 20) {
  throw new Error(`fortune is ${words.length} words, limit is 20`);
}
if (FORTUNE.includes("\n") || FORTUNE.trim() !== FORTUNE) {
  throw new Error("fortune must be a single line with no surrounding whitespace");
}

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, FORTUNE, "utf8");

console.log(`wrote ${FORTUNE.length} characters (${words.length} words) to ${target}`);
