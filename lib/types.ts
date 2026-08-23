import type { LucideIcon } from "lucide-react";

export type CategorySlug =
  | "developer"
  | "encoding"
  | "text"
  | "image"
  | "qr-barcode"
  | "datetime"
  | "web"
  | "network"
  | "generators"
  | "subtitle-data";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type TextIOMode = {
  id: string;
  label: string;
  run: (input: string) => string | Promise<string>;
  outputLanguage?: string;
};

export type FieldDef =
  | { type: "text"; id: string; label: string; placeholder?: string; defaultValue?: string }
  | { type: "textarea"; id: string; label: string; placeholder?: string; defaultValue?: string; rows?: number }
  | { type: "number"; id: string; label: string; defaultValue?: number; min?: number; max?: number }
  | { type: "select"; id: string; label: string; options: { label: string; value: string }[]; defaultValue?: string }
  | { type: "checkbox"; id: string; label: string; defaultValue?: boolean }
  | { type: "date"; id: string; label: string; defaultValue?: string }
  | { type: "datetime"; id: string; label: string; defaultValue?: string }
  | { type: "color"; id: string; label: string; defaultValue?: string }
  | { type: "file"; id: string; label: string; accept?: string; helpText?: string; optional?: boolean };

export type ToolComponentType = "text-io" | "form" | "qr" | "barcode" | "image" | "file-text";

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  category: CategorySlug;
  icon: LucideIcon;
  keywords: string[];
  popular?: boolean;
  componentType: ToolComponentType;
  placeholder?: string;
  sample?: string;
  modes?: TextIOMode[];
  fields?: FieldDef[];
  run?: (
    values: Record<string, unknown>,
  ) => string | { error: string } | Promise<string | { error: string }>;
  downloadExt?: string;
  downloadMime?: string;
  autoRun?: boolean;
};
