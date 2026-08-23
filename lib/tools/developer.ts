// Pure logic functions for a dependency-free subset of Developer & Code tools.
// XML/HTML formatting uses the browser's DOMParser/XMLSerializer when available
// and falls back to a simple string-based indenter in non-browser environments
// (e.g. server-side rendering or Node.js script verification).

export function jsonFormat(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, 2);
}

export function jsonMinify(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function jsonValidate(input: string): string {
  try {
    JSON.parse(input);
    return "Valid JSON";
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : "unknown error"}`);
  }
}

function yamlScalar(value: string): string {
  if (value === "") return '""';
  if (/^[\s]|[\s]$/.test(value) || /[:#\-?\[\]{}&*!|>'"%@`]/.test(value) || /^(true|false|null|~|[-+]?\d+(\.\d+)?)$/i.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

export function yamlValue(value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return yamlScalar(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        if (item !== null && typeof item === "object") {
          const inner = yamlValue(item, indent + 1).trimStart();
          return `${pad}- ${inner}`;
        }
        return `${pad}- ${yamlValue(item, indent + 1)}`;
      })
      .join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        if (v !== null && typeof v === "object" && Object.keys(v).length > 0) {
          return `${pad}${k}:\n${yamlValue(v, indent + 1)}`;
        }
        return `${pad}${k}: ${yamlValue(v, indent + 1)}`;
      })
      .join("\n");
  }
  return String(value);
}

