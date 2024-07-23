var rectHeight = 40,
	rectWidth = 60,
	rectMargin = 10;

function main(param) {
    var scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player"]
    });
    scene.loaded.add(function () {
		// ループを使って矩形を格子状に並べます
		var x, y, rect;
		for (y = 0; y < g.game.height; y += rectHeight + rectMargin) {
			for (x = 0; x < g.game.width; x += rectWidth + rectMargin) {
				rect = createRect(scene, x, y);
				scene.append(rect);
			}
		}

		// 画像を表示します
		var sprite = new g.Sprite({
			scene: scene,
			src: scene.assets["player"]
		});
		scene.append(sprite);
	});
    g.game.pushScene(scene);
}

function createRect(scene, x, y) {
	return new g.FilledRect({
		scene: scene,
		x: x,
		y: y,
		width: rectWidth,
		height: rectHeight,
		cssColor: "#7F3F3F"
	});
}

module.exports = main;
