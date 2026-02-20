import { runPipeline, writeCatalogOutputs } from "./lib/content-pipeline";

async function main(): Promise<void> {
  const checkMode =
    process.argv.includes("--check") ||
    process.argv.join(" ").includes("--check") ||
    (process.env.npm_config_argv ?? "").includes("--check") ||
    process.env.CHECK_INDEX === "true" ||
    process.env.CHECK_INDEX === "1";
  const result = await runPipeline();

  try {
    await writeCatalogOutputs(result, { check: checkMode });
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
    return;
  }

  if (result.hasErrors) {
    console.error("Index build failed due to validation errors.");
    process.exitCode = 1;
    return;
  }

  const itemCount = result.index.total_items;
  const warningCount = result.report.summary.warnings;
  console.log(
    `${checkMode ? "Checked" : "Generated"} index/search output for ${itemCount} item(s) with ${warningCount} warning(s).`,
  );
}

void main();
