import fs from "fs";
import path from "path";
import { minify } from "html-minifier";
import config from "./wrayth.config.js";

const { input, output, components, build } = config;

function readComponent(name) {
  return fs.readFileSync(path.join(components, name), "utf-8");
}

function extractSlots(rawHTML, componentHTML) {
  const slots = {};
  const matches = [...rawHTML.matchAll(/<template slot="(.*?)">([\s\S]*?)<\/template>/g)];
  for (const [, name, content] of matches) {
    slots[name] = content.trim();
  }
  return componentHTML.replace(/\{\{slot:(.*?)\}\}/g, (_, name) => slots[name] || "");
}

function evaluateCondition(expression, context = {}) {
  try {
    return Function("with(this) { return (" + expression + ") }").call(context);
  } catch {
    return false;
  }
}

function renderConditionals(html, context = {}) {
  return html.replace(/<([^ >]+)([^>]*?) wrayth-if="(.*?)"(.*?)>([\s\S]*?)<\/\1>/g, (_, tag, before, cond, after, body) => {
    return evaluateCondition(cond, context)
      ? `<${tag}${before}${after}>${body}</${tag}>`
      : "";
  });
}

function scanClasses(dir) {
  const classList = new Set();
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      for (const c of scanClasses(full)) classList.add(c);
    } else {
      const content = fs.readFileSync(full, "utf-8");
      const matches = content.match(/class=["']([\w\s-:\/]+)["']/g) || [];
      for (const match of matches) {
        match.replace(/class=["'](.*?)["']/, (_, cls) => cls.split(/\s+/).forEach(c => classList.add(c)));
      }
    }
  });
  return classList;
}

function purgeCSS(css, usedClasses) {
  return css.split("}").map(rule => {
    const [sel, body] = rule.split("{");
    if (!sel || !body) return "";
    const keep = sel.split(",").some(s => [...usedClasses].some(c => s.includes("." + c)));
    return keep ? `${sel}{${body}}` : "";
  }).join("}");
}

function compileHTML(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");
  html = html.replace(/<wrayth-component src="(.+?)">([\s\S]*?)<\/wrayth-component>/g, (_, compPath, innerContent) => {
    let raw = readComponent(compPath);
    if (build.enableSlots) raw = extractSlots(innerContent, raw);
    return raw;
  });
  if (build.enableConditionals) {
    html = renderConditionals(html, { user: { loggedIn: true } });
  }
  if (build.minify) {
    html = minify(html, { collapseWhitespace: true, removeComments: true });
  }
  return html;
}

function buildSite() {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });

  const pages = fs.readdirSync(path.join(input, "pages"));
  for (const page of pages) {
    const compiled = compileHTML(path.join(input, "pages", page));
    fs.writeFileSync(path.join(output, page), compiled);
  }

  const usedClasses = scanClasses(input);
  const css = fs.readFileSync(config.theme, "utf-8");
  const finalCSS = build.purgeUnusedCSS ? purgeCSS(css, usedClasses) : css;
  fs.writeFileSync(path.join(output, "theme.css"), finalCSS);

  console.log("[SUCCESS] Wrayth build complete.");
}

buildSite();