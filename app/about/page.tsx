import type { Metadata } from "next";
import { tools } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "About",
  description: "About Internet Toolbox \u2014 free, fast, privacy-first online tools.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">About Internet Toolbox</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Internet Toolbox is a collection of {tools.length} free online tools for developers and everyone
        else. Every tool runs entirely client-side in your browser \u2014 your data is never uploaded to a
        server unless a tool explicitly says otherwise.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Built with Next.js, TypeScript and Tailwind CSS. No account, no tracking of your inputs, no backend
        required to run the core tools.
      </p>
      <h2 className="mt-8 text-lg font-semibold">Privacy</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Your data stays in your browser. Favorites, recently used tools, and theme preference are stored only
        in your browser's local storage.
      </p>
    </div>
  );
}
