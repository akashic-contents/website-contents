"use strict";

var GameScene_1 = require("./GameScene");
function main(param) {
  var broadcasterId;
  var playerIds = new Set();
  var font = new g.DynamicFont({
    fontFamily: "sans-serif",
    game: g.game,
    size: 24
  });
  var scene = new g.Scene({
    game: g.game
  });
  scene.onLoad.add(function () {
    var joinButton = new g.Label({
      scene: scene,
      font: font,
      textColor: "black",
      text: "join game",
      textAlign: "center",
      x: g.game.width / 2,
      anchorX: 0.5,
      y: g.game.height / 2,
      touchable: true
    });
    joinButton.onPointDown.add(function (event) {
      playerIds.add(event.player.id);
      // 参加ボタンを押したらそのインスタンスでボタンを非表示にする
      if (event.player.id == g.game.selfId) {
        var rect = new g.FilledRect({
          scene: scene,
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
    g.game.onJoin.addOnce(function (event) {
      broadcasterId = event.player.id;
      if (g.game.selfId === broadcasterId) {
        var startButton = new g.Label({
          scene: scene,
          font: font,
          text: "start game",
          textAlign: "center",
          x: g.game.width / 2,
          anchorX: 0.5,
          y: g.game.height / 4 * 3,
          touchable: true,
          local: true
        });
        startButton.onPointDown.add(function () {
          var data = {
            messageType: "start"
          };
          g.game.raiseEvent(new g.MessageEvent(data));
        });
        scene.append(startButton);
      }
    });
  });
  scene.onMessage.add(function (event) {
    if (event.data.messageType === "start") {
      g.game.replaceScene((0, GameScene_1.createGameScene)(broadcasterId, playerIds, font));
    }
  });
  g.game.pushScene(scene);
}
module.exports = main;