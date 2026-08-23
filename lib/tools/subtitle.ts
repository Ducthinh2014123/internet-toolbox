// Pure logic functions for Subtitle & Data tools. No external dependencies.

type SrtCue = { index: number; start: string; end: string; text: string };

function timeToMs(t: string): number {
  const m = t.trim().match(/(\d+):(\d{2}):(\d{2})[.,](\d{3})/);
  if (!m) throw new Error(`Invalid SRT timestamp: "${t}"`);
  const [, h, min, s, ms] = m;
  return (Number(h) * 3600 + Number(min) * 60 + Number(s)) * 1000 + Number(ms);
}

function msToSrtTime(ms: number): string {
  const clamped = Math.max(0, Math.round(ms));
  const h = Math.floor(clamped / 3600000);
  const min = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  const msRem = clamped % 1000;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(msRem).padStart(3, "0")}`;
}

function msToVttTime(ms: number): string {
  return msToSrtTime(ms).replace(",", ".");
}

export function parseSrt(input: string): SrtCue[] {
  const blocks = input.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);
  const cues: SrtCue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.length > 0);
    if (lines.length < 2) continue;
    let idx = 0;
    let timeLineIdx = 0;
    if (/^\d+$/.test(lines[0].trim())) {
      idx = parseInt(lines[0].trim(), 10);
      timeLineIdx = 1;
    } else {
      idx = cues.length + 1;
    }
    const timeLine = lines[timeLineIdx];
    const timeMatch = timeLine.match(/(\d+:\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d+:\d{2}:\d{2}[.,]\d{3})/);
    if (!timeMatch) throw new Error(`Invalid SRT/VTT block near: "${block.slice(0, 40)}"`);
    const text = lines.slice(timeLineIdx + 1).join("\n");
    cues.push({ index: idx, start: timeMatch[1].replace(".", ","), end: timeMatch[2].replace(".", ","), text });
  }
  if (cues.length === 0) throw new Error("No valid subtitle cues found");
  return cues;
}

function serializeSrt(cues: SrtCue[]): string {
  return cues.map((c, i) => `${i + 1}\n${c.start} --> ${c.end}\n${c.text}`).join("\n\n") + "\n";
}

function serializeVtt(cues: SrtCue[]): string {
  const body = cues.map((c) => `${c.start.replace(",", ".")} --> ${c.end.replace(",", ".")}\n${c.text}`).join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}

export function srtFormat(input: string): string {
  return serializeSrt(parseSrt(input));
}

export function srtValidate(input: string): string {
  const cues = parseSrt(input);
  return `Valid SRT with ${cues.length} cue(s).`;
}

export function shiftSrtTimestamps(input: string, shiftMs: number): string {
  const cues = parseSrt(input);
  const shifted = cues.map((c) => ({
    ...c,
    start: msToSrtTime(timeToMs(c.start) + shiftMs),
    end: msToSrtTime(timeToMs(c.end) + shiftMs),
  }));
  return serializeSrt(shifted);
}

export function srtToText(input: string): string {
  const cues = parseSrt(input);
  return cues.map((c) => c.text).join("\n");
}

export function textToSrt(input: string, secondsPerLine: number): string {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) throw new Error("Enter at least one line of text");
  const durationMs = Math.max(500, (secondsPerLine || 3) * 1000);
  const cues: SrtCue[] = lines.map((text, i) => ({
    index: i + 1,
    start: msToSrtTime(i * durationMs),
    end: msToSrtTime((i + 1) * durationMs - 100),
    text,
  }));
  return serializeSrt(cues);
}

export function vttFormat(input: string): string {
  return serializeVtt(parseSrt(input.replace(/^WEBVTT\s*/i, "")));
}

export function srtToVtt(input: string): string {
  return serializeVtt(parseSrt(input));
}

export function vttToSrt(input: string): string {
  const cleaned = input.replace(/^WEBVTT[^\n]*\n/i, "");
  return serializeSrt(parseSrt(cleaned));
}

function parseCsvSimple(input: string): string[][] {
  return input
    .replace(/\r\n/g, "\n")
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function csvToMarkdownTable(input: string): string {
  const rows = parseCsvSimple(input);
  if (rows.length === 0) throw new Error("No CSV data provided");
  const [header, ...body] = rows;
  const headerLine = `| ${header.join(" | ")} |`;
  const separatorLine = `| ${header.map(() => "---").join(" | ")} |`;
  const bodyLines = body.map((r) => `| ${r.join(" | ")} |`);
  return [headerLine, separatorLine, ...bodyLines].join("\n");
}

export function textFileInfo(input: string): string {
  const bytes = new TextEncoder().encode(input).length;
  const lines = input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length;
  const words = input.trim().length === 0 ? 0 : input.trim().split(/\s+/).length;
  const chars = input.length;
  const hasBom = input.charCodeAt(0) === 0xfeff;
  return [
    `Size: ${bytes.toLocaleString()} bytes (UTF-8)`,
    `Characters: ${chars.toLocaleString()}`,
    `Words: ${words.toLocaleString()}`,
    `Lines: ${lines.toLocaleString()}`,
    `Encoding hint: ${hasBom ? "UTF-8 with BOM" : "UTF-8 (no BOM detected)"}`,
  ].join("\n");
}
