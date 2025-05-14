const game = g.game;
module.exports = function () {
    const scene = new g.Scene({
        game: game,
        assetPaths: ["/image/switch.png", "/audio/bgm1"]
    });

    scene.onLoad.add(() => {
        const back = new g.FilledRect({
            scene: scene,
            cssColor: "#282840",
            opacity: 0.5,
            width: game.width,
            height: game.height
        });

        // bgm1 の AudioPlayContext を作成
        const bgm1Asset = scene.asset.getAudio("/audio/bgm1");
        const bgm1 = g.game.audio.create(bgm1Asset);

        // スイッチのフレームスプライトを生成
        const sw = new g.FrameSprite({
            scene: scene,

            // オンとオフの画像(それぞれ縦横48ピクセル)が２つ並んだ画像を使用
            src: scene.asset.getImage("/image/switch.png"),

            // 画面の中央に配置
            x: (game.width - 48) / 2,
            y: (game.height - 48) / 2,

            // 表示サイズ
            width: 48,
            height: 48,

            // 画像片サイズ
            srcWidth: 48,
            srcHeight: 48,

            // 画像片の表示順
            frames: [1, 0],

            // タッチイベントを検出できるように設定
            touchable: true
        });

        // スイッチがタッチされた時の処理を登録
        sw.onPointDown.add(() => {
            // フレーム番号を 0, 1 で切り替え
            sw.frameNumber++;
            sw.frameNumber %= 2;
            sw.modified();

            if (back.visible()) {
                bgm1.play(); // bgm の AudioPlayContext を再生
                back.hide();
            } else {
                bgm1.stop(); // bgm の AudioPlayContext を停止
                back.show();
            }
        });

        scene.append(sw);

        // backはswの前面に配置されますが、touchable=trueとしてないので、ポイントイベント
        // の判定対象となりません。そのため、swは背面にあってもポイントイベントを
        // 検出することが出来ます。
        scene.append(back);
    });

    g.game.pushScene(scene);
}
