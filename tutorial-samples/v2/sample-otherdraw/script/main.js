function main(param) {
    var scene = new g.Scene({
        game: g.game,
        assetIds: []
    });
    scene.loaded.add(function () {
		// 文字列の表示
		var font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 15
		});
		var label = new g.Label({
			scene: scene,
			font: font,
			text: "Hello World!",
			fontSize: 15,
			textColor: "blue",
			x: 10,
			y: 20
		});
		scene.append(label);

		// ラベルの更新
		var count = 0;
		var countLabel = new g.Label({
			scene: scene,
			font: font,
			text: count + "",
			fontSize: 30,
			textColor: "black",
			x: 50,
			y: 50
		});
		scene.append(countLabel);
		scene.setInterval(function () {
			countLabel.text = ++count + "";
			countLabel.invalidate();
		}, 500);

		// クリッピング
		var pane = new g.Pane({ scene: scene, width: 50, height: 50, x: 100, y: 100 });
		var rect = new g.FilledRect({
			scene: scene,
			width: 50,
			height: 50,
			x: 10,
			y: 10,
			angle: 30,
			cssColor: "red"
		});
		pane.append(rect);
		scene.append(pane);
		rect.update.add(function () {
			++rect.angle;
			rect.modified();
		});
    });
    g.game.pushScene(scene);
}
module.exports = main;
