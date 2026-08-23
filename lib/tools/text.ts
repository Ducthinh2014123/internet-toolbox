// Pure logic functions for Text tools. No external dependencies.

export function wordCount(input: string): string {
  const words = input.trim().match(/\S+/g) ?? [];
  return `Words: ${words.length}`;
}

export function charCount(input: string): string {
  return `Characters (with spaces): ${input.length}\nCharacters (no spaces): ${input.replace(/\s/g, "").length}`;
}

export function lineCount(input: string): string {
  if (input.length === 0) return "Lines: 0";
  return `Lines: ${input.split(/\r\n|\r|\n/).length}`;
}

export function sentenceCount(input: string): string {
  const sentences = input.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter(Boolean);
  return `Sentences: ${sentences.length}`;
}

export function toUpperCase(input: string): string {
  return input.toUpperCase();
}
export function toLowerCase(input: string): string {
  return input.toLowerCase();
}
export function toTitleCase(input: string): string {
  return input.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}
export function toSentenceCase(input: string): string {
  const lower = input.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}
export function toCamelCase(input: string): string {
  const words = input.trim().split(/[\s_-]+/).filter(Boolean);
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}
export function toSnakeCase(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}
export function toKebabCase(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function removeDuplicateLines(input: string): string {
  const lines = input.split(/\r\n|\r|\n/);
  return Array.from(new Set(lines)).join("\n");
}

export function sortLinesAsc(input: string): string {
  return input.split(/\r\n|\r|\n/).sort((a, b) => a.localeCompare(b)).join("\n");
}
export function sortLinesDesc(input: string): string {
  return input.split(/\r\n|\r|\n/).sort((a, b) => b.localeCompare(a)).join("\n");
}

export function reverseLines(input: string): string {
  return input.split(/\r\n|\r|\n/).reverse().join("\n");
}

export function removeEmptyLines(input: string): string {
  return input
    .split(/\r\n|\r|\n/)
    .filter((l) => l.trim().length > 0)
    .join("\n");
}

export function removeExtraSpaces(input: string): string {
  return input
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n");
}

export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(
    " ",
  );

export function loremIpsum(paragraphs = 3): string {
  const out: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences: string[] = [];
    const sentenceCountForP = 3 + (p % 3);
    for (let s = 0; s < sentenceCountForP; s++) {
      const len = 8 + ((p + s) % 10);
      const words: string[] = [];
      for (let i = 0; i < len; i++) words.push(LOREM_WORDS[(p * 7 + s * 13 + i) % LOREM_WORDS.length]);
      const sentence = words.join(" ");
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".");
    }
    out.push(sentences.join(" "));
  }
  return out.join("\n\n");
}

export function reverseText(input: string): string {
  return input.split("").reverse().join("");
}

export function extractEmails(input: string): string {
  const matches = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ?? [];
  return Array.from(new Set(matches)).join("\n") || "No emails found.";
}

export function extractUrls(input: string): string {
  const matches = input.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
  return Array.from(new Set(matches)).join("\n") || "No URLs found.";
}

export function extractNumbers(input: string): string {
  const matches = input.match(/-?\d+(\.\d+)?/g) ?? [];
  return matches.join("\n") || "No numbers found.";
}

export function addLineNumbers(input: string): string {
  return input
    .split(/\r\n|\r|\n/)
    .map((l, i) => `${i + 1}. ${l}`)
    .join("\n");
}

export function repeatText(input: string, times: number): string {
  return Array.from({ length: Math.max(1, Math.min(times, 10000)) }, () => input).join("\n");
}

export function findAndReplace(input: string, find: string, replace: string, useRegex: boolean): string {
  if (!find) return input;
  if (useRegex) {
    return input.replace(new RegExp(find, "g"), replace);
  }
  return input.split(find).join(replace);
}

export function diffLines(a: string, b: string): string {
  const aLines = a.split(/\r\n|\r|\n/);
  const bLines = b.split(/\r\n|\r|\n/);
  const n = aLines.length;
  const m = bLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: string[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      out.push(`  ${aLines[i]}`);
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push(`- ${aLines[i]}`);
      i++;
    } else {
      out.push(`+ ${bLines[j]}`);
      j++;
    }
  }
  while (i < n) out.push(`- ${aLines[i++]}`);
  while (j < m) out.push(`+ ${bLines[j++]}`);
  return out.join("\n");
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const matches = w.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 0;
  if (w.endsWith("e") && count > 1) count--;
  return Math.max(1, count);
}

export function readabilityScore(input: string): string {
  const words = input.trim().match(/[A-Za-z']+/g) ?? [];
  const sentences = input.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter(Boolean);
  const wordCount = words.length || 1;
  const sentenceCount = sentences.length || 1;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschScore = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  const clamped = Math.max(0, Math.min(100, fleschScore));

  let level: string;
  if (clamped >= 90) level = "Very easy (5th grade)";
  else if (clamped >= 80) level = "Easy (6th grade)";
  else if (clamped >= 70) level = "Fairly easy (7th grade)";
  else if (clamped >= 60) level = "Standard (8th\u20139th grade)";
  else if (clamped >= 50) level = "Fairly difficult (10th\u201312th grade)";
  else if (clamped >= 30) level = "Difficult (college)";
  else level = "Very difficult (college graduate)";

  return [
    `Flesch Reading Ease: ${clamped.toFixed(1)}`,
    `Reading level: ${level}`,
    `Words: ${wordCount}`,
    `Sentences: ${sentenceCount}`,
    `Syllables: ${syllableCount}`,
    `Avg words/sentence: ${(wordCount / sentenceCount).toFixed(1)}`,
    `Avg syllables/word: ${(syllableCount / wordCount).toFixed(2)}`,
  ].join("\n");
}
