import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contribute | CodexDepot",
  description: "How to contribute new CodexDepot content through pull requests.",
};

const steps = [
  "Fork the repository and create a branch named add/<type>-<slug>.",
  "Copy the relevant starter from content/_starter.",
  "Fill metadata and required files in the canonical folder structure.",
  "Run local checks: npm run validate:content and npm run build:index.",
  "Open a pull request using the provided PR template.",
];

export default function ContributePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h1 className="mb-3 text-3xl font-bold text-dark-text">Contribute to CodexDepot</h1>
        <p className="max-w-3xl text-sm text-dark-muted">
          CodexDepot is fully repository-driven: content files in GitHub are the source
          of truth. Add or update items through pull requests.
        </p>
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-dark-text">PR Workflow</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm text-dark-text">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-dark-border bg-dark-card p-6">
          <h3 className="mb-2 text-lg font-semibold text-dark-text">Canonical Paths</h3>
          <ul className="space-y-1 text-xs text-dark-muted">
            <li>`content/skills/&lt;slug&gt;/SKILL.md`</li>
            <li>`content/agents/&lt;slug&gt;/AGENT.md`</li>
            <li>`content/commands/&lt;slug&gt;/COMMAND.md`</li>
            <li>`content/templates/&lt;slug&gt;/item.yaml` + `files/`</li>
            <li>`content/hooks/&lt;slug&gt;/hook.json` + `README.md`</li>
            <li>`content/settings/&lt;slug&gt;/settings.json` + `README.md`</li>
          </ul>
        </article>

        <article className="rounded-lg border border-dark-border bg-dark-card p-6">
          <h3 className="mb-2 text-lg font-semibold text-dark-text">Required Checks</h3>
          <pre className="overflow-x-auto rounded border border-dark-border bg-dark-bg p-3 text-xs text-accent-green">
{`npm run validate:content
npm run build:index
npm run lint`}
          </pre>
        </article>
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h2 className="mb-3 text-xl font-semibold text-dark-text">Guidelines</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-dark-text">
          <li>Use lowercase kebab-case slugs and globally unique IDs.</li>
          <li>Add `## Usage` in markdown-based items.</li>
          <li>Include `safety_notes` for risky commands or remote script execution.</li>
          <li>Do not include secrets, binaries, or unsupported file types.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/browse"
          className="rounded border border-accent-green bg-accent-green/10 px-4 py-2 text-sm font-semibold text-accent-green transition hover:bg-accent-green/20"
        >
          Browse Existing Items
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-dark-border px-4 py-2 text-sm font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
        >
          Open GitHub Repository
        </a>
      </div>
    </div>
  );
}
