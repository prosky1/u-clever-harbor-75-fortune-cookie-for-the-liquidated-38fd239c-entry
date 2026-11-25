// Fortune Cookie for the Liquidated Trader
// make.fun bounty: u-clever-harbor-75-fortune-cookie-for-the-liquidated-38fd239c
//
// Writes exactly one fortune-cookie line to /output/entry.txt.
// The line is fixed: it is the TOP 1 pick for this bounty, chosen for
// the brief (a freshly liquidated crypto trader, reading at 3am, keeps
// the fortune that makes them laugh instead of cry) and must reach the
// judge byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const FORTUNE =
  "You will be reborn as a stablecoin. At last, one thing in your portfolio that stays put.";

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

// Read back what landed on disk and refuse to report success unless it
// is byte-identical to the chosen fortune — the judge reads this file,
// so a silent write error or encoding surprise must fail loudly here.
const written = readFileSync(target, "utf8");
if (written !== FORTUNE) {
  throw new Error("entry.txt on disk does not match the chosen fortune byte-for-byte");
}

console.log(`wrote ${FORTUNE.length} characters (${words.length} words) to ${target}`);
