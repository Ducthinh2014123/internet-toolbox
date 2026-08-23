"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { tools, searchTools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AllToolsPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(null);

  const results = React.useMemo(() => {
    let list = query ? searchTools(query) : tools;
    if (category) list = list.filter((t) => t.category === category);
    return list;
  }, [query, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">All Tools</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tools.length} tools available. Filter by category or search by keyword.</p>

      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools..." className="pl-9" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant={category === null ? "default" : "outline"} onClick={() => setCategory(null)}>
          All
        </Button>
        {categories.map((c) => (
          <Button
            key={c.slug}
            size="sm"
            variant={category === c.slug ? "default" : "outline"}
            onClick={() => setCategory(c.slug)}
            className={cn(category === c.slug && "")}
          >
            {c.name}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((tool) => (
          <ToolCard key={tool.id} toolId={tool.id} />
        ))}
        {results.length === 0 && <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No tools match your search.</p>}
      </div>
    </div>
  );
}
