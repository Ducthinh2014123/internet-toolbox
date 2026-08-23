// Client-side image tools built on the Canvas 2D API, Image, and FileReader.
// These functions must only ever be *called* in the browser. They are safe
// to import from the shared tools registry (which is also read by server
// components for metadata) because none of the browser globals below run at
// module load time -- only when a function is invoked from a "use client"
// component such as FormTool.

type RunResult = string | { error: string };

function isFile(v: unknown): v is File {
  return typeof File !== "undefined" && v instanceof File;
}

function requireFile(values: Record<string, unknown>, key = "file"): File | { error: string } {
  const v = values[key];
  if (!isFile(v)) return { error: "Please choose an image file first." };
  return v;
}

function toNumber(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && v !== "" ? n : fallback;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this file as an image."));
    };
    img.src = url;
  });
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not supported in this browser.");
  return { canvas, ctx };
}

function mimeFromFormat(format: string): string {
  switch (format) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "png":
    default:
      return "image/png";
  }
}

function canvasToDataUrl(canvas: HTMLCanvasElement, format: string, qualityPercent?: number): string {
  const mime = mimeFromFormat(format);
  if (mime === "image/png") return canvas.toDataURL(mime);
  const q = typeof qualityPercent === "number" ? Math.min(1, Math.max(0.01, qualityPercent / 100)) : 0.92;
  return canvas.toDataURL(mime, q);
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("")}`;
}

// ---------------- Resize ----------------
export async function resizeImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const keepAspect = Boolean(values.keepAspect);
    let targetW = toNumber(values.width, img.naturalWidth);
    let targetH = toNumber(values.height, img.naturalHeight);
    if (targetW <= 0 || targetH <= 0) return { error: "Width and height must be greater than 0." };
    if (keepAspect) {
      const ratio = img.naturalWidth / img.naturalHeight;
      targetH = Math.max(1, Math.round(targetW / ratio));
    }
    const { canvas, ctx } = makeCanvas(targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return canvasToDataUrl(canvas, String(values.format ?? "png"), toNumber(values.quality, 92));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not resize this image." };
  }
}

// ---------------- Compress ----------------
export async function compressImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, 0, 0);
    return canvasToDataUrl(canvas, String(values.format ?? "jpeg"), toNumber(values.quality, 70));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not compress this image." };
  }
}

// ---------------- Format conversion ----------------
export async function convertImageFormat(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    if (String(values.format ?? "png") !== "png") {
      // Flatten transparency onto white for formats without alpha support.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    return canvasToDataUrl(canvas, String(values.format ?? "png"), toNumber(values.quality, 92));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not convert this image." };
  }
}

// ---------------- Crop ----------------
export async function cropImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const x = toNumber(values.x, 0);
    const y = toNumber(values.y, 0);
    const w = toNumber(values.width, img.naturalWidth);
    const h = toNumber(values.height, img.naturalHeight);
    if (w <= 0 || h <= 0) return { error: "Crop width and height must be greater than 0." };
    if (x < 0 || y < 0 || x + w > img.naturalWidth || y + h > img.naturalHeight) {
      return {
        error: `Crop area is outside the image bounds. This image is ${img.naturalWidth}\u00d7${img.naturalHeight}px.`,
      };
    }
    const { canvas, ctx } = makeCanvas(w, h);
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return canvasToDataUrl(canvas, String(values.format ?? "png"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not crop this image." };
  }
}

// ---------------- Base64 <-> Image ----------------
export async function imageToBase64(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve({ error: "Could not read this file." });
    reader.readAsDataURL(file);
  });
}

export async function base64ToImage(values: Record<string, unknown>): Promise<RunResult> {
  const raw = String(values.base64 ?? "").trim();
  if (!raw) return { error: "Paste a base64 string or data URI." };
  const mime = String(values.mimeType ?? "image/png");
  const dataUrl = raw.startsWith("data:") ? raw : `data:${mime};base64,${raw.replace(/\s+/g, "")}`;
  if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(dataUrl)) {
    return { error: "This does not look like a valid base64 image string." };
  }
  // Validate it actually decodes and renders as an image.
  try {
    await loadImageFromFile(await (await fetch(dataUrl)).blob() as unknown as File);
  } catch {
    return { error: "Could not decode this base64 string as an image." };
  }
  return dataUrl;
}

// ---------------- Color tools ----------------
export async function pickPixelColor(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const x = Math.round(toNumber(values.x, 0));
    const y = Math.round(toNumber(values.y, 0));
    if (x < 0 || y < 0 || x >= img.naturalWidth || y >= img.naturalHeight) {
      return { error: `Coordinates are outside the image bounds (${img.naturalWidth}\u00d7${img.naturalHeight}px).` };
    }
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, 0, 0);
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
    return `Hex: ${rgbToHex(r, g, b)}\nRGB: rgb(${r}, ${g}, ${b})\nRGBA: rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not read pixel color from this image." };
  }
}

