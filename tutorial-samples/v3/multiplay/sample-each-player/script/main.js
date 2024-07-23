function main(param) {
	const scene = new g.Scene({ game: g.game });

	scene.onLoad.add(() => {
		const userColors = {}; // ユーザ別の色テーブル
		// 画面がタッチされた時、矩形を置く
		scene.onPointDownCapture.add((ev) => {
			// 対象がある(他のtouchableに対するpointDown)なら無視
			if (ev.target != null) {
				return;
			}
			// クリックしたプレイヤーの色で矩形を生成
			const rect = new g.FilledRect({
				scene: scene,
				x: ev.point.x,
				y: ev.point.y,
				width: 15,
				height: 15,
				cssColor: userColors[ev.player.id] || "red" // そのプレイヤーの選択している色(なければ赤)
			});
			scene.append(rect);
		});
		// ローカルエンティティで色切り替えボタン (緑)
		const greenButton = new g.FilledRect({
			scene: scene,
			local: true,
			x: 5,
			y: 5,
			width: 10,
			height: 10,
			cssColor: "green",
			touchable: true,
			opacity: 0.3
		});
		greenButton.onPointUp.add((ev) => {
			// ローカルエンティティのUIの表示を変更
			greenButton.opacity = 1;
			greenButton.modified();
			blueButton.opacity = 0.3; // 非選択状態のものは半透明に
			blueButton.modified();
			// 全員に自分の色変更イベントを送信 (後述)
			g.game.raiseEvent(new g.MessageEvent({ color: "green" }));
		});
		scene.append(greenButton);

		// ローカルエンティティ色切り替えボタン (青)
		const blueButton = new g.FilledRect({
			scene: scene,
			local: true,
			x: 20,
			y: 5,
			width: 10,
			height: 10,
			cssColor: "blue",
			touchable: true,
			opacity: 0.3
		});
		blueButton.onPointUp.add(() => {
			// ローカルエンティティのUIの表示を変更
			greenButton.opacity = 0.3; // 非選択状態のものは半透明に
			greenButton.modified();
			blueButton.opacity = 1;
			blueButton.modified();
			// 全員に自分の色変更イベントを送信 (後述)
			g.game.raiseEvent(new g.MessageEvent({ color: "blue" }));
		});
		scene.append(blueButton);
		// (raiseEvent()で全プレイヤーに送信された)MessageEventを受け取る処理: 送信プレイヤーの色情報を更新する
		scene.onMessage.add((msg) => {
			// 関係ないイベントは無視して抜ける
			if (!msg.data || !msg.data.color)
				return;
			// イベントを送信したプレイヤーの色情報を更新する
			userColors[msg.player.id] = msg.data.color;
		});
	});
	g.game.pushScene(scene);
}
module.exports = main;
