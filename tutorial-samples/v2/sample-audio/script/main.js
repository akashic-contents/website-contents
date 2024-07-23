function main(param) {
    var scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["se"]
    });
    scene.loaded.add(function () {
		// クリックで音を鳴らす
		scene.pointDownCapture.add(function () {
			scene.assets["se"].play();
		});
    });
    g.game.pushScene(scene);
}
module.exports = main;
