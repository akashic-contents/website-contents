function main(param) {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのファイルパスを列挙し、シーンに通知します
		assetPaths: ["/image/player.png", "/image/shot.png", "/audio/se"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します
		const seAsset = scene.asset.getAudio("/audio/se");

		// プレイヤーを生成します
		const player = new g.Sprite({
			scene: scene,
			src: scene.asset.getImage("/image/player.png"),
			width: scene.asset.getImage("/image/player.png").width,
			height: scene.asset.getImage("/image/player.png").height
		});

		// プレイヤーの初期座標を、画面の中心に設定します
		player.x = (g.game.width - player.width) / 2;
		player.y = (g.game.height - player.height) / 2;
		player.onUpdate.add(() => {
			// 毎フレームでY座標を再計算し、プレイヤーの飛んでいる動きを表現します
			// ここではMath.sinを利用して、時間経過によって増加するg.game.ageと組み合わせて
			player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;

			// プレイヤーの座標に変更があった場合、 modified() を実行して変更をゲームに通知します
			player.modified();
		});

		// 画面をタッチしたとき、SEを鳴らします
		scene.onPointDownCapture.add(() => {
			g.game.audio.play(seAsset);

			// プレイヤーが発射する弾を生成します
			const shot = new g.Sprite({
				scene: scene,
				src: scene.asset.getImage("/image/shot.png"),
				width: scene.asset.getImage("/image/shot.png").width,
				height: scene.asset.getImage("/image/shot.png").height
			});

			// 弾の初期座標を、プレイヤーの少し右に設定します
			shot.x = player.x + player.width;
			shot.y = player.y;
			shot.onUpdate.add(() => {
				// 毎フレームで座標を確認し、画面外に出ていたら弾をシーンから取り除きます
				if (shot.x > g.game.width) shot.destroy();

				// 弾を右に動かし、弾の動きを表現します
				shot.x += 10;

				// 変更をゲームに通知します
				shot.modified();
			});
			scene.append(shot);
		});
		scene.append(player);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

module.exports = main;
