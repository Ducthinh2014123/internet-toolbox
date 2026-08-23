# Internet Toolbox

A fast, modern, privacy-first collection of free online tools for developers and everyone. Every tool runs client-side in the browser.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + hand-built shadcn/ui-style primitives
- Lucide icons
- No backend, no database \u2014 deployable directly to Vercel

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

> This project was authored in a sandboxed environment without internet/npm registry access, so `npm install` / `npm run build` could not be executed or verified there. The source follows Next.js 14 App Router conventions and strict TypeScript; please run the commands above locally or in CI (e.g. on Vercel) to install dependencies and verify the production build before deploying.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Framework preset: Next.js. No environment variables or backend services are required.
4. Deploy.

## Project structure

- `app/` \u2014 routes (home, `/tools`, `/tools/[slug]`, `/categories`, `/categories/[category]`, `/about`, `sitemap.ts`, `robots.ts`)
- `components/` \u2014 header, footer, command palette, theme toggle, toast system, generic tool runner components (`TextIOTool`, `FormTool`), UI primitives
- `lib/tools-registry.ts` \u2014 the single source of truth for every tool (metadata + logic). All surfaces (homepage, all-tools, search, command palette, categories, favorites, related tools) read from this registry only.
- `lib/tools/*.ts` \u2014 pure, dependency-light logic per category (encoding, text, datetime, developer, ...)
- `lib/categories.ts` \u2014 the 10 tool categories
- `lib/hooks/use-local-storage-list.ts` \u2014 Favorites and Recently Used, backed by `localStorage`

## Current tool coverage (Checkpoint 1)

This checkpoint ships real, fully working tools for: Developer & Code (partial), Encoding & Crypto, Text, and Date & Time. See the chat report for exact counts. Remaining categories (Image, QR & Barcode, Web & URL, Network & IP, Generators, Subtitle & Data) and the remaining Developer & Code tools that need extra packages (Prettier, sql-formatter, TOML, diff, terser) are planned for the next checkpoint and are already reflected as dependencies in `package.json`.
