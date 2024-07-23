function main(param) {
    var scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: ["player"]
    });
    scene.loaded.add(function () {
		// 拡縮と回転
		var sprite = new g.Sprite({
			scene: scene,
			src: scene.assets["player"], // アセットID "player" が画像アセットだとします
			x: g.game.width, // g.game.width と height はゲーム画面の幅と高さです
			y: g.game.height,
			angle: 25,
			scaleX: 2.5,
			scaleY: 2.5,
			anchorX: 1.0, // 1.0 でエンティティの右端
			anchorY: 1.0 // 1.0 でエンティティの下端
		});
		scene.append(sprite);

		// アンカーポイントをエンティティ下端の中央にする
		sprite.anchorX = 0.5;
		sprite.anchorY = 1.0;

		// わかりやすさのため回転をリセット
		sprite.angle = 0;

		// 変更を反映
		sprite.modified();
    });
    g.game.pushScene(scene);
}
module.exports = main;
