import {
  Code2,
  Lock,
  Type,
  Image as ImageIcon,
  QrCode,
  Clock,
  Globe,
  Network,
  Wand2,
  FileText,
} from "lucide-react";
import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  { slug: "developer", name: "Developer & Code", description: "Format, validate and transform code", icon: Code2 },
  { slug: "encoding", name: "Encoding & Crypto", description: "Encode, decode, hash and generate", icon: Lock },
  { slug: "text", name: "Text", description: "Count, clean and transform text", icon: Type },
  { slug: "image", name: "Image", description: "Resize, convert and inspect images", icon: ImageIcon },
  { slug: "qr-barcode", name: "QR & Barcode", description: "Generate scannable codes", icon: QrCode },
  { slug: "datetime", name: "Date & Time", description: "Convert and calculate dates", icon: Clock },
  { slug: "web", name: "Web & URL", description: "Parse and inspect web data", icon: Globe },
  { slug: "network", name: "Network & IP", description: "Calculate and validate networking data", icon: Network },
  { slug: "generators", name: "Generators", description: "Generate configs, secrets and boilerplate", icon: Wand2 },
  { slug: "subtitle-data", name: "Subtitle & Data", description: "Work with subtitles and structured data", icon: FileText },
];

export function getCategory(slug: CategorySlug): Category {
  const found = categories.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category: ${slug}`);
  return found;
}
