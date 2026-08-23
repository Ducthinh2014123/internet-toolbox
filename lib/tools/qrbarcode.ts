// Client-side QR code and barcode generators, built on the already-installed
// "qrcode" and "jsbarcode" packages plus the Canvas 2D API. These functions
// must only ever be called in the browser (from "use client" components);
// the imports themselves are safe at module load time since neither package
// executes browser-only code until its generation function is called.

import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

type RunResult = string | { error: string };

function toNumber(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && v !== "" ? n : fallback;
}

function isFile(v: unknown): v is File {
  return typeof File !== "undefined" && v instanceof File;
}

type QrCommonOptions = {
  size?: number;
  margin?: number;
  errorCorrection?: string;
  darkColor?: string;
  lightColor?: string;
  format?: string;
};

async function renderQr(text: string, opts: QrCommonOptions): Promise<RunResult> {
  if (!text) return { error: "Nothing to encode. Fill in the fields above first." };
  const options = {
    errorCorrectionLevel: (opts.errorCorrection as "L" | "M" | "Q" | "H") || "M",
    margin: opts.margin ?? 2,
    width: opts.size ?? 300,
    color: {
      dark: opts.darkColor || "#000000",
      light: opts.lightColor || "#ffffff",
    },
  };
  try {
    if (opts.format === "svg") {
      return await QRCode.toString(text, { ...options, type: "svg" });
    }
    return await QRCode.toDataURL(text, options);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not generate a QR code for this input." };
  }
}

function commonOpts(values: Record<string, unknown>): QrCommonOptions {
  return {
    size: toNumber(values.size, 300),
    margin: toNumber(values.margin, 2),
    errorCorrection: String(values.errorCorrection ?? "M"),
    darkColor: String(values.darkColor ?? "#000000"),
    lightColor: String(values.lightColor ?? "#ffffff"),
    format: String(values.format ?? "png"),
  };
}

// ---------------- Plain text / URL QR ----------------
export async function generateQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const text = String(values.text ?? "").trim();
  return renderQr(text, commonOpts(values));
}

// ---------------- Wi-Fi QR ----------------
export async function generateWifiQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const ssid = String(values.ssid ?? "").trim();
  if (!ssid) return { error: "Enter a Wi-Fi network name (SSID)." };
  const password = String(values.password ?? "");
  const encryption = String(values.encryption ?? "WPA");
  const hidden = values.hidden ? "true" : "false";
  const escape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
  const payload =
    encryption === "nopass"
      ? `WIFI:T:nopass;S:${escape(ssid)};H:${hidden};;`
      : `WIFI:T:${encryption};S:${escape(ssid)};P:${escape(password)};H:${hidden};;`;
  return renderQr(payload, commonOpts(values));
}

// ---------------- vCard QR ----------------
export async function generateVCardQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const name = String(values.name ?? "").trim();
  if (!name) return { error: "Enter a name." };
  const phone = String(values.phone ?? "").trim();
  const email = String(values.email ?? "").trim();
  const org = String(values.organization ?? "").trim();
  const url = String(values.url ?? "").trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    org && `ORG:${org}`,
    phone && `TEL;TYPE=CELL:${phone}`,
    email && `EMAIL:${email}`,
    url && `URL:${url}`,
    "END:VCARD",
  ].filter(Boolean);
  return renderQr(lines.join("\n"), commonOpts(values));
}

// ---------------- Email / SMS / Phone QR ----------------
export async function generateEmailQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const to = String(values.to ?? "").trim();
  if (!to) return { error: "Enter a recipient email address." };
  const subject = encodeURIComponent(String(values.subject ?? ""));
  const body = encodeURIComponent(String(values.body ?? ""));
  const uri = `mailto:${to}?subject=${subject}&body=${body}`;
  return renderQr(uri, commonOpts(values));
}

export async function generateSmsQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const phone = String(values.phone ?? "").trim();
  if (!phone) return { error: "Enter a phone number." };
  const message = encodeURIComponent(String(values.message ?? ""));
  const uri = `smsto:${phone}:${message}`;
  return renderQr(uri, commonOpts(values));
}

