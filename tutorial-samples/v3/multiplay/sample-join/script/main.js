function main(param) {
	const scene = new g.Scene({ game: g.game });
	let firstJoinedPlayerId = null;
	let joinPlayerCount = 0;
	let joinLabel;
	let infoLabel;
	scene.onLoad.add(() => {
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 22
		});
		joinLabel = new g.Label({
			scene: scene,
			font: font,
			text: "join してください",
			fontSize: 22,
		});
		infoLabel = new g.Label({
			scene: scene,
			font: font,
			text: "",
			fontSize: 20,
			y: 50
		});
		scene.append(joinLabel);
		scene.append(infoLabel);
	});
	g.game.onJoin.add((ev) => {
		if (!firstJoinedPlayerId)
			firstJoinedPlayerId = ev.player.id;

		joinPlayerCount++;
		if (g.game.selfId === firstJoinedPlayerId) {
			joinLabel.text = "あなたが最初にjoinしました";
			joinLabel.invalidate();
		}
		else if (g.game.selfId === ev.player.id) {
			joinLabel.text = "あなたは" + joinPlayerCount + "番目にjoinしました";
			joinLabel.invalidate();
		}
	});
	scene.onUpdate.add(() => {
		if (!firstJoinedPlayerId)
			return;
		if (g.game.selfId === firstJoinedPlayerId) {
			// ニコニコ生放送上で動かす場合、イベントを生成した(＝画面を押下した)のが「放送者」である時のみ実行される
			// ゲームアツマール (マルチプレイ) では、イベントを作成した(＝画面を押下した)のが「部屋を作ったプレイヤー」である時のみ実行される
			if (infoLabel.text === "") {
				infoLabel.text = "あなたが放送者です";
				infoLabel.invalidate();
			}
		}
		else {
			if (!infoLabel.text === "") {
				infoLabel.text = "あなたは参加者です";
				infoLabel.invalidate();
			}
		}
	});
	g.game.pushScene(scene);
}
module.exports = main;
