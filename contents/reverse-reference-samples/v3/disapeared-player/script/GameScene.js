"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameScene = void 0;
exports.createGameScene = createGameScene;
var JankenButton_1 = require("./JankenButton");
function createGameScene(broadcasterId, playerIds, font) {
  return new GameScene({
    game: g.game,
    broadcasterId: broadcasterId,
    playerIds: playerIds,
    font: font,
    assetIds: ["handsign_fist", "handsign_victory", "handsign_open"]
  });
}
var GameScene = /** @class */function (_super) {
  __extends(GameScene, _super);
  function GameScene(param) {
    var _this = _super.call(this, param) || this;
    _this.playerIds = param.playerIds;
    _this.broadcasterId = param.broadcasterId;
    _this.font = param.font;
    _this.graceSec = 10;
    _this.onMessage.add(function (event) {
      _this.onMessageEvent(event);
    });
    _this.onLoad.add(function () {
      _this._createSelectPhase();
    });
    return _this;
  }
  GameScene.prototype.onMessageEvent = function (event) {
    var messageType = event.data.messageType;
    switch (messageType) {
      case "changetojudgephase":
        this._createJudgePhase();
        break;
      case "changetoselectphase":
        this._createSelectPhase();
        break;
      case "selectJanken":
        this._onSelectMessageReceived(event);
        break;
      default:
      // do nothing
    }
  };
  GameScene.prototype.getJankenImageAsset = function (handsign) {
    switch (handsign) {
      case "fist":
        return this.asset.getImageById("handsign_fist");
      case "victory":
        return this.asset.getImageById("handsign_victory");
      case "open":
        return this.asset.getImageById("handsign_open");
      default:
      // do nothing
    }
  };
  GameScene.prototype._onSelectMessageReceived = function (event) {
    var playerId = event.player.id;
    var handsign = event.data.handSign;
    if (this.playerIds.has(playerId)) this.selectResults[playerId] = handsign;
  };
  GameScene.prototype._createSelectPhase = function () {
    this._resetEntityLayer();
    // 前回のじゃんけん集計結果をリセット
    this.selectResults = {};
    // もしplayerIdsに自分のidがあればボタンを表示
    if (this.playerIds.has(g.game.selfId)) this._createJankenButtons();
    this._createTimer();
    if (g.game.isActiveInstance()) {
      this.setTimeout(function () {
        var data = {
          messageType: "changetojudgephase"
        };
        g.game.raiseEvent(new g.MessageEvent(data));
      }, 1000 * this.graceSec);
    }
  };
  GameScene.prototype._createJudgePhase = function () {
    this._resetEntityLayer();
    this._createResultView();
    // 勝ち残ったプレイヤーリストを更新
    var handsignCount = this._updateSurvivePlayer();
    // 勝敗ラベルを表示
    this._createWinLoseLabel(handsignCount);
    if (this.playerIds.size <= 1) {
      // 残りプレイヤー数が1または0の場合、ゲーム終了
      this._endGame();
    } else {
      // 配信者に次のじゃんけん開始ボタンを表示
      if (g.game.selfId === this.broadcasterId) this._createNextSelectButton();
    }
  };
  GameScene.prototype._resetEntityLayer = function () {
    if (this.entityLayer && !this.entityLayer.destroyed()) this.entityLayer.destroy();
    this.entityLayer = new g.E({
      scene: this
    });
    this.append(this.entityLayer);
  };
  GameScene.prototype._createJankenButtons = function () {
    var fist = (0, JankenButton_1.createJankenButton)(this, "fist", true);
    var victory = (0, JankenButton_1.createJankenButton)(this, "victory", true);
    var open = (0, JankenButton_1.createJankenButton)(this, "open", true);
    var onPointHandsign = function onPointHandsign(handsign) {
      if (handsign !== "fist") fist.hide();
      if (handsign !== "victory") victory.hide();
      if (handsign !== "open") open.hide();
    };
    fist.onPointDown.add(function () {
      onPointHandsign("fist");
    });
    victory.onPointDown.add(function () {
      onPointHandsign("victory");
    });
    open.onPointDown.add(function () {
      onPointHandsign("open");
    });
    fist.x = g.game.width / 2 - 100;
    victory.x = g.game.width / 2;
    open.x = g.game.width / 2 + 100;
    fist.y = g.game.height / 2;
    victory.y = g.game.height / 2;
    open.y = g.game.height / 2;
    this.entityLayer.append(fist);
    this.entityLayer.append(victory);
    this.entityLayer.append(open);
  };
  GameScene.prototype._createTimer = function () {
    var timer = new g.Label({
      scene: this,
      font: this.font,
      text: "",
      anchorX: 0.5,
      x: g.game.width / 2,
      y: 0
    });
    var lestSec = this.graceSec;
    timer.onUpdate.add(function () {
      lestSec = lestSec - 1 / g.game.fps;
      timer.text = String(Math.floor(lestSec));
      timer.invalidate();
    });
    this.entityLayer.append(timer);
  };
  GameScene.prototype._createWinLoseLabel = function (handsignCount) {
    var text;
    if (handsignCount === 2) {
      // 勝敗が決まった場合
      text = this.playerIds.has(g.game.selfId) ? "win" : "lose";
    } else {
      text = "draw";
    }
    var label = new g.Label({
      scene: this,
      font: this.font,
      text: text,
      textAlign: "center",
      x: g.game.width / 2,
      anchorX: 0.5,
      y: g.game.height / 4 * 3 - 50,
      local: true
    });
    this.entityLayer.append(label);
  };
  GameScene.prototype._endGame = function () {
    var label = new g.Label({
      scene: this,
      font: this.font,
      text: this.playerIds.has(g.game.selfId) ? "you win!" : "you lose...",
      textAlign: "center",
      x: g.game.width / 2,
      anchorX: 0.5,
      y: g.game.height / 4 * 3,
      local: true
    });
    this.entityLayer.append(label);
  };
  GameScene.prototype._createNextSelectButton = function () {
    var button = new g.Label({
      scene: this,
      font: this.font,
      text: "next",
      textAlign: "center",
      x: g.game.width / 2,
      anchorX: 0.5,
      y: g.game.height / 4 * 3,
      touchable: true,
      local: true
    });
    button.onPointDown.add(function () {
      var data = {
        messageType: "changetoselectphase"
      };
      g.game.raiseEvent(new g.MessageEvent(data));
    });
    this.entityLayer.append(button);
  };
  GameScene.prototype._createResultView = function () {
    var _this = this;
    // 参加プレイヤーの手を表示
    var xCapacity = Math.floor(g.game.width / 100);
    var yCapacity = Math.floor(g.game.height / 100);
    Object.keys(this.selectResults).forEach(function (key, index) {
      if (key === g.game.selfId) return; // 自分の手は一覧に含めない
      var handsign = _this.selectResults[key];
      var sprite = (0, JankenButton_1.createJankenButton)(_this, handsign, false);
      sprite.x = index % xCapacity * 100 + 50;
      sprite.y = Math.floor(index / yCapacity) * 100 + 50;
      _this.entityLayer.append(sprite);
    });
    // 自分の手が集計されていれば表示
    if (this.selectResults[g.game.selfId]) {
      var sprite = (0, JankenButton_1.createJankenButton)(this, this.selectResults[g.game.selfId], false);
      sprite.x = g.game.width / 2;
      sprite.y = g.game.height - sprite.height / 2;
      this.entityLayer.append(sprite);
    }
  };
  GameScene.prototype._updateSurvivePlayer = function () {
    var _this = this;
    // プレイヤーのハンドサインを集計する
    var handsigns = new Set();
    var openPlayerIds = new Set();
    var victoryPlayerIds = new Set();
    var fistPlayerIds = new Set();
    Object.keys(this.selectResults).forEach(function (key) {
      var handsign = _this.selectResults[key];
      handsigns.add(handsign);
      switch (handsign) {
        case "fist":
          fistPlayerIds.add(key);
          break;
        case "victory":
          victoryPlayerIds.add(key);
          break;
        case "open":
          openPlayerIds.add(key);
          break;
        default:
        // do nothing
      }
    });
    // 集計結果に応じた処理
    // NOTE: ハンドサインを選択しなかったプレイヤーは playerIds に引き継がず、放置プレイヤーは負け扱いとする
    var size = handsigns.size;
    if (size === 2) {
      // ハンドサインが2種類の場合、勝敗が決まる
      // 勝利したプレイヤー以外をplayerIdsから除外する
      if (fistPlayerIds.size === 0) {
        this.playerIds = victoryPlayerIds;
      } else if (victoryPlayerIds.size === 0) {
        this.playerIds = openPlayerIds;
      } else if (openPlayerIds.size === 0) {
        this.playerIds = fistPlayerIds;
      }
    } else if (size === 3 || size === 1) {
      // あいこ
      openPlayerIds;
      this.playerIds = mergeSets([openPlayerIds, victoryPlayerIds, fistPlayerIds]);
    } else if (size === 0) {
      // 参加プレイヤーなし
      // ゲーム終了フェーズへ移行するべき
    } else {
      // 到達しない
    }
    return size;
  };
  return GameScene;
}(g.Scene);
exports.GameScene = GameScene;
function mergeSets(sets) {
  var mergedSet = new Set();
  sets.forEach(function (set) {
    set.forEach(mergedSet.add, mergedSet);
  });
  return mergedSet;
}