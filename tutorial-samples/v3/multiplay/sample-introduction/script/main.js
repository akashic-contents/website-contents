function main(param) {
	const scene = new g.Scene({
		game: g.game,
		assetPaths: ["/image/chara.png"]
	});

	scene.onLoad.add(() => {
		const characters = {}; // キャラクタ管理テーブル
		// 画面内のどこかが押されたとき
		scene.onPointDownCapture.add((ev) => {
			const x = ev.point.x; // 押された位置のX座標
			const y = ev.point.y; // 押された位置のY座標
			const playerId = ev.player.id; // 押したプレイヤーのID
			if (characters[playerId] == null) {
				// プレイヤー playerId にとって初めての操作の場合: キャラクタデータを生成
				const chara = {
					targetX: x,
					targetY: y,
					entity: new g.Sprite({
						scene: scene,
						src: scene.asset.getImage("/image/chara.png"),
						x: x,
						y: y
					})
				};
				characters[playerId] = chara;
				// キャラクタのフレームごとの処理(目標座標 (targetX, targetY) に近づくように位置を更新)を登録
				chara.entity.onUpdate.add(() => {
					const diffX = chara.targetX - chara.entity.x;
					const diffY = chara.targetY - chara.entity.y;
					// 既に目標座標にいるなら何もせず抜ける
					if (diffX === 0 && diffY === 0)
						return;
					// 目標座標から各軸10px以上離れていたら、1割ずつ接近。10px以下なら目標座標に移動
					chara.entity.x += Math.abs(diffX) > 10 ? Math.floor(diffX / 10) : diffX;
					chara.entity.y += Math.abs(diffY) > 10 ? Math.floor(diffY / 10) : diffY;
					chara.entity.modified(); // 変更を反映
				});
				scene.append(chara.entity); // シーンに生成したキャラクタ画像を追加
			}
			else {
				// プレイヤー playerId のキャラが既にいる場合: キャラの目標座標を、クリックされた位置に更新
				characters[playerId].targetX = x;
				characters[playerId].targetY = y;
			}
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
