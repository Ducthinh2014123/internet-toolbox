import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Internet Toolbox \u2014 free, fast, privacy-first online tools.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated: 2026</p>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Internet Toolbox is built to be privacy-first. This page explains, in plain language, what happens
        to your data when you use any of the tools on this site.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Client-side processing</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Every tool on Internet Toolbox runs entirely in your own browser. Text you type, files you upload,
        images you edit, and any other input are processed locally on your device using JavaScript. Nothing
        you type or upload into a tool is sent to, stored on, or seen by any server operated by Internet
        Toolbox. There is no backend and no database behind the tools.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Local storage</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Some conveniences \u2014 such as your <strong>Favorites</strong> list, <strong>Recently Used</strong>{" "}
        tools, and your light/dark <strong>theme</strong> preference \u2014 are saved only in your browser's{" "}
        <code>localStorage</code>. This data stays on your device, is never transmitted anywhere, and can be
        cleared at any time by clearing your browser's site data.
      </p>

      <h2 className="mt-8 text-lg font-semibold">No accounts, no tracking of inputs</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        There is no sign-up, no login, and no user account system. We do not track, log, or analyze the
        content you enter into any tool.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Hosting &amp; standard web logs</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The site itself is hosted on Vercel. Like most web hosts, the hosting provider may collect standard,
        anonymized technical logs (such as IP address, browser type, and request timestamps) for security and
        performance purposes. This is infrastructure-level logging, separate from and unrelated to the actual
        content you process inside a tool.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Third-party links</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Some tools may generate links to third-party resources (for example, a URL you choose to look up), or
        this site may link out to its open-source GitHub repository. We are not responsible for the privacy
        practices of external sites you choose to visit.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Changes to this policy</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        This Privacy Policy may be updated from time to time as tools are added. Continued use of the site
        after changes means you accept the updated policy.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Contact</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Questions about this policy or the project can be raised as an issue on the{" "}
        <a
          href="https://github.com/Ducthinh2014123/internet-toolbox/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-foreground"
        >
          GitHub repository
        </a>
        .
      </p>
    </div>
  );
}
