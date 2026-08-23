"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { ToolDefinition } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { useFavorites } from "@/lib/hooks/use-local-storage-list";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(tool.id);

  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(tool.id);
        }}
        className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Star className={cn("h-4 w-4", favorite && "fill-yellow-400 text-yellow-400")} />
      </button>
      <Link href={`/tools/${tool.id}`} className="block">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <p className="mt-3 pr-6 text-sm font-semibold leading-tight">{tool.name}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {getCategory(tool.category).name}
        </p>
      </Link>
    </div>
  );
}
