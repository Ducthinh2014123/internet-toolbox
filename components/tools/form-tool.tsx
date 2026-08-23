"use client";

import * as React from "react";
import { Copy, Download, Play, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast/toast-provider";
import { downloadTextFile, downloadBlob, dataUrlToBlob, formatBytes, mimeToExt, dataUrlByteSize } from "@/lib/utils";
import type { FieldDef } from "@/lib/types";

function isImageDataUrl(value: string): boolean {
  return /^data:image\//.test(value);
}

function ImageFilePreview({ file }: { file: File }) {
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setDims(null);
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => setDims(null);
    img.src = url;
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="mt-2 flex items-center gap-3 rounded-md border border-border bg-muted/30 p-2">
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Selected file preview" className="h-14 w-14 rounded object-cover" />
      ) : (
        <span className="flex h-14 w-14 items-center justify-center rounded bg-muted text-muted-foreground">
          <ImageOff className="h-5 w-5" />
        </span>
      )}
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{file.name}</p>
        <p>{formatBytes(file.size)}{dims ? ` \u00b7 ${dims.w}\u00d7${dims.h}px` : ""}</p>
      </div>
    </div>
  );
}

type Props = {
  fields: FieldDef[];
  run: (
    values: Record<string, unknown>,
  ) => string | { error: string } | Promise<string | { error: string }>;
  downloadExt?: string;
  downloadMime?: string;
};

function defaultValues(fields: FieldDef[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const f of fields) {
    if ("defaultValue" in f && f.defaultValue !== undefined) values[f.id] = f.defaultValue;
    else if (f.type === "checkbox") values[f.id] = false;
    else if (f.type === "file") values[f.id] = null;
    else if (f.type === "color") values[f.id] = "#000000";
    else values[f.id] = "";
  }
  return values;
}

export function FormTool({ fields, run, downloadExt, downloadMime }: Props) {
  const { toast } = useToast();
  const [values, setValues] = React.useState<Record<string, unknown>>(() => defaultValues(fields));
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  function setField(id: string, value: unknown) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  const requiredFileFieldIds = React.useMemo(
    () => fields.filter((f) => f.type === "file" && !f.optional).map((f) => f.id),
    [fields],
  );
  const hasRequiredFileField = requiredFileFieldIds.length > 0;

  async function execute() {
    setLoading(true);
    try {
      const result = await run(values);
      if (typeof result === "string") {
        setOutput(result);
        setError(null);
      } else {
        setOutput("");
        setError(result.error);
      }
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Something went wrong. Please check your input.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // Skip the automatic run-on-mount when a required file upload has no
    // value yet; running immediately would just surface an error message
    // before the user has had a chance to pick a file.
    if (!hasRequiredFileField) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (hasRequiredFileField && requiredFileFieldIds.every((id) => values[id] instanceof File)) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, requiredFileFieldIds.map((id) => values[id]));

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(
      () => toast("Copied to clipboard", "success"),
      () => toast("Could not copy to clipboard", "error"),
    );
  }

  function download() {
    if (!output) return;
    if (isImageDataUrl(output)) {
      const blob = dataUrlToBlob(output);
      downloadBlob(`output.${downloadExt ?? mimeToExt(blob.type)}`, blob);
    } else {
      downloadTextFile(`output.${downloadExt ?? "txt"}`, output, downloadMime ?? "text/plain");
    }
    toast("Download started", "success");
  }

  const outputIsImage = isImageDataUrl(output);
  const sourceFile = React.useMemo(() => {
    const fileField = fields.find((f) => f.type === "file");
    if (!fileField) return null;
    const v = values[fileField.id];
    return v instanceof File ? v : null;
  }, [fields, values]);

  return (
    <div className="space-y-4">
      {fields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label htmlFor={f.id}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.id}
                  rows={f.rows ?? 4}
                  placeholder={f.placeholder}
                  value={String(values[f.id] ?? "")}
                  onChange={(e) => setField(f.id, e.target.value)}
                  className="mt-1.5"
                />
              ) : f.type === "select" ? (
                <select
                  id={f.id}
                  value={String(values[f.id] ?? "")}
                  onChange={(e) => setField(f.id, e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "checkbox" ? (
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    id={f.id}
                    type="checkbox"
                    checked={Boolean(values[f.id])}
                    onChange={(e) => setField(f.id, e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                </div>
              ) : f.type === "color" ? (
                <input
                  id={f.id}
                  type="color"
                  value={String(values[f.id] ?? "#000000")}
                  onChange={(e) => setField(f.id, e.target.value)}
                  className="mt-1.5 h-9 w-16 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
              ) : f.type === "file" ? (
                <div className="mt-1.5">
                  <input
                    id={f.id}
                    type="file"
                    accept={f.accept ?? "image/*"}
                    onChange={(e) => setField(f.id, e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground hover:file:opacity-90"
                  />
                  {f.helpText && <p className="mt-1 text-xs text-muted-foreground">{f.helpText}</p>}
                  {values[f.id] instanceof File && <ImageFilePreview file={values[f.id] as File} />}
                </div>
              ) : (
                <Input
                  id={f.id}
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "datetime" ? "datetime-local" : "text"}
                  placeholder={"placeholder" in f ? f.placeholder : undefined}
                  min={f.type === "number" ? f.min : undefined}
                  max={f.type === "number" ? f.max : undefined}
                  value={String(values[f.id] ?? "")}
                  onChange={(e) => setField(f.id, f.type === "number" ? Number(e.target.value) : e.target.value)}
                  className="mt-1.5"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={execute} disabled={loading}>
          <Play className="h-3.5 w-3.5" /> {loading ? "Running..." : "Run"}
        </Button>
        <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output}>
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
        {(downloadExt || outputIsImage) && (
          <Button size="sm" variant="ghost" onClick={download} disabled={!output}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        )}
      </div>

      <div>
        <Label>Result</Label>
        {outputIsImage && (
          <div className="mt-1.5 space-y-2">
            <div className="flex items-center justify-center rounded-md border border-border bg-muted/40 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={output} alt="Generated result" className="max-h-80 w-auto max-w-full rounded" />
            </div>
            {sourceFile && (
              <p className="text-xs text-muted-foreground">
                Original: {formatBytes(sourceFile.size)} &rarr; Output: {formatBytes(dataUrlByteSize(output))}
              </p>
            )}
          </div>
        )}
        <Textarea
          value={output}
          readOnly
          rows={outputIsImage ? 3 : 10}
          className={outputIsImage ? "mt-2 min-h-[80px] bg-muted/40 font-mono text-xs" : "mt-1.5 min-h-[200px] bg-muted/40"}
          placeholder="Result will appear here"
        />
        {error && (
          <p role="alert" className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Your data stays in your browser. Nothing is uploaded.</p>
    </div>
  );
}
