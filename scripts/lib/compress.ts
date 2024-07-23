import { createWriteStream } from "node:fs";
import archiver from "archiver";

export async function compress(sourceDir: string, outPath: string, ignore?: string | string[]): Promise<void> {
	const archive = archiver("zip", { zlib: { level: 9 } });
	const output = createWriteStream(outPath);

	return new Promise((resolve, reject) => {
		output.on("close", resolve);
		archive.on("error", reject);
		archive.pipe(output);
		archive.glob("**/*", { cwd: sourceDir, ignore });
		archive.finalize();
	});
}
