function main(param) {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのファイルパスを列挙し、シーンに通知します
		assetPaths: ["/image/explosion.png"]
	});
	scene.onLoad.add(() => {
		// シーンの update を使用したアニメーション
		const rect = createRect(scene);
		scene.append(rect);
		// scene の onUpdate を設定し、毎フレーム実行する処理を記述
		scene.onUpdate.add(() => {
			++rect.x;
			rect.modified();
		});

		// フレームアニメーション
		const frameSprite = new g.FrameSprite({
			scene: scene,
			src: scene.asset.getImage("/image/explosion.png"),
			// エンティティのサイズ
			width: 100,
			height: 100,
			// 元画像のフレーム1つのサイズ
			srcWidth: 100,
			srcHeight: 100,
			x: 100,
			y: 100,
			// アニメーションに利用するフレームのインデックス配列
			// インデックスは元画像の左上から右にsrcWidthとsrcHeightの矩形を並べて数え上げ、右端に達したら一段下の左端から右下に達するまで繰り返す
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			// アニメーションをループする（省略した場合ループする）
			loop: true
		});
		scene.append(frameSprite);
		frameSprite.start();

		// タイマーを使用したアニメーション
		const rect2 = createRect(scene);
		scene.append(rect2);
		const intervalId = scene.setInterval(() => {
			rect2.x += 10;
			rect2.y = 50;
			rect2.modified();
		}, 200);
		scene.setTimeout(() => {
			scene.clearInterval(intervalId);
		}, 3000);
	});
	g.game.pushScene(scene);
}

function createRect(scene) {
	return new g.FilledRect({
		scene: scene,
		width: 30,
		height: 30,
		cssColor: "red"
	});
}

module.exports = main;
