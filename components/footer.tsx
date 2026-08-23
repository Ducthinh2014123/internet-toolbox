import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold tracking-tight">Internet Toolbox</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Free online tools for developers and everyone. Your data stays in your browser.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <p className="mb-2 text-sm font-medium">Product</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li><Link href="/tools" className="hover:text-foreground">All Tools</Link></li>
              <li><Link href="/categories" className="hover:text-foreground">Categories</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Company</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Internet Toolbox. All rights reserved.
      </div>
    </footer>
  );
}
