// Pure logic functions for Generators tools. No external dependencies.

const SIMILAR_CHARS = /[il1Lo0O]/g;

export function generatePassword(values: {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}): string {
  let charset = "";
  if (values.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (values.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (values.numbers) charset += "0123456789";
  if (values.symbols) charset += "!@#$%^&*()-_=+[]{};:,.<>?";
  if (values.excludeSimilar) charset = charset.replace(SIMILAR_CHARS, "");
  if (!charset) throw new Error("Select at least one character type");
  const length = Math.max(4, Math.min(values.length || 16, 256));
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => charset[b % charset.length]).join("");
}

export function generateApiKey(values: { prefix: string; length: number }): string {
  const bytes = new Uint8Array(Math.max(8, Math.min(values.length || 32, 128)));
  crypto.getRandomValues(bytes);
  const key = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return values.prefix ? `${values.prefix}_${key}` : key;
}

export function generateEnvFile(input: string): string {
  const lines = input.split("\n").map((l) => l.trim()).filter(Boolean);
  const out = lines.map((line) => {
    const idx = line.indexOf("=");
    if (idx === -1) return `${line.toUpperCase().replace(/\s+/g, "_")}=`;
    const key = line.slice(0, idx).trim().toUpperCase().replace(/\s+/g, "_");
    let value = line.slice(idx + 1).trim();
    if (/\s/.test(value) && !/^".*"$/.test(value)) value = `"${value}"`;
    return `${key}=${value}`;
  });
  return out.join("\n");
}

const GITIGNORE_PRESETS: Record<string, string> = {
  node: "node_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n.pnpm-debug.log*\ndist/\nbuild/\n.next/\nout/\ncoverage/",
  python: "__pycache__/\n*.py[cod]\n*.egg-info/\n.venv/\nvenv/\n.pytest_cache/\n.mypy_cache/\ndist/\nbuild/",
  java: "*.class\n*.jar\n*.war\ntarget/\n.gradle/\nbuild/",
  macos: ".DS_Store\n.AppleDouble\n.LSOverride\nIcon\r\n._*",
  windows: "Thumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/",
  vscode: ".vscode/*\n!.vscode/extensions.json",
  env: ".env\n.env.local\n.env.*.local",
  logs: "logs/\n*.log",
};

export function generateGitignore(values: { presets: string[] }): string {
  const selected = values.presets.length > 0 ? values.presets : ["node"];
  return selected
    .filter((p) => GITIGNORE_PRESETS[p])
    .map((p) => `# ${p[0].toUpperCase()}${p.slice(1)}\n${GITIGNORE_PRESETS[p]}`)
    .join("\n\n");
}

export function generateDockerfile(values: {
  baseImage: string;
  workdir: string;
  installCommand: string;
  copyCommand: string;
  runCommand: string;
  port: string;
  cmd: string;
}): string {
  const lines = [`FROM ${values.baseImage || "node:20-alpine"}`, "", `WORKDIR ${values.workdir || "/app"}`, ""];
  if (values.copyCommand) lines.push(values.copyCommand, "");
  if (values.installCommand) lines.push(`RUN ${values.installCommand}`, "");
  if (values.runCommand) lines.push(`RUN ${values.runCommand}`, "");
  if (values.port) lines.push(`EXPOSE ${values.port}`, "");
  lines.push(`CMD ${values.cmd || '["node", "index.js"]'}`);
  return lines.join("\n");
}

export function generateDockerCompose(values: {
  serviceName: string;
  image: string;
  ports: string;
  volumes: string;
  env: string;
}): string {
  const lines = ["version: \"3.8\"", "services:", `  ${values.serviceName || "app"}:`, `    image: ${values.image || "node:20-alpine"}`];
  const ports = values.ports.split("\n").map((l) => l.trim()).filter(Boolean);
  if (ports.length) {
    lines.push("    ports:");
    ports.forEach((p) => lines.push(`      - "${p}"`));
  }
  const volumes = values.volumes.split("\n").map((l) => l.trim()).filter(Boolean);
  if (volumes.length) {
    lines.push("    volumes:");
    volumes.forEach((v) => lines.push(`      - ${v}`));
  }
  const env = values.env.split("\n").map((l) => l.trim()).filter(Boolean);
  if (env.length) {
    lines.push("    environment:");
    env.forEach((e) => lines.push(`      - ${e}`));
  }
  return lines.join("\n");
}

export function generateNginxConfig(values: { serverName: string; listenPort: string; root: string; proxyPass: string }): string {
  const lines = ["server {", `    listen ${values.listenPort || "80"};`, `    server_name ${values.serverName || "example.com"};`, ""];
  if (values.proxyPass) {
    lines.push("    location / {", `        proxy_pass ${values.proxyPass};`, "        proxy_set_header Host $host;", "        proxy_set_header X-Real-IP $remote_addr;", "    }");
  } else {
    lines.push(`    root ${values.root || "/var/www/html"};`, "    index index.html;", "", "    location / {", "        try_files $uri $uri/ =404;", "    }");
  }
  lines.push("}");
  return lines.join("\n");
}

export function generateCorsHeaders(values: { origins: string; methods: string; headers: string; credentials: boolean }): string {
  const lines = [
    `Access-Control-Allow-Origin: ${values.origins || "*"}`,
    `Access-Control-Allow-Methods: ${values.methods || "GET, POST, PUT, DELETE, OPTIONS"}`,
    `Access-Control-Allow-Headers: ${values.headers || "Content-Type, Authorization"}`,
  ];
  if (values.credentials) lines.push("Access-Control-Allow-Credentials: true");
  return lines.join("\n");
}

export function generateCspHeader(values: {
  defaultSrc: string;
  scriptSrc: string;
  styleSrc: string;
  imgSrc: string;
  connectSrc: string;
}): string {
  const directives: [string, string][] = [
    ["default-src", values.defaultSrc || "'self'"],
    ["script-src", values.scriptSrc],
    ["style-src", values.styleSrc],
    ["img-src", values.imgSrc],
    ["connect-src", values.connectSrc],
  ];
  return `Content-Security-Policy: ${directives.filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join("; ")}`;
}

export function generateOgMetaTags(values: {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}): string {
  return [
    `<meta property="og:title" content="${values.title}" />`,
    `<meta property="og:description" content="${values.description}" />`,
    `<meta property="og:image" content="${values.image}" />`,
    `<meta property="og:url" content="${values.url}" />`,
    `<meta property="og:type" content="${values.type || "website"}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n");
}

export function generateSitemap(values: { urls: string; changefreq: string; priority: string }): string {
  const urls = values.urls.split("\n").map((u) => u.trim()).filter(Boolean);
  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u}</loc>\n    <changefreq>${values.changefreq || "weekly"}</changefreq>\n    <priority>${values.priority || "0.5"}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export function generateHtmlBoilerplate(values: { title: string; lang: string; includeViewport: boolean; cssHref: string }): string {
  const lines = ["<!DOCTYPE html>", `<html lang="${values.lang || "en"}">`, "<head>", '  <meta charset="UTF-8" />'];
  if (values.includeViewport) lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
  lines.push(`  <title>${values.title || "Document"}</title>`);
  if (values.cssHref) lines.push(`  <link rel="stylesheet" href="${values.cssHref}" />`);
  lines.push("</head>", "<body>", "  ", "</body>", "</html>");
  return lines.join("\n");
}

const CSS_RESETS: Record<string, string> = {
  minimal: "*, *::before, *::after {\n  box-sizing: border-box;\n}\n\nbody, h1, h2, h3, h4, p, figure {\n  margin: 0;\n}\n\nimg, picture {\n  max-width: 100%;\n  display: block;\n}",
  modern: "*, *::before, *::after {\n  box-sizing: border-box;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n}\n\nhtml, body {\n  height: 100%;\n}\n\nbody {\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\n\nimg, picture, video, canvas, svg {\n  display: block;\n  max-width: 100%;\n}\n\ninput, button, textarea, select {\n  font: inherit;\n}\n\np, h1, h2, h3, h4, h5, h6 {\n  overflow-wrap: break-word;\n}",
};

export function generateCssReset(style: string): string {
  return CSS_RESETS[style] ?? CSS_RESETS.minimal;
}

const FIRST_NAMES = ["An", "Binh", "Chau", "Duc", "Emma", "Felix", "Giang", "Hoa", "Ivy", "John", "Kate", "Linh", "Minh", "Nam", "Olivia"];
const LAST_NAMES = ["Nguyen", "Tran", "Le", "Pham", "Smith", "Johnson", "Vo", "Bui", "Dang", "Do"];
const DOMAINS = ["example.com", "mail.com", "test.org", "demo.net"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hslToHexLocal(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateColorPalette(values: { count: number; mode: string }): string {
  const count = Math.max(2, Math.min(values.count || 5, 20));
  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    let hue: number;
    let sat: number;
    let light: number;
    if (values.mode === "monochrome") {
      hue = baseHue;
      sat = 0.55;
      light = 0.2 + (i / (count - 1)) * 0.6;
    } else if (values.mode === "analogous") {
      hue = (baseHue + i * 20) % 360;
      sat = 0.55 + Math.random() * 0.2;
      light = 0.4 + Math.random() * 0.2;
    } else {
      hue = (baseHue + i * (360 / count)) % 360;
      sat = 0.5 + Math.random() * 0.3;
      light = 0.4 + Math.random() * 0.25;
    }
    colors.push(hslToHexLocal(hue, sat, light));
  }
  return colors.join("\n");
}

export function generateRandomData(values: { count: number; fields: string[]; format: string }): string {
  const count = Math.max(1, Math.min(values.count || 5, 500));
  const rows = Array.from({ length: count }, (_, i) => {
    const first = randomItem(FIRST_NAMES);
    const last = randomItem(LAST_NAMES);
    const row: Record<string, string | number> = {};
    if (values.fields.includes("id")) row.id = i + 1;
    if (values.fields.includes("name")) row.name = `${first} ${last}`;
    if (values.fields.includes("email")) row.email = `${first}.${last}${i}`.toLowerCase() + "@" + randomItem(DOMAINS);
    if (values.fields.includes("age")) row.age = 18 + Math.floor(Math.random() * 50);
    if (values.fields.includes("phone")) row.phone = `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    return row;
  });
  if (values.format === "csv") {
    const cols = Object.keys(rows[0] ?? {});
    const header = cols.join(",");
    const body = rows.map((r) => cols.map((c) => r[c]).join(",")).join("\n");
    return `${header}\n${body}`;
  }
  return JSON.stringify(rows, null, 2);
}
