import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { tools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/tool-card";
import type { CategorySlug } from "@/lib/types";

type Props = { params: { category: string } };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description}. Browse all ${category.name} tools on Internet Toolbox.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();
  const categoryTools = tools.filter((t) => t.category === (category.slug as CategorySlug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <a href="/categories" className="hover:text-foreground">Categories</a> / {category.name}
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{category.description} \u00b7 {categoryTools.length} tools</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        {categoryTools.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            More tools for this category are coming in the next checkpoint.
          </p>
        )}
      </div>
    </div>
  );
}
