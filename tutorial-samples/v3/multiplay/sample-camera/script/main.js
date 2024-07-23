function main(_param) {
	const scene = new g.Scene({
		game: g.game,
		assetPaths: ["/image/player.png"]
	});
	const camera = new g.Camera2D({});
	g.game.focusingCamera = camera;

	scene.onLoad.add(() => {
		const sprite = new g.Sprite({
			scene: scene,
			src: scene.asset.getImage("/image/player.png")
		});
		scene.append(sprite);
	});
	scene.onPointDownCapture.add((ev) => {
		if (ev.player.id === g.game.selfId) {
			camera.x -= 10; // 画面表示の X 座標位置を -10 移動する
			camera.modified();
			g.game.modified();
		}
	});
	g.game.pushScene(scene);
}
module.exports = main;
