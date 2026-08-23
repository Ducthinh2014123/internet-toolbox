// Pure logic functions for Network & IP tools. No external dependencies.

function parseIPv4(ip: string): number[] {
  const parts = ip.trim().split(".");
  if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p) || Number(p) > 255)) {
    throw new Error(`Invalid IPv4 address: "${ip}"`);
  }
  return parts.map(Number);
}

function ipToInt(ip: string): number {
  const [a, b, c, d] = parseIPv4(ip);
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

function intToIp(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(".");
}

function cidrToMask(bits: number): number {
  return bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
}

export function ipv4Calculator(input: string): string {
  const [ipPart, bitsPart] = input.trim().split("/");
  const bits = bitsPart !== undefined ? parseInt(bitsPart, 10) : 24;
  if (Number.isNaN(bits) || bits < 0 || bits > 32) throw new Error("CIDR prefix must be between 0 and 32");
  const ipInt = ipToInt(ipPart);
  const mask = cidrToMask(bits);
  const network = ipInt & mask;
  const broadcast = network | (~mask >>> 0);
  const totalHosts = 2 ** (32 - bits);
  const usableHosts = bits >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
  return [
    `Address: ${intToIp(ipInt)}`,
    `Network: ${intToIp(network)}/${bits}`,
    `Netmask: ${intToIp(mask)}`,
    `Wildcard mask: ${intToIp(~mask >>> 0)}`,
    `Broadcast: ${intToIp(broadcast)}`,
    `First usable host: ${bits >= 31 ? intToIp(network) : intToIp(network + 1)}`,
    `Last usable host: ${bits >= 31 ? intToIp(broadcast) : intToIp(broadcast - 1)}`,
    `Total addresses: ${totalHosts}`,
    `Usable hosts: ${usableHosts}`,
  ].join("\n");
}

export const subnetCalculator = ipv4Calculator;
export const cidrCalculator = ipv4Calculator;

export function ipv6Calculator(input: string): string {
  const raw = input.trim();
  const [addr, prefix] = raw.split("/");
  if (!addr.includes(":")) throw new Error("Enter a valid IPv6 address, e.g. 2001:db8::1");

  // Expand :: into full groups.
  let head = addr;
  let tail = "";
  if (addr.includes("::")) {
    const [h, t] = addr.split("::");
    head = h;
    tail = t ?? "";
  }
  const headParts = head ? head.split(":") : [];
  const tailParts = tail ? tail.split(":") : [];
  const missing = 8 - headParts.length - tailParts.length;
  if (addr.includes("::") && missing < 0) throw new Error("Invalid IPv6 address");
  const fullParts = addr.includes("::")
    ? [...headParts, ...Array(missing).fill("0"), ...tailParts]
    : headParts;
  if (fullParts.length !== 8) throw new Error("Invalid IPv6 address: expected 8 groups");
  const expanded = fullParts.map((p) => p.padStart(4, "0")).join(":");

  // Compress: find longest run of zero groups.
  const groups = fullParts.map((p) => parseInt(p || "0", 16).toString(16));
  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;
  groups.forEach((g, i) => {
    if (g === "0") {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
    } else {
      curStart = -1;
      curLen = 0;
    }
  });
  let compressed: string;
  if (bestLen > 1) {
    const before = groups.slice(0, bestStart).join(":");
    const after = groups.slice(bestStart + bestLen).join(":");
    compressed = `${before}::${after}`;
  } else {
    compressed = groups.join(":");
  }
  return [`Expanded: ${expanded}`, `Compressed: ${compressed}`, prefix ? `Prefix length: /${prefix}` : null]
    .filter(Boolean)
    .join("\n");
}

export function ipDecimalConverter(input: string): string {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) {
    return `Decimal ${trimmed} \u2192 IP ${intToIp(Number(trimmed))}`;
  }
  return `IP ${trimmed} \u2192 Decimal ${ipToInt(trimmed)}`;
}

export function ipBinaryConverter(input: string): string {
  const trimmed = input.trim();
  if (/^[01.\s]+$/.test(trimmed) && trimmed.includes(".")) {
    const octets = trimmed.split(".").map((b) => parseInt(b, 2));
    return `Binary ${trimmed} \u2192 IP ${octets.join(".")}`;
  }
  const octets = parseIPv4(trimmed);
  return `IP ${trimmed} \u2192 Binary ${octets.map((o) => o.toString(2).padStart(8, "0")).join(".")}`;
}

export function ipv4RangeCalculator(values: { start: string; end: string }): string {
  const startInt = ipToInt(values.start);
  const endInt = ipToInt(values.end);
  if (endInt < startInt) throw new Error("End IP must be greater than or equal to start IP");
  const count = endInt - startInt + 1;
  let bits = 32;
  for (let b = 32; b >= 0; b--) {
    const size = 2 ** (32 - b);
    if ((startInt & cidrToMask(b)) === startInt && size <= count) {
      bits = b;
      break;
    }
  }
  return [`Start: ${intToIp(startInt)}`, `End: ${intToIp(endInt)}`, `Total addresses: ${count}`, `Approx. CIDR: ${intToIp(startInt)}/${bits}`].join(
    "\n",
  );
}

