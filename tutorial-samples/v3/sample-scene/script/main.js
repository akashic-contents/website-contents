function main() {
	g.game.pushScene(createSceneA());
}

function createSceneA() {
	const scene = new g.Scene({ game: g.game });
	scene.onLoad.add(() => {
		scene.append(createRect(scene, "red"));
		scene.onPointDownCapture.add(() => {
			g.game.replaceScene(createSceneB());
		});
	});
	return scene;
}

function createSceneB() {
	const scene = new g.Scene({ game: g.game });
	scene.onLoad.add(() => {
		scene.append(createRect(scene, "blue"));
		scene.onPointDownCapture.add(() => {
			g.game.replaceScene(createSceneA());
		});
	});
	return scene;
}

function createRect(scene, color) {
	return new g.FilledRect({
		scene: scene,
		cssColor: color,
		width: 32,
		height: 32
	});
}

module.exports = main;
