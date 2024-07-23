function main(param) {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのファイルパスを列挙し、シーンに通知します
		assetPaths: ["/audio/se"]
	});
	scene.onLoad.add(() => {
		// クリックで音を鳴らす
		const soundRect = createButtonRect(scene, 50, 50, "green", "SE");
		soundRect.onPointDown.add(() => {
			scene.asset.getAudio("/audio/se").play();
		});
		scene.append(soundRect);
	});
	g.game.pushScene(scene);
}

const font = new g.DynamicFont({
	game: g.game,
	fontFamily: "sans-serif",
	size: 48
});

function createButtonRect(scene, x, y, color, text) {
	const rect = new g.FilledRect({
		scene: scene,
		x: x,
		y: y,
		width: 100,
		height: 100,
		cssColor: color,
		touchable: true
	});
	const label = new g.Label({
		scene: scene,
		text: text,
		font: font,
		fontSize: 0.75 * font.size,
		x: 25,
		y: 30,
		textColor: "black"
	});
	rect.append(label);
	rect.onPointDown.add(() => {
		rect.opacity = 0.5;
		rect.modified();
	});
	rect.onPointUp.add(() => {
		rect.opacity = 1;
		rect.modified();
	});
	return rect;
}

module.exports = main;
