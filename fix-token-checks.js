const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "client", "src");

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (f.endsWith(".jsx") || f.endsWith(".js")) files.push(full);
  }
  return files;
}

let totalFixed = 0;

for (const file of walk(srcDir)) {
  // Skip apiConfig.js itself
  if (file.endsWith("apiConfig.js")) continue;

  let src = fs.readFileSync(file, "utf8");
  const orig = src;

  // 1. Remove module-level: const getToken = () => localStorage.getItem("token");
  src = src.replace(/^const getToken = \(\) => localStorage\.getItem\("token"\);\n/gm, "");

  // 2. Remove: const token = localStorage.getItem("token");
  src = src.replace(/^[ \t]*const (?:token|authToken) = localStorage\.getItem\("token"\);\n/gm, "");

  // 3. Remove inline: const token = getToken();
  src = src.replace(/^[ \t]*const (?:token|authToken) = getToken\(\);\n/gm, "");

  // 4. Remove: if (!token) { navigate("/login"); return; }  multi-line
  src = src.replace(/[ \t]*if \(!(?:token|authToken)\) \{\n[ \t]*navigate\([^)]+\);\n[ \t]*(?:return|throw[^\n]*);\n[ \t]*\}\n?/g, "");

  // 5. Remove: if (!token) { navigate("/login"); throw new Error(...) }
  src = src.replace(/[ \t]*if \(!(?:token|authToken)\) \{[ \t]*\n[ \t]*navigate\([^)]+\);[ \t]*\n[ \t]*throw[^\n]*\n[ \t]*\}\n?/g, "");

  // 6. Remove Authorization headers in api calls (2nd or 3rd arg object)
  //    Pattern: , { headers: { Authorization: `Bearer ${token}` } }
  src = src.replace(/,\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{(?:token|authToken)\}`\s*\}\s*\}/g, "");

  // 7. Remove Authorization header mixed with Content-Type:
  //    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
  //    → { headers: { "Content-Type": "multipart/form-data" } }
  src = src.replace(/Authorization:\s*`Bearer \$\{(?:token|authToken)\}`,?\s*/g, "");

  // 8. Remove now-empty headers objects: , { headers: { } }  or  { headers: {  } }
  src = src.replace(/,\s*\{\s*headers:\s*\{\s*\}\s*\}/g, "");

  // 9. Remove token ? { headers: ... } : {} ternary (BookingRequestPage pattern)
  src = src.replace(/(?:token|authToken) \? \{ headers: \{ Authorization: `Bearer \$\{(?:token|authToken)\}` \} \} : \{\}/g, "{}");

  // 10. Remove leftover: token ? { ... } : {} for non-auth headers
  // (keep simple cleanup)

  if (src !== orig) {
    fs.writeFileSync(file, src);
    console.log("Fixed:", path.relative(srcDir, file));
    totalFixed++;
  }
}

console.log(`\nDone. Fixed ${totalFixed} files.`);
