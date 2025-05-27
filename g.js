const fs = require("fs");
const path = require("path");

function walk(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    const line = `${prefix}${pointer}${entry.name}`;
    result.push(line);

    if (entry.isDirectory()) {
      const subPrefix = prefix + (isLast ? "    " : "│   ");
      result.push(...walk(path.join(dir, entry.name), subPrefix));
    }
  }

  return result;
}

const structure = walk(".");
fs.writeFileSync("structure.txt", structure.join("\n"), "utf-8");

console.log("✅ File structure saved to structure.txt");
