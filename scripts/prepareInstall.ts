import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { listGameJsonDirs } from "./lib/listGameJsonDirs";
import { readJSON } from "./lib/readJSON";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const exec = promisify(_exec);
const rootDir = resolve(__dirname, "..");
const contentsDir = join(rootDir, "contents");

try {
	const directories = await listGameJsonDirs(rootDir, contentsDir);

	for (const directory of directories) {
		const packageJsonPath = join(rootDir, directory, "package.json");
		if (!existsSync(packageJsonPath)) continue;

		const { dependencies } = await readJSON<{ dependencies: Record<string, string> }>(packageJsonPath);
		if (!dependencies) continue; // devDependencies など実行時に参照されないモジュールは無視する

		await exec("npm install --omit=dev --ignore-scripts --no-package-lock", { cwd: join(rootDir, directory) });
	}
	console.log("npm install of content completed successfully");
} catch (error) {
	console.error(error);
	process.exitCode = 1;
}
