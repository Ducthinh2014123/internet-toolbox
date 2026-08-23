import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { tools } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Internet Toolbox tools by category.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">Browse all {tools.length} tools organized by category.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = tools.filter((t) => t.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold">{cat.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{count} tools</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
