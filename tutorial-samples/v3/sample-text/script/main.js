function main(param) {
	const scene = new g.Scene({
		game: g.game
	});
	scene.onLoad.add(() => {
		// 文字列の表示
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 15
		});
		const label = new g.Label({
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
		let count = 0;
		const countLabel = new g.Label({
			scene: scene,
			font: font,
			text: count + "",
			fontSize: 30,
			textColor: "black",
			x: 50,
			y: 50
		});
		scene.append(countLabel);
		scene.setInterval(() => {
			countLabel.text = ++count + "";
			countLabel.invalidate();
		}, 500);

	});
	g.game.pushScene(scene);
}
module.exports = main;
