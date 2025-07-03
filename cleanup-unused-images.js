#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Recursively collect all files in a directory
function getAllFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const imagesDir = path.join(__dirname, "public", "images");
const codeDir = path.join(__dirname, "src");

if (!fs.existsSync(imagesDir)) {
  console.error(`Images directory not found: ${imagesDir}`);
  process.exit(1);
}

// Gather all image files
const images = getAllFiles(imagesDir);
// Gather all code files to search
const codeFiles = getAllFiles(codeDir).filter((f) =>
  /\.(js|jsx|ts|tsx|md)$/.test(f)
);

// Read all code contents into one string for faster lookup
const codeContents = codeFiles
  .map((f) => fs.readFileSync(f, "utf8"))
  .join("\n");

// Delete images not referenced in code
images.forEach((img) => {
  const name = path.basename(img);
  if (!codeContents.includes(name)) {
    fs.unlinkSync(img);
    console.log(`Deleted unused image: ${path.relative(__dirname, img)}`);
  }
});