export function jsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return yamlValue(parsed, 0);
}

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function flattenValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function jsonToCsv(input: string): string {
  const parsed = JSON.parse(input);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) return "";
  const columns = Array.from(
    rows.reduce((set: Set<string>, row) => {
      if (row && typeof row === "object") Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const header = columns.map(csvEscape).join(",");
  const body = rows
    .map((row) => columns.map((c) => csvEscape(flattenValue((row as Record<string, unknown>)?.[c]))).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const text = input.replace(/\r\n/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export function csvToJson(input: string): string {
  const rows = parseCsv(input);
  if (rows.length === 0) return "[]";
  const [header, ...body] = rows;
  const objects = body.map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

export function csvFormat(input: string): string {
  const rows = parseCsv(input);
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function tsvToCsv(input: string): string {
  const rows = input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split("\t"));
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

function indentXmlString(xml: string): string {
  const collapsed = xml.replace(/>\s+</g, "><").trim();
  const tokens = collapsed.match(/<[^>]+>|[^<]+/g) ?? [];
  let depth = 0;
  const lines: string[] = [];
  for (const token of tokens) {
    if (/^<\?/.test(token) || /^<!/.test(token)) {
      lines.push(token);
      continue;
    }
    if (/^<\//.test(token)) {
      depth = Math.max(0, depth - 1);
      lines.push("  ".repeat(depth) + token);
    } else if (/\/>$/.test(token)) {
      lines.push("  ".repeat(depth) + token);
    } else if (/^</.test(token)) {
      lines.push("  ".repeat(depth) + token);
      depth++;
    } else if (token.trim().length > 0) {
      lines.push("  ".repeat(depth) + token.trim());
    }
  }
  return lines.join("\n");
}

function hasDomParser(): boolean {
  return typeof DOMParser !== "undefined" && typeof XMLSerializer !== "undefined";
}

export function xmlValidate(input: string): string {
  if (hasDomParser()) {
    const doc = new DOMParser().parseFromString(input, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) throw new Error("Invalid XML: " + errorNode.textContent?.split("\n")[0]);
    return "Valid XML";
  }
  // Fallback: basic well-formedness check (balanced tags) for non-browser environments.
  const stack: string[] = [];
  const tagRe = /<\/?([a-zA-Z_][\w:.-]*)[^>]*?(\/?)>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(input))) {
    const [full, name, selfClose] = m;
    if (full.startsWith("<?") || full.startsWith("<!")) continue;
    if (selfClose === "/") continue;
    if (full.startsWith("</")) {
      if (stack.pop() !== name) throw new Error(`Invalid XML: mismatched closing tag </${name}>`);
    } else {
      stack.push(name);
    }
  }
  if (stack.length > 0) throw new Error(`Invalid XML: unclosed tag <${stack[stack.length - 1]}>`);
  return "Valid XML";
}

export function xmlFormat(input: string): string {
  xmlValidate(input);
  if (hasDomParser()) {
    const doc = new DOMParser().parseFromString(input, "application/xml");
    const serialized = new XMLSerializer().serializeToString(doc);
    return indentXmlString(serialized);
  }
  return indentXmlString(input);
}

export function htmlFormat(input: string): string {
  return indentXmlString(input);
}

export function regexTest(
  pattern: string,
  flags: string,
  text: string,
): string {
  const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = re.exec(text)) && guard < 10000) {
    matches.push(`Match ${matches.length + 1}: "${m[0]}" at index ${m.index}`);
    if (m[0].length === 0) re.lastIndex++;
    guard++;
  }
  if (matches.length === 0) return "No matches found.";
  return `${matches.length} match(es) found:\n\n` + matches.join("\n");
}

export function markdownToPlainText(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, "").trim())
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1 ($2)")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "\u2022 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function simpleMinifyCss(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

export function simpleMinifyHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Basic keyword-driven SQL formatter. Not a full SQL parser: it inserts line
// breaks before major clauses and uppercases known keywords, which covers
// the vast majority of everyday formatting needs without a heavy dependency.
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
  "INNER JOIN", "OUTER JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
  "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
  "ALTER TABLE", "DROP TABLE", "UNION", "UNION ALL", "AS", "NOT", "NULL", "IS", "IN",
  "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END",
];
const NEW_LINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "JOIN", "INSERT INTO", "VALUES",
  "UPDATE", "SET", "DELETE FROM", "UNION ALL", "UNION", "AND", "OR",
];

export function sqlFormat(input: string): string {
  let sql = input.replace(/\s+/g, " ").trim();
  const sorted = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    sql = sql.replace(re, kw);
  }
  const newlineSorted = [...NEW_LINE_BEFORE].sort((a, b) => b.length - a.length);
  for (const kw of newlineSorted) {
    const re = new RegExp(`\\s*\\b${kw.replace(/ /g, "\\s+")}\\b`, "g");
    sql = sql.replace(re, `\n${kw}`);
  }
  return sql
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

// Basic TOML formatter: normalizes spacing around "=" and blank lines
// between sections. Not a full TOML parser/validator.
export function tomlFormat(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || trimmed === "") return trimmed;
      if (/^\[.*\]$/.test(trimmed)) return trimmed;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return trimmed;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      return `${key} = ${value}`;
    })
    .join("\n");
}

// Basic GraphQL formatter: brace-based indentation, similar to the JSON/XML
// indenter above. Not a full GraphQL AST parser.
export function graphqlFormat(input: string): string {
  const collapsed = input.replace(/\s+/g, " ").trim();
  // First pass: split into raw segments at each "{" and "}", trimming each
  // segment's own text (but not re-adding indentation until the second pass).
  const rawLines: string[] = [];
  let current = "";
  for (let i = 0; i < collapsed.length; i++) {
    const c = collapsed[i];
    if (c === "{") {
      rawLines.push(`${current.trim()} {`.trim());
      current = "";
    } else if (c === "}") {
      if (current.trim().length > 0) rawLines.push(current.trim());
      rawLines.push("}");
      current = "";
    } else {
      current += c;
    }
  }
  if (current.trim().length > 0) rawLines.push(current.trim());

  // Second pass: apply indentation based on brace depth.
  let depth = 0;
  const indented: string[] = [];
  for (const line of rawLines) {
    if (line === "}") depth = Math.max(0, depth - 1);
    indented.push("  ".repeat(depth) + line);
    if (line.endsWith("{")) depth++;
  }
  return indented.filter((l) => l.trim().length > 0).join("\n");
}
