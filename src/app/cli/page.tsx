import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogIndex } from "@/lib/catalog-data";

export const metadata: Metadata = {
  title: "CLI | CodexDepot",
  description: "Install and use the CodexDepot CLI for list/search/info/install workflows with reproducible pinning.",
};

export default async function CliPage() {
  const index = await getCatalogIndex();
  const indexSource = `${index.source.repository}@${index.source.branch}`;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h1 className="mb-3 text-3xl font-bold text-dark-text">CodexDepot CLI (V1)</h1>
        <p className="text-sm text-dark-muted">
          CLI reads static `index.json` + `search.json` and installs selected content
          with conflict prompts, dry-run support, and deterministic behavior.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-dark-border bg-dark-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-dark-text">Install</h2>
          <pre className="overflow-x-auto rounded border border-dark-border bg-dark-bg p-3 text-xs text-accent-green">
{`# run from repo root
npm run cli -- doctor
npm run cli -- list --type skill
npm run cli -- search "refactor review"
npm run cli -- info agent refactor-review
npm run cli -- install template nextjs-codex-starter --target ./sandbox --dry-run
npm run cli -- install template nextjs-codex-starter --target ./sandbox --ref <tag-or-commit> --dry-run`}
          </pre>
        </article>

        <article className="rounded-lg border border-dark-border bg-dark-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-dark-text">Commands</h2>
          <ul className="space-y-2 text-sm text-dark-text">
            <li>`codexdepot doctor`</li>
            <li>`codexdepot list`</li>
            <li>`codexdepot search &lt;query&gt;`</li>
            <li>`codexdepot info &lt;type&gt; &lt;slug&gt;`</li>
            <li>`codexdepot install &lt;type&gt; &lt;slug&gt; [--ref &lt;tag-or-commit&gt;]`</li>
          </ul>
        </article>
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h2 className="mb-3 text-lg font-semibold text-dark-text">Behavior Defaults</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-dark-text">
          <li>Index source: `--index`, then `CODEXDEPOT_INDEX_URL`, then local `public/data/index.json`.</li>
          <li>Install target defaults to current directory (`--target` to override).</li>
          <li>Conflicts prompt unless `--force` or `--overwrite` is passed.</li>
          <li>`--ref` pins remote content fetches to a specific git tag or commit SHA.</li>
          <li>`--dry-run` shows file writes without modifying disk.</li>
          <li>Current index source: `{indexSource}`.</li>
        </ul>
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h2 className="mb-3 text-lg font-semibold text-dark-text">Next</h2>
        <p className="mb-4 text-sm text-dark-muted">
          CLI publishing is automated by the tag-based GitHub workflow using `NPM_TOKEN`.
          Push tags in the format `cli-v*` after updating `cli/package.json` version.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/browse"
            className="rounded border border-accent-green bg-accent-green/10 px-4 py-2 text-sm font-semibold text-accent-green transition hover:bg-accent-green/20"
          >
            Browse Items
          </Link>
          <a
            href="https://github.com/FunkyBlend/codex-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-dark-border px-4 py-2 text-sm font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
          >
            GitHub Repository
          </a>
        </div>
      </section>
    </div>
  );
}
