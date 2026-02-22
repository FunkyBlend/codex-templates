import { runPipeline, writeValidationReport } from "./lib/content-pipeline";

async function main(): Promise<void> {
  const result = await runPipeline();
  await writeValidationReport(result);

  const { errors, warnings, items_validated: itemsValidated } = result.report.summary;
  console.log(
    `Validated ${itemsValidated} items: ${errors} error(s), ${warnings} warning(s).`,
  );

  if (result.report.errors.length > 0) {
    console.error("Validation errors:");
    for (const issue of result.report.errors) {
      const location = issue.file ? ` (${issue.file})` : "";
      console.error(`- [${issue.code}] ${issue.message}${location}`);
    }
  }

  if (result.report.warnings.length > 0) {
    console.warn("Validation warnings:");
    for (const issue of result.report.warnings) {
      const location = issue.file ? ` (${issue.file})` : "";
      console.warn(`- [${issue.code}] ${issue.message}${location}`);
    }
  }

  if (result.hasErrors) {
    process.exitCode = 1;
  }
}

void main();
