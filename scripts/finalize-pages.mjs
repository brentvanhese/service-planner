// Collects the static client build into ./dist and adds index.html + 404.html so deep links work on GitHub Pages.
import { copyFileSync, cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const candidates = [".output/public", "dist/client"];
const src = candidates.find((d) => existsSync(d) && readdirSync(d).length);
if (!src) throw new Error(`No client build found in: ${candidates.join(", ")}`);

const tmp = mkdtempSync(join(tmpdir(), "pages-"));
cpSync(src, tmp, { recursive: true });
rmSync("dist", { recursive: true, force: true });
cpSync(tmp, "dist", { recursive: true });
rmSync(tmp, { recursive: true, force: true });

const out = "dist";
const shell = ["_shell.html", "index.html"].map((f) => `${out}/${f}`).find(existsSync);
if (!shell) throw new Error(`No SPA shell found in ${out}: ${readdirSync(out).join(", ")}`);
if (!shell.endsWith("index.html")) copyFileSync(shell, `${out}/index.html`);
copyFileSync(`${out}/index.html`, `${out}/404.html`);
writeFileSync(`${out}/.nojekyll`, "");
console.log(`GitHub Pages output ready in ./${out} (from ${src})`);