export async function averageColor(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    // Downscale for performance; average color does not need full resolution.
    const sampleSize = 100;
    const { canvas, ctx } = makeCanvas(sampleSize, sampleSize);
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return `Hex: ${rgbToHex(r, g, b)}\nRGB: rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not compute the average color." };
  }
}

export async function extractColorPalette(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const sampleSize = 120;
    const { canvas, ctx } = makeCanvas(sampleSize, sampleSize);
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
    const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
    const step = 32; // quantize each channel into 8 buckets
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / step) * step;
      const g = Math.floor(data[i + 1] / step) * step;
      const b = Math.floor(data[i + 2] / step) * step;
      const key = `${r},${g},${b}`;
      const entry = buckets.get(key);
      if (entry) entry.count++;
      else buckets.set(key, { r, g, b, count: 1 });
    }
    const colorCount = Math.max(1, Math.min(12, Math.round(toNumber(values.colorCount, 6))));
    const top = [...buckets.values()].sort((a, b) => b.count - a.count).slice(0, colorCount);
    const total = data.length / 4;
    return top
      .map((c) => `${rgbToHex(c.r, c.g, c.b)} \u2014 ${((c.count / total) * 100).toFixed(1)}%`)
      .join("\n");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not extract a color palette." };
  }
}

// ---------------- Metadata ----------------
export async function imageMetadata(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(img.naturalWidth, img.naturalHeight) || 1;
    return [
      `File name: ${file.name}`,
      `File size: ${(file.size / 1024).toFixed(1)} KB`,
      `MIME type: ${file.type || "unknown"}`,
      `Dimensions: ${img.naturalWidth}\u00d7${img.naturalHeight}px`,
      `Aspect ratio: ${img.naturalWidth / divisor}:${img.naturalHeight / divisor}`,
      `Last modified: ${file.lastModified ? new Date(file.lastModified).toISOString() : "unknown"}`,
    ].join("\n");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not read this image's metadata." };
  }
}

// ---------------- Watermark ----------------
export async function watermarkImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  const text = String(values.text ?? "").trim();
  if (!text) return { error: "Enter watermark text." };
  try {
    const img = await loadImageFromFile(file);
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, 0, 0);
    const fontSize = Math.max(8, toNumber(values.fontSize, Math.round(img.naturalWidth / 20)));
    const opacity = Math.min(1, Math.max(0, toNumber(values.opacity, 60) / 100));
    const color = String(values.color ?? "#ffffff");
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    const metrics = ctx.measureText(text);
    const margin = fontSize * 0.6;
    const positions: Record<string, [number, number, CanvasTextAlign, CanvasTextBaseline]> = {
      "top-left": [margin, margin, "left", "top"],
      "top-right": [canvas.width - margin, margin, "right", "top"],
      "bottom-left": [margin, canvas.height - margin, "left", "bottom"],
      "bottom-right": [canvas.width - margin, canvas.height - margin, "right", "bottom"],
      center: [canvas.width / 2, canvas.height / 2, "center", "middle"],
    };
    const [px, py, align, baseline] = positions[String(values.position ?? "bottom-right")] ?? positions["bottom-right"];
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, px, py);
    void metrics;
    ctx.globalAlpha = 1;
    return canvasToDataUrl(canvas, String(values.format ?? "png"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not add a watermark to this image." };
  }
}

// ---------------- Rotate / Flip ----------------
export async function rotateFlipImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const rotate = ((toNumber(values.rotate, 0) % 360) + 360) % 360;
    const swapDims = rotate === 90 || rotate === 270;
    const w = swapDims ? img.naturalHeight : img.naturalWidth;
    const h = swapDims ? img.naturalWidth : img.naturalHeight;
    const { canvas, ctx } = makeCanvas(w, h);
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(values.flipH ? -1 : 1, values.flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    return canvasToDataUrl(canvas, String(values.format ?? "png"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not rotate/flip this image." };
  }
}

// ---------------- Filters ----------------
export async function applyImageFilter(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    const amount = toNumber(values.amount, 100);
    const filter = String(values.filter ?? "grayscale");
    const filterMap: Record<string, string> = {
      grayscale: `grayscale(${amount}%)`,
      sepia: `sepia(${amount}%)`,
      invert: `invert(${amount}%)`,
      blur: `blur(${amount / 10}px)`,
      brightness: `brightness(${amount}%)`,
      contrast: `contrast(${amount}%)`,
      saturate: `saturate(${amount}%)`,
    };
    // @ts-expect-error -- ctx.filter is supported by all evergreen browsers.
    ctx.filter = filterMap[filter] ?? "none";
    ctx.drawImage(img, 0, 0);
    return canvasToDataUrl(canvas, String(values.format ?? "png"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not apply this filter." };
  }
}

// ---------------- Pixelate ----------------
export async function pixelateImage(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const pixelSize = Math.max(1, Math.round(toNumber(values.pixelSize, 10)));
    const smallW = Math.max(1, Math.round(img.naturalWidth / pixelSize));
    const smallH = Math.max(1, Math.round(img.naturalHeight / pixelSize));
    const small = makeCanvas(smallW, smallH);
    small.ctx.drawImage(img, 0, 0, smallW, smallH);
    const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small.canvas, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);
    return canvasToDataUrl(canvas, String(values.format ?? "png"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not pixelate this image." };
  }
}

// ---------------- Favicon generator ----------------
export async function generateFavicon(values: Record<string, unknown>): Promise<RunResult> {
  const file = requireFile(values);
  if (!isFile(file)) return file;
  try {
    const img = await loadImageFromFile(file);
    const size = Math.max(16, Math.round(toNumber(values.size, 32)));
    // Crop to a centered square first so the favicon isn't stretched.
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;
    const { canvas, ctx } = makeCanvas(size, size);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    return canvasToDataUrl(canvas, "png");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not generate a favicon from this image." };
  }
}

// ---------------- SVG -> PNG ----------------
export async function svgToPng(values: Record<string, unknown>): Promise<RunResult> {
  const file = values.file;
  const svgText = String(values.svgText ?? "").trim();
  let source: string;
  if (isFile(file)) {
    source = await file.text();
  } else if (svgText) {
    source = svgText;
  } else {
    return { error: "Upload an SVG file or paste SVG markup." };
  }
  if (!/<svg[\s>]/i.test(source)) return { error: "This does not look like valid SVG markup." };
  try {
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not render this SVG."));
      el.src = url;
    });
    const width = Math.round(toNumber(values.width, img.naturalWidth || 512));
    const height = Math.round(toNumber(values.height, img.naturalHeight || 512));
    const { canvas, ctx } = makeCanvas(width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    return canvasToDataUrl(canvas, "png");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not convert this SVG to PNG." };
  }
}