export async function generatePhoneQrCode(values: Record<string, unknown>): Promise<RunResult> {
  const phone = String(values.phone ?? "").trim();
  if (!phone) return { error: "Enter a phone number." };
  return renderQr(`tel:${phone}`, commonOpts(values));
}

// ---------------- QR with logo overlay ----------------
export async function generateQrCodeWithLogo(values: Record<string, unknown>): Promise<RunResult> {
  const text = String(values.text ?? "").trim();
  if (!text) return { error: "Enter text or a URL to encode." };
  const opts = commonOpts(values);
  const size = opts.size ?? 300;
  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: opts.margin ?? 2,
      width: size,
      color: { dark: opts.darkColor || "#000000", light: opts.lightColor || "#ffffff" },
    });
    const logoFile = values.logo;
    if (!isFile(logoFile)) return qrDataUrl;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not supported in this browser.");

    const qrImg = await loadImage(qrDataUrl);
    ctx.drawImage(qrImg, 0, 0, size, size);

    const logoUrl = URL.createObjectURL(logoFile);
    const logoImg = await loadImage(logoUrl);
    URL.revokeObjectURL(logoUrl);

    const logoSizePercent = Math.min(35, Math.max(10, toNumber(values.logoSize, 20)));
    const logoSize = (size * logoSizePercent) / 100;
    const cx = (size - logoSize) / 2;
    const cy = (size - logoSize) / 2;
    // White backing so the logo stays legible over dark QR modules.
    const pad = logoSize * 0.08;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - pad, cy - pad, logoSize + pad * 2, logoSize + pad * 2);
    ctx.drawImage(logoImg, cx, cy, logoSize, logoSize);

    return canvas.toDataURL("image/png");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not generate a QR code with a logo." };
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load an image."));
    img.src = src;
  });
}

// ---------------- Batch QR grid ----------------
export async function generateQrBatch(values: Record<string, unknown>): Promise<RunResult> {
  const raw = String(values.lines ?? "");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12);
  if (lines.length === 0) return { error: "Enter at least one line of text (one QR code per line)." };
  try {
    const cellSize = 160;
    const labelHeight = 24;
    const cols = Math.min(4, lines.length);
    const rows = Math.ceil(lines.length / cols);
    const canvas = document.createElement("canvas");
    canvas.width = cols * cellSize;
    canvas.height = rows * (cellSize + labelHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not supported in this browser.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < lines.length; i++) {
      const dataUrl = await QRCode.toDataURL(lines[i], { errorCorrectionLevel: "M", margin: 1, width: cellSize - 16 });
      const img = await loadImage(dataUrl);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellSize + 8;
      const y = row * (cellSize + labelHeight) + 8;
      ctx.drawImage(img, x, y, cellSize - 16, cellSize - 16);
      ctx.fillStyle = "#000000";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      const label = lines[i].length > 20 ? `${lines[i].slice(0, 19)}\u2026` : lines[i];
      ctx.fillText(label, col * cellSize + cellSize / 2, row * (cellSize + labelHeight) + cellSize + 16);
    }
    return canvas.toDataURL("image/png");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not generate the batch of QR codes." };
  }
}

// ---------------- Barcode ----------------
export async function generateBarcode(values: Record<string, unknown>): Promise<RunResult> {
  const text = String(values.text ?? "").trim();
  if (!text) return { error: "Enter the value to encode as a barcode." };
  try {
    const canvas = document.createElement("canvas");
    let errorMessage: string | null = null;
    JsBarcode(canvas, text, {
      format: String(values.format ?? "CODE128"),
      width: toNumber(values.width, 2),
      height: toNumber(values.height, 100),
      displayValue: values.displayValue !== false,
      lineColor: String(values.lineColor ?? "#000000"),
      background: String(values.background ?? "#ffffff"),
      margin: toNumber(values.margin, 10),
      fontSize: 16,
      valid: (ok) => {
        if (!ok) errorMessage = `"${text}" is not a valid value for the ${values.format ?? "CODE128"} format.`;
      },
    });
    if (errorMessage) return { error: errorMessage };
    return canvas.toDataURL("image/png");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not generate this barcode." };
  }
}
