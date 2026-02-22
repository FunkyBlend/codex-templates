const cp = require('child_process');
try {
  cp.execSync('npx tsx scripts/build-index.ts', { 
    env: { ...process.env, CHECK_INDEX: "true", GITHUB_SHA: "fake-sha", CONTENT_VERSION: "fake-version" } 
  });
  console.log('Passed');
} catch(e) {
  console.log('Failed:', e.message);
}
