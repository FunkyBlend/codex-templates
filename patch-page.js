const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetRegex = /<\/section>[\s\n]+<section className="rounded-lg border border-dark-border bg-dark-card p-6">[\s\n]+<div className="mb-5 flex flex-wrap items-center justify-between gap-3">[\s\n]+<h2 className="text-xl font-semibold text-dark-text">Latest Validated Items<\/h2>/;

const replacement = `</section>

      <FeaturedCards />

      <EcosystemStands />

      <CliTools />

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-dark-text">Latest Validated Items</h2>`;

page = page.replace(targetRegex, replacement);
fs.writeFileSync('src/app/page.tsx', page);
