import { spawn, type ChildProcess } from "node:child_process";
import { cpSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const isDev = process.argv.includes("--watch");
const backendRoot = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(backendRoot, "dist");
const envFile = isDev ? ".env.dev" : ".env.prod";

let serverProcess: ChildProcess | undefined;

function restartServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = undefined;
  }

  serverProcess = spawn(process.execPath, [path.join(distDir, "server.js")], {
    cwd: backendRoot,
    stdio: "inherit",
  });
}

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: distDir,
  clean: true,
  dts: false,
  bundle: true,
  splitting: false,
  sourcemap: isDev,
  minify: !isDev,
  external: ["pino-pretty"],
  noExternal: [/.*/],
  banner: {
    js: [
      "import { createRequire as __nodeCreateRequire } from 'node:module';",
      "const require = __nodeCreateRequire(import.meta.url);",
    ].join("\n"),
  },
  async onSuccess() {
    const migrationsSrc = path.join(backendRoot, "migrations");
    const migrationsDest = path.join(distDir, "migrations");
    const journalPath = path.join(migrationsSrc, "meta", "_journal.json");

    if (!existsSync(journalPath)) {
      throw new Error(`Migrações não encontradas em ${migrationsSrc}!`);
    }

    if (!existsSync(distDir)) {
      throw new Error(`Diretório ${distDir} não encontrado!`);
    }

    cpSync(migrationsSrc, migrationsDest, { recursive: true });

    const envSrc = path.join(backendRoot, envFile);
    const envDest = path.join(distDir, ".env");
    if (!existsSync(envSrc)) {
      throw new Error(`Arquivo ${envFile} não encontrado em ${envSrc}!`);
    }
    cpSync(envSrc, envDest);

    writeFileSync(
      path.join(distDir, "package.json"),
      `${JSON.stringify({ type: "module" }, null, "\t")}\n`,
    );

    if (isDev) {
      restartServer();
    }
  },
});
