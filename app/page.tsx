"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { tools, getPopularTools, searchTools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [query, setQuery] = React.useState("");
  const popular = getPopularTools(8);
  const filtered = query ? searchTools(query).slice(0, 12) : tools.slice(0, 12);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Internet Toolbox</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Free online tools for developers and everyone. Fast, private, and it runs entirely in your browser.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 150+ tools... (json, base64, qr, timestamp...)"
              className="h-12 pl-10 text-base"
              aria-label="Search tools"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{tools.length} tools available now \u00b7 growing every checkpoint</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{query ? "Search results" : "Popular Tools"}</h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(query ? filtered : popular).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-5 text-xl font-semibold">Categories</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-3 text-sm font-semibold">{cat.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{count} tools</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Tools</h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Browse full list <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.slice(0, 12).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
