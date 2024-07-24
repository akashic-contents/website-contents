import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { compress } from "./lib/compress";
import { listGameJsonDirs } from "./lib/listGameJsonDirs";
import { readJSON } from "./lib/readJSON";
import micromatch from "micromatch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const exec = promisify(_exec);

const rootDir = resolve(__dirname, "..");
const contentsDir = join(rootDir, "contents");
const tutorialSamplesDir = join(contentsDir, "tutorial-samples");
const distDir = join(rootDir, "dist");
const publishDir = join(rootDir, "public");
const ignore = ["**/__reftest/**"];

export interface ContentsMap {
	[name: string]: {
		gameJson: unknown;
	};
}

try {
	// 1. dist/**/*.zip の作成
	{
		await mkdir(distDir, { recursive: true });
		const directories = await listGameJsonDirs(rootDir, tutorialSamplesDir);

		for (const directory of directories) {
			const filename = relative(contentsDir, directory).split("/").join("-") + ".zip";
			const dist = join(distDir, filename);

			console.log(`compress ${directory} to ${filename}`);
			await compress(directory, dist, ignore);
		}
	}

	// 2. public/**/* の作成
	{
		await rm(publishDir, { recursive: true, force: true });
		await mkdir(publishDir, { recursive: true });

		const filter = (src: string, _dest: string) => !micromatch.isMatch(src, ignore);
		await cp(contentsDir, publishDir, { recursive: true, filter });

		const contentsMap: ContentsMap = Object.create(null);
		const directories = await listGameJsonDirs(rootDir, publishDir);

		for (const directory of directories) {
			const gameJsonPath = join(rootDir, directory, "game.json");
			const gameJson = await readJSON(gameJsonPath);
			contentsMap[relative(publishDir, directory)] = { gameJson };

			const packageJsonPath = join(rootDir, directory, "package.json");
			if (!existsSync(packageJsonPath)) continue;

			console.log(`preparing ${directory}`);
			const { dependencies } = await readJSON<{ dependencies: Record<string, string> }>(packageJsonPath);
			if (!dependencies) continue; // devDependencies など実行時に参照されないモジュールは無視する

			await exec("npm install --omit=dev --ignore-scripts --no-package-lock", { cwd: join(rootDir, directory) });
			// TODO: この時点で再度 akashic scan globalScripts をすべきかもしれない
		}

		await writeFile(join(publishDir, "contents.json"), JSON.stringify(contentsMap));
	}

	console.log("complete successfully");
} catch (error) {
	console.error(error);
	process.exitCode = 1;
}
