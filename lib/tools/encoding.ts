// Pure logic functions for Encoding & Crypto tools. No external dependencies
// besides the browser's built-in Web Crypto API (crypto.subtle / crypto.getRandomValues).

export function base64Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function base64Decode(input: string): string {
  const binary = atob(input.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input.replace(/\+/g, " "));
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const HTML_ENTITIES_REVERSE: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: "\u00a0",
};

export function htmlEntityEncode(input: string): string {
  return input.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

export function htmlEntityDecode(input: string): string {
  return input.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z0-9]+);/g, (match, code: string) => {
    if (code.startsWith("#x") || code.startsWith("#X")) {
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    }
    if (code.startsWith("#")) {
      return String.fromCodePoint(parseInt(code.slice(1), 10));
    }
    return HTML_ENTITIES_REVERSE[code] ?? match;
  });
}

export function decodeJwt(token: string): string {
  const parts = token.trim().split(".");
  if (parts.length < 2) throw new Error("Invalid JWT: expected header.payload(.signature)");
  const decodePart = (part: string) => {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(part.length + ((4 - (part.length % 4)) % 4), "=");
    return JSON.parse(base64Decode(padded));
  };
  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);
  return JSON.stringify({ header, payload, signature: parts[2] ?? null }, null, 2);
}

export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function sha(input: string, algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Pure-JS MD5 implementation (RFC 1321). No external dependency.
export function md5(input: string): string {
  function rotl(x: number, c: number) {
    return (x << c) | (x >>> (32 - c));
  }
  function toHex(num: number) {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += ((num >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return s;
  }
  const K = new Array(64).fill(0).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
    21,
  ];
  const bytes = Array.from(new TextEncoder().encode(input));
  const origLenBits = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push((origLenBits / 2 ** (8 * i)) & 0xff);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
    const M = new Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] =
        bytes[chunkStart + j * 4] |
        (bytes[chunkStart + j * 4 + 1] << 8) |
        (bytes[chunkStart + j * 4 + 2] << 16) |
        (bytes[chunkStart + j * 4 + 3] << 24);
    }
    let [A, B, C, D] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let F = 0, g = 0;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  return [a0, b0, c0, d0]
    .map(toHex)
    .join("")
    .replace(/(..)(..)(..)(..)/g, (m, a, b, c, d) => a + b + c + d);
}

export function randomToken(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomString(length = 24, charset = "alnum"): string {
  const sets: Record<string, string> = {
    alnum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    numeric: "0123456789",
    hex: "0123456789abcdef",
  };
  const chars = sets[charset] ?? sets.alnum;
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

function crc32(input: string): number {
  const bytes = new TextEncoder().encode(input);
  let table = crc32.table;
  if (!table) {
    table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
      table[n] = c >>> 0;
    }
    crc32.table = table;
  }
  let crc = 0xffffffff;
  for (const b of bytes) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
crc32.table = null as Uint32Array | null;

export function checksumCrc32(input: string): string {
  return crc32(input).toString(16).padStart(8, "0");
}

export function hexEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(" ");
}

export function hexDecode(input: string): string {
  const hex = input.trim().replace(/[^0-9a-fA-F]/g, "");
  if (hex.length % 2 !== 0) throw new Error("Hex string must have an even number of digits");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return new TextDecoder().decode(bytes);
}

export function binaryEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, "0")).join(" ");
}

export function binaryDecode(input: string): string {
  const groups = input.trim().split(/\s+/).filter(Boolean);
  const bytes = new Uint8Array(groups.length);
  groups.forEach((g, i) => {
    if (!/^[01]{1,8}$/.test(g)) throw new Error(`Invalid binary byte: "${g}"`);
    bytes[i] = parseInt(g, 2);
  });
  return new TextDecoder().decode(bytes);
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = "";
  let output = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, "0");
    output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  while (output.length % 8 !== 0) output += "=";
  return output;
}

export function base32Decode(input: string): string {
  const clean = input.trim().toUpperCase().replace(/=+$/, "");
  if (!/^[A-Z2-7]*$/.test(clean)) throw new Error("Input contains characters outside the Base32 alphabet (A-Z, 2-7).");
  let bits = "";
  for (const ch of clean) {
    const value = BASE32_ALPHABET.indexOf(ch);
    bits += value.toString(2).padStart(5, "0");
  }
  const byteCount = Math.floor(bits.length / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return new TextDecoder().decode(bytes);
}
