import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

// game.json が存在するパスを返す
export async function listGameJsonDirs(baseDir: string, dir: string): Promise<string[]> {
	let result: string[] = [];

	const items = await readdir(dir, { withFileTypes: true });
	for (const item of items) {
		const itemPath = join(dir, item.name);

		if (item.isDirectory()) {
			const subDirResults = await listGameJsonDirs(baseDir, itemPath);
			result = result.concat(subDirResults);
		} else if (item.isFile() && item.name === "game.json") {
			result.push(relative(baseDir, dir));
		}
	}

	return result;
}
