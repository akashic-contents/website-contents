function main(param) {
    var scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["font", "font_glyphs"]
    });
    scene.loaded.add(function () {
		// 生成した font.png と font_glyphs.json に対応するアセットを取得
		var fontAsset = g.game.scene().assets["font"];
		var fontGlyphAsset = g.game.scene().assets["font_glyphs"];

		// テキストアセット (JSON) の内容をオブジェクトに変換
		var glyphData = JSON.parse(fontGlyphAsset.data);

		// ビットマップフォントを生成
		var font = new g.BitmapFont({
			src: fontAsset,
			map: glyphData.map,
			defaultGlyphWidth: glyphData.width,
			defaultGlyphHeight: glyphData.height,
			missingGlyph: glyphData.missingGlyph
		});
		var label = new g.Label({
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