export function formatMacAddress(input: string): string {
  const hex = input.trim().replace(/[^0-9a-fA-F]/g, "");
  if (hex.length !== 12) throw new Error("MAC address must contain 12 hex digits");
  const pairs = hex.match(/.{1,2}/g)!;
  return [
    `Colon: ${pairs.join(":").toLowerCase()}`,
    `Dash: ${pairs.join("-").toUpperCase()}`,
    `Dot (Cisco): ${[pairs.slice(0, 2).join(""), pairs.slice(2, 4).join(""), pairs.slice(4, 6).join("")].join(".").toLowerCase()}`,
    `Plain: ${hex.toLowerCase()}`,
  ].join("\n");
}

export function generateMacAddress(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  bytes[0] = (bytes[0] & 0xfe) | 0x02; // locally administered, unicast
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(":");
}

const WELL_KNOWN_PORTS: Record<number, string> = {
  20: "FTP (data)", 21: "FTP (control)", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
  67: "DHCP (server)", 68: "DHCP (client)", 80: "HTTP", 110: "POP3", 119: "NNTP", 123: "NTP",
  143: "IMAP", 161: "SNMP", 194: "IRC", 389: "LDAP", 443: "HTTPS", 445: "SMB", 465: "SMTPS",
  587: "SMTP (submission)", 636: "LDAPS", 993: "IMAPS", 995: "POP3S", 3306: "MySQL",
  3389: "RDP", 5432: "PostgreSQL", 5672: "AMQP", 5900: "VNC", 6379: "Redis", 6443: "Kubernetes API",
  8080: "HTTP (alt)", 8443: "HTTPS (alt)", 9200: "Elasticsearch", 27017: "MongoDB",
};

export function lookupPort(input: string): string {
  const port = parseInt(input.trim(), 10);
  if (Number.isNaN(port) || port < 0 || port > 65535) throw new Error("Enter a port number between 0 and 65535");
  const service = WELL_KNOWN_PORTS[port] ?? "Unknown / unregistered in this tool's list";
  const range = port < 1024 ? "Well-known port" : port < 49152 ? "Registered port" : "Dynamic / private port";
  return `Port ${port}: ${service}\nRange: ${range}`;
}

const BYTE_UNITS = ["bits", "Kb", "Mb", "Gb", "bytes", "KB", "MB", "GB", "TB"] as const;

export function bandwidthCalculator(values: { amount: number; fromUnit: string; durationSeconds: number }): string {
  const bitsPerSecondMap: Record<string, number> = { bits: 1, Kb: 1e3, Mb: 1e6, Gb: 1e9 };
  const bitsTotal = values.amount * (bitsPerSecondMap[values.fromUnit] ?? 1) * values.durationSeconds;
  const bytesTotal = bitsTotal / 8;
  return [
    `Total transferred: ${bitsTotal.toLocaleString()} bits (${bytesTotal.toLocaleString()} bytes)`,
    `\u2248 ${(bytesTotal / 1024).toFixed(2)} KB`,
    `\u2248 ${(bytesTotal / 1024 / 1024).toFixed(2)} MB`,
    `\u2248 ${(bytesTotal / 1024 / 1024 / 1024).toFixed(4)} GB`,
  ].join("\n");
}

export function downloadTimeCalculator(values: { fileSizeMB: number; speedMbps: number }): string {
  if (values.speedMbps <= 0) throw new Error("Speed must be greater than 0");
  const fileSizeBits = values.fileSizeMB * 8 * 1024 * 1024;
  const seconds = fileSizeBits / (values.speedMbps * 1_000_000);
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `Estimated download time: ${mins}m ${secs}s (${seconds.toFixed(1)} seconds total)`;
}

export function validateIpAddress(input: string): string {
  const trimmed = input.trim();
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m4 = trimmed.match(v4);
  if (m4 && m4.slice(1).every((p) => Number(p) <= 255)) return `${trimmed} is a valid IPv4 address`;
  if (/^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(trimmed) && trimmed.includes(":")) {
    return `${trimmed} looks like a valid IPv6 address`;
  }
  throw new Error(`"${trimmed}" is not a valid IPv4 or IPv6 address`);
}

export function networkByteCalculator(values: { amount: number; fromUnit: string }): string {
  const decimalUnits: Record<string, number> = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };
  const binaryUnits: Record<string, number> = { B: 1, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3, TiB: 1024 ** 4 };
  const table = { ...decimalUnits, ...binaryUnits };
  const bytes = values.amount * (table[values.fromUnit] ?? 1);
  return [
    `${bytes.toLocaleString()} bytes`,
    `${(bytes / 1e3).toFixed(4)} KB (decimal) / ${(bytes / 1024).toFixed(4)} KiB (binary)`,
    `${(bytes / 1e6).toFixed(4)} MB (decimal) / ${(bytes / 1024 ** 2).toFixed(4)} MiB (binary)`,
    `${(bytes / 1e9).toFixed(6)} GB (decimal) / ${(bytes / 1024 ** 3).toFixed(6)} GiB (binary)`,
  ].join("\n");
}

export function formatDnsRecord(values: { name: string; type: string; ttl: number; value: string; priority?: number }): string {
  const ttl = values.ttl || 3600;
  if (values.type === "MX") {
    return `${values.name}.\t${ttl}\tIN\tMX\t${values.priority ?? 10}\t${values.value}.`;
  }
  return `${values.name}.\t${ttl}\tIN\t${values.type}\t${values.value}`;
}
