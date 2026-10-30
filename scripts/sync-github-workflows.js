const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "automation", "workflows");
const destDir = path.join(__dirname, "..", ".github", "workflows");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Synced: ${file} -> .github/workflows/${file}`);
}

console.log("✅ Workflows successfully synced to .github/workflows/");
