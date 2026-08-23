import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { tools, getToolById, getRelatedTools } from "@/lib/tools-registry";
import { getCategory } from "@/lib/categories";
import { ToolRunner } from "@/components/tools/tool-runner";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolById(params.slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    openGraph: { title: `${tool.name} \u2013 Internet Toolbox`, description: tool.description },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolById(params.slug);
  if (!tool) notFound();
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool, 4);
  const Icon = tool.icon;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground">All Tools</Link>
        <span>/</span>
        <Link href={`/categories/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="h-5.5 w-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-4 sm:p-6">
        <ToolRunner slug={tool.id} />
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Related Tools</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((r) => {
              const RIcon = r.icon;
              return (
                <Link key={r.id} href={`/tools/${r.id}`} className="rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-accent">
                  <RIcon className="mb-2 h-4 w-4 text-muted-foreground" />
                  {r.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
