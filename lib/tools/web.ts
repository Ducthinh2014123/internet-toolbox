// Pure logic functions for Web & URL tools. No external dependencies.

export function parseUrl(input: string): string {
  const url = new URL(input.trim());
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => (params[key] = value));
  return JSON.stringify(
    {
      href: url.href,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port || null,
      pathname: url.pathname,
      search: url.search || null,
      hash: url.hash || null,
      queryParams: params,
    },
    null,
    2,
  );
}

export function parseQueryString(input: string): string {
  const trimmed = input.trim().replace(/^\?/, "");
  const params = new URLSearchParams(trimmed);
  const obj: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    if (obj[key] === undefined) obj[key] = value;
    else if (Array.isArray(obj[key])) (obj[key] as string[]).push(value);
    else obj[key] = [obj[key] as string, value];
  });
  return JSON.stringify(obj, null, 2);
}

export function generateQueryString(input: string): string {
  const obj = JSON.parse(input) as Record<string, unknown>;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else if (value !== null && value !== undefined) params.append(key, String(value));
  }
  return params.toString();
}

const TRACKING_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
  "fbclid", "gclid", "msclkid", "mc_eid", "mc_cid", "igshid", "ref", "ref_src", "si",
];

export function cleanUrl(input: string): string {
  const url = new URL(input.trim());
  TRACKING_PARAMS.forEach((p) => url.searchParams.delete(p));
  const search = url.searchParams.toString();
  return `${url.origin}${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
}

const STATUS_CODES: Record<number, string> = {
  100: "Continue", 101: "Switching Protocols", 200: "OK", 201: "Created", 202: "Accepted",
  204: "No Content", 206: "Partial Content", 301: "Moved Permanently", 302: "Found",
  303: "See Other", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
  400: "Bad Request", 401: "Unauthorized", 402: "Payment Required", 403: "Forbidden",
  404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable", 408: "Request Timeout",
  409: "Conflict", 410: "Gone", 411: "Length Required", 412: "Precondition Failed",
  413: "Payload Too Large", 414: "URI Too Long", 415: "Unsupported Media Type",
  418: "I'm a teapot", 422: "Unprocessable Entity", 429: "Too Many Requests",
  500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway",
  503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported",
};

export function lookupStatusCode(code: string): string {
  const num = parseInt(code.trim(), 10);
  if (Number.isNaN(num)) throw new Error("Enter a numeric HTTP status code, e.g. 404");
  const name = STATUS_CODES[num];
  if (!name) return `${num}: Unknown / non-standard status code`;
  const category =
    num < 200 ? "Informational" : num < 300 ? "Success" : num < 400 ? "Redirection" : num < 500 ? "Client Error" : "Server Error";
  return `${num} ${name}\nCategory: ${category}`;
}

const MIME_TYPES: Record<string, string> = {
  html: "text/html", htm: "text/html", css: "text/css", js: "text/javascript", mjs: "text/javascript",
  json: "application/json", xml: "application/xml", txt: "text/plain", csv: "text/csv",
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", svg: "image/svg+xml",
  webp: "image/webp", avif: "image/avif", ico: "image/x-icon", bmp: "image/bmp",
  pdf: "application/pdf", zip: "application/zip", gz: "application/gzip", tar: "application/x-tar",
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", mp4: "video/mp4", webm: "video/webm",
  woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
  doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  yaml: "application/x-yaml", yml: "application/x-yaml", md: "text/markdown", wasm: "application/wasm",
};

export function lookupMimeType(input: string): string {
  const ext = input.trim().replace(/^\./, "").toLowerCase();
  const mime = MIME_TYPES[ext];
  if (!mime) throw new Error(`No known MIME type for extension ".${ext}"`);
  return `.${ext} \u2192 ${mime}`;
}

export function parseUserAgent(ua: string): string {
  const s = ua.trim();
  let browser = "Unknown";
  let browserVersion = "";
  const browserPatterns: Array<[RegExp, string]> = [
    [/Edg\/([\d.]+)/, "Microsoft Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/CriOS\/([\d.]+)/, "Chrome (iOS)"],
    [/FxiOS\/([\d.]+)/, "Firefox (iOS)"],
    [/Firefox\/([\d.]+)/, "Firefox"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ];
  for (const [re, name] of browserPatterns) {
    const m = s.match(re);
    if (m) {
      browser = name;
      browserVersion = m[1];
      break;
    }
  }
  let os = "Unknown";
  if (/Windows NT 10/.test(s)) os = "Windows 10/11";
  else if (/Windows NT/.test(s)) os = "Windows";
  else if (/Mac OS X/.test(s)) os = "macOS";
  else if (/Android/.test(s)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(s)) os = "iOS";
  else if (/Linux/.test(s)) os = "Linux";
  const isMobile = /Mobi|Android|iPhone|iPad/.test(s);
  return JSON.stringify({ browser, browserVersion, os, deviceType: isMobile ? "Mobile" : "Desktop", raw: s }, null, 2);
}

export function parseHttpHeaders(input: string): string {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const headers: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    headers[key] = value;
  }
  if (Object.keys(headers).length === 0) throw new Error("Paste headers in \"Key: Value\" format, one per line");
  return JSON.stringify(headers, null, 2);
}

export function generateDataUri(text: string, mimeType: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return `data:${mimeType || "text/plain"};base64,${btoa(binary)}`;
}

export function decodeDataUri(input: string): string {
  const match = input.trim().match(/^data:([^;,]*)(;base64)?,(.*)$/s);
  if (!match) throw new Error("Not a valid data URI");
  const [, mime, isBase64, data] = match;
  if (isBase64) {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return `MIME type: ${mime || "text/plain"}\n\n${new TextDecoder().decode(bytes)}`;
  }
  return `MIME type: ${mime || "text/plain"}\n\n${decodeURIComponent(data)}`;
}

export function previewOpenGraph(html: string): string {
  const get = (prop: string) => {
    const re = new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`, "i");
    const reAlt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`, "i");
    const m = html.match(re) || html.match(reAlt);
    return m ? m[1] : null;
  };
  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const result = {
    "og:title": get("title") ?? (titleTag ? titleTag[1] : null),
    "og:description": get("description"),
    "og:image": get("image"),
    "og:url": get("url"),
    "og:type": get("type"),
    "og:site_name": get("site_name"),
  };
  return JSON.stringify(result, null, 2);
}

export function faviconCandidates(domainOrUrl: string): string {
  let host = domainOrUrl.trim();
  try {
    host = new URL(host.includes("://") ? host : "https://" + host).host;
  } catch {
    throw new Error("Enter a valid domain, e.g. example.com");
  }
  return [
    "https://" + host + "/favicon.ico",
    "https://" + host + "/favicon.png",
    "https://www.google.com/s2/favicons?domain=" + host + "&sz=128",
    "https://icons.duckduckgo.com/ip3/" + host + ".ico",
  ].join("\n");
}

export function generateWebManifest(values: {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  startUrl: string;
  display: string;
}): string {
  return JSON.stringify(
    {
      name: values.name || "My App",
      short_name: values.shortName || values.name || "App",
      start_url: values.startUrl || "/",
      display: values.display || "standalone",
      background_color: values.backgroundColor || "#ffffff",
      theme_color: values.themeColor || "#000000",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  );
}

export function generateRobotsTxt(values: { allowAll: boolean; disallowPaths: string; sitemapUrl: string }): string {
  const lines = ["User-agent: *"];
  if (values.allowAll) {
    lines.push("Allow: /");
  }
  const disallows = values.disallowPaths
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  disallows.forEach((path) => lines.push(`Disallow: ${path}`));
  if (values.sitemapUrl) lines.push("", `Sitemap: ${values.sitemapUrl}`);
  return lines.join("\n");
}

export function buildUtmLink(values: {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}): string {
  const base = values.baseUrl.trim();
  if (!base) throw new Error("Enter a destination URL.");
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    throw new Error("Enter a valid absolute URL, e.g. https://example.com/page");
  }
  if (values.source.trim()) url.searchParams.set("utm_source", values.source.trim());
  if (values.medium.trim()) url.searchParams.set("utm_medium", values.medium.trim());
  if (values.campaign.trim()) url.searchParams.set("utm_campaign", values.campaign.trim());
  if (values.term?.trim()) url.searchParams.set("utm_term", values.term.trim());
  if (values.content?.trim()) url.searchParams.set("utm_content", values.content.trim());
  return url.toString();
}

export function browserInfoSnapshot(): string {
  if (typeof navigator === "undefined") throw new Error("Browser information is only available in the browser");
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return JSON.stringify(
    {
      userAgent: nav.userAgent,
      language: nav.language,
      languages: nav.languages,
      platform: nav.platform,
      cookiesEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      screen: typeof screen !== "undefined" ? { width: screen.width, height: screen.height, colorDepth: screen.colorDepth } : null,
      viewport: typeof window !== "undefined" ? { width: window.innerWidth, height: window.innerHeight } : null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    null,
    2,
  );
}
