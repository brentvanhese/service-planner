// Turns the SPA shell into index.html + 404.html so deep links work on GitHub Pages.
import { copyFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
const dir = "dist/client";
const shell = ["_shell.html", "index.html"].map((f) => `${dir}/${f}`).find(existsSync);
if (!shell) throw new Error(`No SPA shell found in ${dir}: ${readdirSync(dir).join(", ")}`);
if (!shell.endsWith("index.html")) copyFileSync(shell, `${dir}/index.html`);
copyFileSync(`${dir}/index.html`, `${dir}/404.html`);
writeFileSync(`${dir}/.nojekyll`, "");
console.log("GitHub Pages output ready in", dir);
