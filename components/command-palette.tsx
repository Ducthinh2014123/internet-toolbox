"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { tools } from "@/lib/tools-registry";
import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

function scoreTool(query: string, t: (typeof tools)[number]) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const hay = [t.name, t.description, getCategory(t.category).name, ...t.keywords]
    .join(" ")
    .toLowerCase();
  if (t.name.toLowerCase().startsWith(q)) return 100;
  if (t.name.toLowerCase().includes(q)) return 60;
  if (t.keywords.some((k) => k.toLowerCase().startsWith(q))) return 40;
  if (hay.includes(q)) return 10;
  return 0;
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(() => {
    return tools
      .map((t) => ({ tool: t, score: scoreTool(query, t) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
      .slice(0, 40)
      .map((r) => r.tool);
  }, [query]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  React.useEffect(() => setActiveIndex(0), [query]);

  const go = React.useCallback(
    (id: string) => {
      onOpenChange(false);
      router.push(`/tools/${id}`);
    },
    [onOpenChange, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const tool = results[activeIndex];
      if (tool) go(tool.id);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 p-4 pt-[12vh] animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl animate-scale-in overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tools by name, category, or keyword..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search tools"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>
        <div className="max-h-[60vh] scrollbar-thin overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No tools found.</p>
          )}
          {results.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => go(tool.id)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  i === activeIndex ? "bg-accent text-accent-foreground" : "text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">
                  <span className="font-medium">{tool.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{tool.description}</span>
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {getCategory(tool.category).name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" /> <ArrowDown className="h-3 w-3" /> Navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> Select
          </span>
          <span className="ml-auto">{tools.length} tools indexed</span>
        </div>
      </div>
    </div>
  );
}
