"use client";

import * as React from "react";
import { Copy, Trash2, Download, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/toast/toast-provider";
import { downloadTextFile } from "@/lib/utils";
import type { TextIOMode } from "@/lib/types";

type Props = {
  modes: TextIOMode[];
  placeholder?: string;
  sample?: string;
  downloadExt?: string;
  downloadMime?: string;
};

export function TextIOTool({ modes, placeholder, sample, downloadExt, downloadMime }: Props) {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [activeMode, setActiveMode] = React.useState(modes[0]?.id);

  const [loading, setLoading] = React.useState(false);

  async function run(modeId: string) {
    const mode = modes.find((m) => m.id === modeId);
    if (!mode) return;
    setActiveMode(modeId);
    setLoading(true);
    try {
      const result = await mode.run(input);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please check your input.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(
      () => toast("Copied to clipboard", "success"),
      () => toast("Could not copy to clipboard", "error"),
    );
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
  }

  function download() {
    if (!output) return;
    downloadTextFile(`output.${downloadExt ?? "txt"}`, output, downloadMime ?? "text/plain");
    toast("Download started", "success");
  }

  function loadSample() {
    if (sample) setInput(sample);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            size="sm"
            variant={activeMode === mode.id ? "default" : "outline"}
            onClick={() => run(mode.id)}
            disabled={loading}
          >
            {mode.label}
          </Button>
        ))}
        {sample && (
          <Button size="sm" variant="ghost" onClick={loadSample}>
            Load sample
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={clearAll}>
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Input</label>
            <span className="text-xs text-muted-foreground">{input.length} chars</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder ?? "Paste or type your content here..."}
            rows={14}
            className="min-h-[280px]"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output}>
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
              {downloadExt && (
                <Button size="sm" variant="ghost" onClick={download} disabled={!output}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            rows={14}
            className="min-h-[280px] bg-muted/40"
            placeholder="Result will appear here"
            spellCheck={false}
          />
          {error && (
            <p role="alert" className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowRightLeft className="h-3.5 w-3.5" /> Your data stays in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}
