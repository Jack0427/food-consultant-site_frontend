#!/usr/bin/env node
// 程式碼符號索引：給 AI 助理查「定義在哪、被誰用」，不是給人看的。
// 用專案本身的 TypeScript 編譯器解析符號，能分辨同名函式、@/ 別名與 re-export。
//
//   node scripts/code-index.mjs          產生 .claude/code-index.txt
//   node scripts/code-index.mjs --check  檢查索引是否過時，以及 CLAUDE.md「架構」段落提到的路徑與名稱是否存在
//   node scripts/code-index.mjs --at 檔案:行  查這一行屬於哪個頂層定義與其行範圍（讀索引，不重新解析）
//
// 索引每行一筆、可直接 grep：
//   DEF 檔案:開始行-結束行 種類 名稱 [export]     （定義內部的具名函式：種類為 inner，結尾加 in 所屬定義）
//   IMP 檔案:行 -> 來源模組 {匯入名稱}   （re-export 為 REEXP）
//   USE 檔案:行 所在符號 -> 名稱 @定義檔案:行 [type]

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const INDEX_PATH = path.join(ROOT, ".claude", "code-index.txt");
const IGNORED_DIRS = ["node_modules", ".next", "out", "graphify-out", "test-results", "playwright-report"];

const rel = (file) => path.relative(ROOT, file);
const isProjectFile = (file) => {
  const r = rel(file);
  return !r.startsWith("..") && !r.split(path.sep).some((part) => IGNORED_DIRS.includes(part));
};

function createProgram() {
  const configPath = path.join(ROOT, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
  const program = ts.createProgram(parsed.fileNames, { ...parsed.options, noEmit: true });
  const files = program
    .getSourceFiles()
    .filter((sf) => !sf.isDeclarationFile && isProjectFile(sf.fileName))
    .sort((a, b) => rel(a.fileName).localeCompare(rel(b.fileName)));
  return { program, files };
}

const lineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
const endLineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getEnd()).line + 1;

// 檔案頂層宣告：[{ name, kind, node, exported }]
function topLevelDeclarations(sf) {
  const out = [];
  for (const stmt of sf.statements) {
    const exported = (ts.getCombinedModifierFlags(stmt) & ts.ModifierFlags.Export) !== 0;
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      out.push({ name: stmt.name.text, kind: "function", node: stmt, exported });
    } else if (ts.isClassDeclaration(stmt) && stmt.name) {
      out.push({ name: stmt.name.text, kind: "class", node: stmt, exported });
    } else if (ts.isInterfaceDeclaration(stmt)) {
      out.push({ name: stmt.name.text, kind: "interface", node: stmt, exported });
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      out.push({ name: stmt.name.text, kind: "type", node: stmt, exported });
    } else if (ts.isEnumDeclaration(stmt)) {
      out.push({ name: stmt.name.text, kind: "enum", node: stmt, exported });
    } else if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        const init = decl.initializer;
        const isFn = init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init));
        out.push({ name: decl.name.text, kind: isFn ? "function" : "const", node: decl, exported });
      }
    }
  }
  return out;
}

