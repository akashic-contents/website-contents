function main(param) {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのファイルパスを列挙し、シーンに通知します
		assetPaths: ["/image/font.png", "/text/font_glyphs.json"]
	});
	scene.onLoad.add(() => {
		// 生成した font.png と font_glyphs.json に対応するアセットを取得
		const fontAsset = scene.asset.getImage("/image/font.png");
		const glyphInfo = scene.asset.getJSONContent("/text/font_glyphs.json");

		// ビットマップフォントを生成
		const font = new g.BitmapFont({
			src: fontAsset,
			glyphInfo: glyphInfo
		});
		const label = new g.Label({
			scene: g.game.scene(),
			text: "「こんにちは、アカシックエンジンです」",
			fontSize: 20,
			font: font
		});

		// 画面中央に配置
		label.x = (g.game.width - label.width) / 2;
		label.y = (g.game.height - label.height) / 2;
		label.modified();

		scene.append(label);
	});
	g.game.pushScene(scene);
}
module.exports = main;
