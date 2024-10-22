"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
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
    assetPaths: ["/image/handsign_fist.png", "/image/handsign_victory.png", "/image/handsign_open.png"]
  });
}
var GameScene = /*#__PURE__*/function (_g$Scene) {
  function GameScene(param) {
    var _this;
    _classCallCheck(this, GameScene);
    _this = _callSuper(this, GameScene, [param]);
    _this.currentPlayerIds = param.playerIds;
    _this.broadcasterId = param.broadcasterId;
    _this.font = param.font;
    _this.graceSec = 10;
    _this.onMessage.add(function (event) {
      _this.onMessageEvent(event);
    });
    _this.onLoad.add(function () {
      _this._startSelectPhase();
    });
    return _this;
  }
  _inherits(GameScene, _g$Scene);
  return _createClass(GameScene, [{
    key: "onMessageEvent",
    value: function onMessageEvent(event) {
      var messageType = event.data.messageType;
      switch (messageType) {
        case "changetoselectphase":
          this._startSelectPhase();
          break;
        case "selectJanken":
          this._onSelectMessageReceived(event);
          break;
        default:
        // do nothing
      }
    }
  }, {
    key: "getJankenImageAsset",
    value: function getJankenImageAsset(handsign) {
      switch (handsign) {
        case "guu":
          return this.asset.getImage("/image/handsign_fist.png");
        case "choki":
          return this.asset.getImage("/image/handsign_victory.png");
        case "paa":
          return this.asset.getImage("/image/handsign_open.png");
        default:
        // do nothing
      }
    }
  }, {
    key: "_onSelectMessageReceived",
    value: function _onSelectMessageReceived(event) {
      var playerId = event.player.id;
      var handsign = event.data.handSign;
      if (this.currentPlayerIds.has(playerId)) this.selectResults[playerId] = handsign;
    }
  }, {
    key: "_startSelectPhase",
    value: function _startSelectPhase() {
      var _this2 = this;
      this._resetEntityLayer();
      // 前回のじゃんけん集計結果をリセット
      this.selectResults = {};
      // もしplayerIdsに自分のidがあればボタンを表示
      if (this.currentPlayerIds.has(g.game.selfId)) this._createJankenButtons();
      this._createTimer();
      this.setTimeout(function () {
        _this2._startJudgePhase();
      }, 1000 * this.graceSec);
    }
  }, {
    key: "_startJudgePhase",
    value: function _startJudgePhase() {
      this._resetEntityLayer();
      this._createResultView();
      // 勝ち残ったプレイヤーリストを更新
      var handsignCount = this._updateSurvivePlayer();
      // 勝敗ラベルを表示
      this._createWinLoseLabel(handsignCount);
      if (this.currentPlayerIds.size <= 1) {
        // 残りプレイヤー数が1または0の場合、ゲーム終了
        this._endGame();
      } else {
        // 配信者に次のじゃんけん開始ボタンを表示
        if (g.game.selfId === this.broadcasterId) this._createNextSelectButton();
      }
    }
  }, {
    key: "_resetEntityLayer",
    value: function _resetEntityLayer() {
      if (this.entityLayer && !this.entityLayer.destroyed()) this.entityLayer.destroy();
      this.entityLayer = new g.E({
        scene: this
      });
      this.append(this.entityLayer);
    }
  }, {
    key: "_createJankenButtons",
    value: function _createJankenButtons() {
      var guu = (0, JankenButton_1.createJankenButton)(this, "guu", true);
      var choki = (0, JankenButton_1.createJankenButton)(this, "choki", true);
      var paa = (0, JankenButton_1.createJankenButton)(this, "paa", true);
      var onPointHandsign = function onPointHandsign(handsign) {
        if (handsign !== "guu") guu.hide();
        if (handsign !== "choki") choki.hide();
        if (handsign !== "paa") paa.hide();
      };
      guu.onPointDown.add(function () {
        onPointHandsign("guu");
      });
      choki.onPointDown.add(function () {
        onPointHandsign("choki");
      });
      paa.onPointDown.add(function () {
        onPointHandsign("paa");
      });
      guu.x = g.game.width / 2 - 100;
      choki.x = g.game.width / 2;
      paa.x = g.game.width / 2 + 100;
      guu.y = g.game.height / 2;
      choki.y = g.game.height / 2;
      paa.y = g.game.height / 2;
      this.entityLayer.append(guu);
      this.entityLayer.append(choki);
      this.entityLayer.append(paa);
    }
  }, {
    key: "_createTimer",
    value: function _createTimer() {
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
    }
  }, {
    key: "_createWinLoseLabel",
    value: function _createWinLoseLabel(handsignCount) {
      var text;
      if (handsignCount === 2) {
        // 勝敗が決まった場合
        text = this.currentPlayerIds.has(g.game.selfId) ? "win" : "lose";
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
    }
  }, {
    key: "_endGame",
    value: function _endGame() {
      var label = new g.Label({
        scene: this,
        font: this.font,
        text: this.currentPlayerIds.has(g.game.selfId) ? "you win!" : "you lose...",
        textAlign: "center",
        x: g.game.width / 2,
        anchorX: 0.5,
        y: g.game.height / 4 * 3,
        local: true
      });
      this.entityLayer.append(label);
    }
  }, {
    key: "_createNextSelectButton",
    value: function _createNextSelectButton() {
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
    }
  }, {
    key: "_createResultView",
    value: function _createResultView() {
      var _this3 = this;
      // 参加プレイヤーの手を表示
      var xCapacity = Math.floor(g.game.width / 100);
      var yCapacity = Math.floor(g.game.height / 100);
      Object.keys(this.selectResults).forEach(function (playerId, index) {
        if (playerId === g.game.selfId) return; // 自分の手は一覧に含めない
        var handsign = _this3.selectResults[playerId];
        var sprite = (0, JankenButton_1.createJankenButton)(_this3, handsign, false);
        sprite.x = index % xCapacity * 100 + 50;
        sprite.y = Math.floor(index / yCapacity) * 100 + 50;
        _this3.entityLayer.append(sprite);
      });
      // 自分の手が集計されていれば表示
      if (this.selectResults[g.game.selfId]) {
        var sprite = (0, JankenButton_1.createJankenButton)(this, this.selectResults[g.game.selfId], false);
        sprite.x = g.game.width / 2;
        sprite.y = g.game.height - sprite.height / 2;
        this.entityLayer.append(sprite);
      }
    }
  }, {
    key: "_updateSurvivePlayer",
    value: function _updateSurvivePlayer() {
      var _this4 = this;
      // プレイヤーのハンドサインを集計する
      var handsigns = new Set();
      var selection = {
        guu: new Set(),
        choki: new Set(),
        paa: new Set()
      };
      Object.keys(this.selectResults).forEach(function (playerId) {
        var handsign = _this4.selectResults[playerId];
        handsigns.add(handsign);
        selection[handsign].add(playerId);
      });
      // 集計結果に応じた処理
      // NOTE: ハンドサインを選択しなかったプレイヤーは playerIds に引き継がず、放置プレイヤーは負け扱いとなる
      var size = handsigns.size;
      var survivedPlayerIds;
      if (size === 2) {
        // ハンドサインが2種類の場合、勝敗が決まる
        // 勝利したプレイヤー以外をplayerIdsから除外する
        if (selection.guu.size === 0) {
          survivedPlayerIds = selection.choki;
        } else if (selection.choki.size === 0) {
          survivedPlayerIds = selection.paa;
          ;
        } else if (selection.paa.size === 0) {
          survivedPlayerIds = selection.guu;
        }
      } else if (size === 3 || size === 1) {
        // あいこ
        survivedPlayerIds = mergeSets([selection.guu, selection.choki, selection.paa]);
      } else if (size === 0) {
        // 参加プレイヤーなし
        // ゲーム終了フェーズへ移行する
      }
      this.currentPlayerIds = survivedPlayerIds;
      return size;
    }
  }]);
}(g.Scene);
exports.GameScene = GameScene;
function mergeSets(sets) {
  var mergedSet = new Set();
  sets.forEach(function (set) {
    set.forEach(mergedSet.add, mergedSet);
  });
  return mergedSet;
}