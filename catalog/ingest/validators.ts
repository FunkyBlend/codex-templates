import fs from "fs";
import path from "path";
import Ajv from "ajv";

export interface LicenseResult {
  spdx: string;
  file: string;
}

export function detectLicense(skillDirPath: string, repoRootPath: string): LicenseResult {
  const licenseNames = ["LICENSE", "LICENSE.txt", "LICENSE.md", "license", "license.txt"];

  const checkDirForLicense = (dir: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir);
    const found = entries.find(e => licenseNames.includes(e));
    return found ? path.join(dir, found) : null;
  };

  let licenseFilePath = checkDirForLicense(skillDirPath);
  let relativeFilePath = "";

  if (licenseFilePath) {
    relativeFilePath = path.basename(licenseFilePath);
  } else {
    licenseFilePath = checkDirForLicense(repoRootPath);
    if (licenseFilePath) {
      relativeFilePath = path.relative(skillDirPath, licenseFilePath).split(path.sep).join('/');
    }
  }

  if (!licenseFilePath) {
    return { spdx: "UNKNOWN", file: "UNKNOWN" };
  }

  try {
    const content = fs.readFileSync(licenseFilePath, "utf-8").toLowerCase();
    let spdx = "UNKNOWN";

    if (content.includes("mit license")) {
      spdx = "MIT";
    } else if (content.includes("apache license") || content.includes("apache-2.0")) {
      spdx = "Apache-2.0";
    } else if (content.includes("bsd 3-clause")) {
      spdx = "BSD-3-Clause";
    } else if (content.includes("bsd 2-clause")) {
      spdx = "BSD-2-Clause";
    } else if (content.includes("gpl")) {
      spdx = "GPL";
    }

    return { spdx, file: relativeFilePath };
  } catch (err) {
    console.warn(`Could not read license file: ${licenseFilePath}`, err);
    return { spdx: "UNKNOWN", file: "UNKNOWN" };
  }
}

export function validateCatalogItems(items: any[], schemaPath: string): boolean {
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found at ${schemaPath}`);
    return false;
  }

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const schema = JSON.parse(schemaContent);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const valid = validate(items);
  if (!valid) {
    console.error("Validation failed:");
    console.error(ajv.errorsText(validate.errors));
    return false;
  }

  return true;
}