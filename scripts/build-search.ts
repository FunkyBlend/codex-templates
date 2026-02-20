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
    await writeCatalogOutputs(result, {
      check: checkMode,
      includeIndex: false,
      includeSearch: true,
      includeStats: false,
    });
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
    return;
  }

  if (result.hasErrors) {
    console.error("Search index build failed due to validation errors.");
    process.exitCode = 1;
    return;
  }

  console.log(
    `${checkMode ? "Checked" : "Generated"} search index for ${result.search.total_records} item(s).`,
  );
}

void main();