// 頂層定義內部（任意深度）的具名函式：function 宣告，或以箭頭函式／函式運算式初始化的變數
function innerFunctions(top) {
  const out = [];
  const isFn = (n) => n && (ts.isArrowFunction(n) || ts.isFunctionExpression(n));
  // 呼叫的參數中有函式，例如 useCallback(() => …)、useActionState(async () => …)、useEffect(() => …)
  const callWithFn = (n) => n && ts.isCallExpression(n) && n.arguments.some(isFn);
  const visit = (node) => {
    if (node !== top) {
      if (ts.isFunctionDeclaration(node) && node.name) {
        out.push({ name: node.name.text, span: node });
      } else if (ts.isVariableDeclaration(node) && (isFn(node.initializer) || callWithFn(node.initializer))) {
        // 名稱：一般變數用識別字；解構（const [a, b] = useX(...)）用壓縮後的樣式文字
        const name = ts.isIdentifier(node.name) ? node.name.text : node.name.getText().replace(/\s+/g, "");
        const stmt = node.parent.declarations.length === 1 ? node.parent.parent : node;
        out.push({ name, span: stmt });
      } else if (ts.isExpressionStatement(node) && callWithFn(node.expression)) {
        // 沒有接收回傳值的 hook 呼叫（useEffect 等）以被呼叫的函式名稱命名
        out.push({ name: node.expression.expression.getText().replace(/\s+/g, ""), span: node });
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(top, visit);
  return out;
}

function enclosingTopLevelName(node, sf, declByNode) {
  let cur = node;
  while (cur && cur.parent && cur.parent !== sf) cur = cur.parent;
  if (!cur) return "<module>";
  if (declByNode.has(cur)) return declByNode.get(cur).name;
  if (ts.isVariableStatement(cur)) {
    for (const decl of cur.declarationList.declarations) {
      if (declByNode.has(decl) && decl.pos <= node.pos && node.end <= decl.end) return declByNode.get(decl).name;
    }
  }
  return "<module>";
}

function inTypePosition(node) {
  for (let cur = node.parent; cur; cur = cur.parent) {
    if (ts.isTypeNode(cur) || ts.isHeritageClause(cur)) return true;
    if (ts.isStatement(cur) || ts.isExpression(cur) && !ts.isIdentifier(cur)) return false;
  }
  return false;
}

function buildIndex() {
  const { program, files } = createProgram();
  const checker = program.getTypeChecker();

  // 所有頂層宣告，以 AST 節點對應到 { name, file, line }
  const declByNode = new Map();
  const defLines = [];
  for (const sf of files) {
    for (const d of topLevelDeclarations(sf)) {
      // 只有一個宣告的變數敘述，以整個敘述（含 export const）為範圍
      const span = ts.isVariableDeclaration(d.node) && d.node.parent.declarations.length === 1 ? d.node.parent.parent : d.node;
      const info = { name: d.name, file: rel(sf.fileName), line: lineOf(sf, span) };
      declByNode.set(d.node, info);
      defLines.push(`DEF ${info.file}:${info.line}-${endLineOf(sf, span)} ${d.kind} ${d.name}${d.exported ? " export" : ""}`);
      // 定義內部的具名函式只記錄範圍（讓 --at 能回傳較小的區段），不參與 USE 引用解析
      for (const inner of innerFunctions(d.node)) {
        defLines.push(`DEF ${info.file}:${lineOf(sf, inner.span)}-${endLineOf(sf, inner.span)} inner ${inner.name} in ${d.name}`);
      }
    }
  }

  const impLines = [];
  const useSet = new Set();
  for (const sf of files) {
    const file = rel(sf.fileName);
    for (const stmt of sf.statements) {
      if (!ts.isImportDeclaration(stmt) && !(ts.isExportDeclaration(stmt) && stmt.moduleSpecifier)) continue;
      const spec = stmt.moduleSpecifier.text;
      const resolved = ts.resolveModuleName(spec, sf.fileName, program.getCompilerOptions(), ts.sys).resolvedModule;
      const target =
        resolved && !resolved.isExternalLibraryImport && isProjectFile(resolved.resolvedFileName)
          ? rel(resolved.resolvedFileName)
          : spec;
      const names = [];
      const clause = ts.isImportDeclaration(stmt) ? stmt.importClause : null;
      if (clause?.name) names.push(clause.name.text);
      const bindings = clause?.namedBindings ?? (ts.isExportDeclaration(stmt) ? stmt.exportClause : null);
      if (bindings && ts.isNamespaceImport(bindings)) names.push(`* as ${bindings.name.text}`);
      else if (bindings && "elements" in bindings) names.push(...bindings.elements.map((e) => e.name.text));
      const verb = ts.isExportDeclaration(stmt) ? "REEXP" : "IMP";
      impLines.push(`${verb} ${file}:${lineOf(sf, stmt)} -> ${target} {${names.join(", ")}}`);
    }

    const visit = (node) => {
      if (ts.isImportDeclaration(node)) return; // 匯入關係已記在 IMP
      if (ts.isIdentifier(node) && !(node.parent && declByNode.has(node.parent) && node.parent.name === node)) {
        let symbol = checker.getSymbolAtLocation(node);
        if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
        const decl = symbol?.declarations?.find((d) => declByNode.has(d));
        if (decl) {
          const target = declByNode.get(decl);
          const line = lineOf(sf, node);
          if (!(target.file === file && target.line === line)) {
            const from = enclosingTopLevelName(node, sf, declByNode);
            const typeFlag = inTypePosition(node) ? " type" : "";
            useSet.add(`USE ${file}:${line} ${from} -> ${target.name} @${target.file}:${target.line}${typeFlag}`);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  const header = [
    `# code-index  generated ${new Date().toISOString()}  files=${files.length}  defs=${defLines.length}  uses=${useSet.size}`,
    "# 由 scripts/code-index.mjs 產生，勿手動編輯。",
    "# 格式：DEF 檔案:開始行-結束行 種類 名稱 [export]（內部函式為 inner 名稱 in 所屬定義） | IMP/REEXP 檔案:行 -> 來源 {名稱} | USE 檔案:行 所在符號 -> 名稱 @定義:行 [type]",
    `# FILES ${files.map((sf) => rel(sf.fileName)).join(" ")}`,
  ];
  const body = [...defLines, ...impLines, ...[...useSet].sort()];
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, [...header, ...body].join("\n") + "\n");
  console.log(`code-index: ${files.length} 個檔案、${defLines.length} 個定義、${useSet.size} 筆引用 -> ${rel(INDEX_PATH)}`);
}

// ---- --check ----

function listSourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.includes(entry.name) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listSourceFiles(full));
    else if (/\.(ts|tsx|mts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

function checkIndex(problems) {
  if (!fs.existsSync(INDEX_PATH)) {
    problems.push("索引不存在：執行 node scripts/code-index.mjs");
    return null;
  }
  const text = fs.readFileSync(INDEX_PATH, "utf8");
  const indexTime = fs.statSync(INDEX_PATH).mtimeMs;
  const indexed = new Set((text.match(/^# FILES (.*)$/m)?.[1] ?? "").split(" ").filter(Boolean));
  const current = listSourceFiles(ROOT).map(rel);
  const changed = current.filter((f) => fs.statSync(path.join(ROOT, f)).mtimeMs > indexTime);
  const added = current.filter((f) => !indexed.has(f));
  const removed = [...indexed].filter((f) => !fs.existsSync(path.join(ROOT, f)));
  if (changed.length || added.length || removed.length) {
    problems.push(
      `索引過時（修改 ${changed.length}、新增 ${added.length}、刪除 ${removed.length}）：執行 node scripts/code-index.mjs` +
        [...changed, ...added, ...removed].slice(0, 8).map((f) => `\n    ${f}`).join(""),
    );
  }
  return new Set([...text.matchAll(/^DEF\s+\S+\s+\S+\s+(\S+)/gm)].map((m) => m[1]));
}

function checkMap(problems, defNames) {
  const claude = fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8");
  const section = claude.match(/^## 架構\n([\s\S]*?)(?=^## )/m)?.[1];
  if (!section) {
    problems.push("CLAUDE.md 找不到「## 架構」段落");
    return;
  }
  const tokens = [...section.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  const srcFiles = listSourceFiles(path.join(ROOT, "src"));
  const relPaths = [...srcFiles.map(rel), ...srcFiles.map((f) => path.dirname(rel(f)))];
  const fileStems = new Set(srcFiles.map((f) => path.basename(f).replace(/\.\w+$/, "")));
  const sourceText = srcFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  for (const token of tokens) {
    if (/\s|=/.test(token)) continue; // 程式片段，例如 MotionConfig reducedMotion="user"
    if (token.includes("/")) {
      // 地圖的路徑可能是相對於上一層項目（例如 src/i18n/ 底下的 locales/en.ts），以結尾比對
      const p = token.replace(/\/$/, "");
      const ok = relPaths.some((r) => [r, r.replace(/\.(ts|tsx)$/, "")].some((c) => c === p || c.endsWith(`/${p}`)));
      if (!ok) problems.push(`地圖提到的路徑不存在：${token}`);
    } else if (/^[A-Za-z_$][\w$]*(\(\))?$/.test(token)) {
      // 頂層定義、檔名，或原始碼中任何位置出現（物件方法、從套件匯入的名稱）都算存在
      const name = token.replace(/\(\)$/, "");
      const found =
        defNames?.has(name) || fileStems.has(name) || new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`).test(sourceText);
      if (!found) problems.push(`地圖提到的名稱在程式碼中找不到：${token}`);
    }
  }
  // src 下的每個目錄都應該出現在地圖裡
  const dirs = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory() && !e.name.startsWith(".")) {
        dirs.push(rel(path.join(dir, e.name)));
        walk(path.join(dir, e.name));
      }
    }
  };
  walk(path.join(ROOT, "src"));
  for (const d of dirs) {
    const short = d.replace(/^src\//, "").replace(/^components\//, "");
    const base = path.basename(d);
    if (![d, `${short}/`, `\`${base}/`].some((s) => section.includes(s))) problems.push(`目錄未寫進地圖：${d}/`);
  }
}

// ---- --at 檔案:行 ----

function lookupAt(arg) {
  const m = /^(.+):(\d+)$/.exec(arg ?? "");
  if (!m) {
    console.log("用法：node scripts/code-index.mjs --at 檔案:行");
    process.exit(2);
  }
  const [, file, lineText] = m;
  const line = Number(lineText);
  const target = path.relative(ROOT, path.resolve(ROOT, file));
  const text = fs.readFileSync(INDEX_PATH, "utf8");
  const hits = [...text.matchAll(/^DEF (\S+):(\d+)-(\d+) (.*)$/gm)]
    .filter(([, f, s, e]) => f === target && Number(s) <= line && line <= Number(e))
    .sort((a, b) => Number(a[3]) - Number(a[2]) - (Number(b[3]) - Number(b[2])));
  if (!hits.length) {
    console.log(`${target}:${line} 不在任何頂層定義內（可能是 import 或檔案層級的程式碼）`);
    return;
  }
  for (const [, f, s, e, rest] of hits) console.log(`${f}:${s}-${e} ${rest}  （Read offset=${s} limit=${Number(e) - Number(s) + 1}）`);
}

if (process.argv.includes("--at")) {
  lookupAt(process.argv[process.argv.indexOf("--at") + 1]);
} else if (process.argv.includes("--check")) {
  const problems = [];
  const defNames = checkIndex(problems);
  checkMap(problems, defNames);
  if (problems.length) {
    console.log(problems.map((p) => `- ${p}`).join("\n"));
    process.exit(1);
  }
  console.log("code-index --check：索引為最新，地圖的路徑與名稱都存在。");
} else {
  buildIndex();
}
