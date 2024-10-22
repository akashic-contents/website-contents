"use strict";
const GameScene_1 = require("./GameScene");
function main(param) {
    let broadcasterId;
    const playerIds = new Set();
    const font = new g.DynamicFont({
        fontFamily: "sans-serif",
        game: g.game,
        size: 24
    });
    const scene = new g.Scene({ game: g.game });
    scene.onLoad.add(() => {
        const joinButton = new g.Label({
            scene,
            font,
            textColor: "black",
            text: "join game",
            textAlign: "center",
            x: g.game.width / 2,
            anchorX: 0.5,
            y: g.game.height / 2,
            touchable: true,
        });
        joinButton.onPointDown.add((event) => {
            playerIds.add(event.player.id);
            // 参加ボタンを押したらそのインスタンスでボタンを非表示にする
            if (event.player.id == g.game.selfId) {
                const rect = new g.FilledRect({
                    scene,
                    cssColor: "white",
                    width: joinButton.width,
                    height: joinButton.height,
                    x: g.game.width / 2,
                    anchorX: 0.5,
                    y: g.game.height / 2,
                    local: true
                });
                scene.append(rect);
            }
        });
        scene.append(joinButton);
        g.game.onJoin.addOnce((event) => {
            broadcasterId = event.player.id;
            if (g.game.selfId === broadcasterId) {
                const startButton = new g.Label({
                    scene,
                    font,
                    text: "start game",
                    textAlign: "center",
                    x: g.game.width / 2,
                    anchorX: 0.5,
                    y: g.game.height / 4 * 3,
                    touchable: true,
                    local: true
                });
                startButton.onPointDown.add(() => {
                    const data = {
                        messageType: "start"
                    };
                    g.game.raiseEvent(new g.MessageEvent(data));
                });
                scene.append(startButton);
            }
        });
    });
    scene.onMessage.add((event) => {
        if (event.data.messageType === "start") {
            g.game.replaceScene((0, GameScene_1.createGameScene)(broadcasterId, playerIds, font));
        }
    });
    g.game.pushScene(scene);
}
module.exports = main;
