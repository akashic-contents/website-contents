"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = void 0;
exports.createGameScene = createGameScene;
const JankenButton_1 = require("./JankenButton");
function createGameScene(broadcasterId, playerIds, font) {
    return new GameScene({
        game: g.game,
        broadcasterId,
        playerIds,
        font,
        assetPaths: [
            "/image/handsign_guu.png",
            "/image/handsign_choki.png",
            "/image/handsign_paa.png",
        ]
    });
}
class GameScene extends g.Scene {
    constructor(param) {
        super(param);
        this.currentPlayerIds = param.playerIds;
        this.broadcasterId = param.broadcasterId;
        this.font = param.font;
        this.graceSec = 10;
        this.onMessage.add((event) => { this.onMessageEvent(event); });
        this.onLoad.add(() => { this._startSelectPhase(); });
    }
    onMessageEvent(event) {
        const messageType = event.data.messageType;
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
    getJankenImageAsset(handsign) {
        switch (handsign) {
            case "guu":
                return this.asset.getImage("/image/handsign_guu.png");
            case "choki":
                return this.asset.getImage("/image/handsign_choki.png");
            case "paa":
                return this.asset.getImage("/image/handsign_paa.png");
            default:
            // do nothing
        }
    }
    _onSelectMessageReceived(event) {
        const playerId = event.player.id;
        const handsign = event.data.handSign;
        if (this.currentPlayerIds.has(playerId))
            this.selectResults[playerId] = handsign;
    }
    _startSelectPhase() {
        this._resetEntityLayer();
        // 前回のじゃんけん集計結果をリセット
        this.selectResults = {};
        // もしplayerIdsに自分のidがあればボタンを表示
        if (this.currentPlayerIds.has(g.game.selfId))
            this._createJankenButtons();
        this._createTimer();
        this.setTimeout(() => {
            this._startJudgePhase();
        }, 1000 * this.graceSec);
    }
    _startJudgePhase() {
        this._resetEntityLayer();
        this._createResultView();
        // 勝ち残ったプレイヤーリストを更新
        const handsignCount = this._updateSurvivePlayer();
        // 勝敗ラベルを表示
        this._createWinLoseLabel(handsignCount);
        if (this.currentPlayerIds.size <= 1) {
            // 残りプレイヤー数が1または0の場合、ゲーム終了
            this._endGame();
        }
        else {
            // 配信者に次のじゃんけん開始ボタンを表示
            if (g.game.selfId === this.broadcasterId)
                this._createNextSelectButton();
        }
    }
    _resetEntityLayer() {
        if (this.entityLayer && !this.entityLayer.destroyed())
            this.entityLayer.destroy();
        this.entityLayer = new g.E({ scene: this });
        this.append(this.entityLayer);
    }
    _createJankenButtons() {
        const guu = (0, JankenButton_1.createJankenButton)(this, "guu", true);
        const choki = (0, JankenButton_1.createJankenButton)(this, "choki", true);
        const paa = (0, JankenButton_1.createJankenButton)(this, "paa", true);
        const onPointHandsign = (handsign) => {
            if (handsign !== "guu")
                guu.hide();
            if (handsign !== "choki")
                choki.hide();
            if (handsign !== "paa")
                paa.hide();
        };
        guu.onPointDown.add(() => { onPointHandsign("guu"); });
        choki.onPointDown.add(() => { onPointHandsign("choki"); });
        paa.onPointDown.add(() => { onPointHandsign("paa"); });
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
    _createTimer() {
        const timer = new g.Label({
            scene: this,
            font: this.font,
            text: "",
            anchorX: 0.5,
            x: g.game.width / 2,
            y: 0
        });
        let lestSec = this.graceSec;
        timer.onUpdate.add(() => {
            lestSec = lestSec - (1 / g.game.fps);
            timer.text = String(Math.floor(lestSec));
            timer.invalidate();
        });
        this.entityLayer.append(timer);
    }
    _createWinLoseLabel(handsignCount) {
        let text;
        if (handsignCount === 2) {
            // 勝敗が決まった場合
            text = this.currentPlayerIds.has(g.game.selfId) ? "win" : "lose";
        }
        else {
            text = "draw";
        }
        const label = new g.Label({
            scene: this,
            font: this.font,
            text,
            textAlign: "center",
            x: g.game.width / 2,
            anchorX: 0.5,
            y: g.game.height / 4 * 3 - 50,
            local: true
        });
        this.entityLayer.append(label);
    }
    _endGame() {
        const label = new g.Label({
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
    _createNextSelectButton() {
        const button = new g.Label({
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
        button.onPointDown.add(() => {
            const data = {
                messageType: "changetoselectphase"
            };
            g.game.raiseEvent(new g.MessageEvent(data));
        });
        this.entityLayer.append(button);
    }
    _createResultView() {
        // 参加プレイヤーの手を表示
        const xCapacity = Math.floor(g.game.width / 100);
        const yCapacity = Math.floor(g.game.height / 100);
        Object.keys(this.selectResults).forEach((playerId, index) => {
            if (playerId === g.game.selfId)
                return; // 自分の手は一覧に含めない
            const handsign = this.selectResults[playerId];
            const sprite = (0, JankenButton_1.createJankenButton)(this, handsign, false);
            sprite.x = (index % xCapacity) * 100 + 50;
            sprite.y = Math.floor(index / yCapacity) * 100 + 50;
            this.entityLayer.append(sprite);
        });
        // 自分の手が集計されていれば表示
        if (this.selectResults[g.game.selfId]) {
            const sprite = (0, JankenButton_1.createJankenButton)(this, this.selectResults[g.game.selfId], false);
            sprite.x = g.game.width / 2;
            sprite.y = g.game.height - sprite.height / 2;
            this.entityLayer.append(sprite);
        }
    }
    _updateSurvivePlayer() {
        // プレイヤーのハンドサインを集計する
        const handsigns = new Set;
        const selection = { guu: new Set(), choki: new Set(), paa: new Set() };
        Object.keys(this.selectResults).forEach((playerId) => {
            const handsign = this.selectResults[playerId];
            handsigns.add(handsign);
            selection[handsign].add(playerId);
        });
        // 集計結果に応じた処理
        // NOTE: ハンドサインを選択しなかったプレイヤーは playerIds に引き継がず、放置プレイヤーは負け扱いとなる
        const size = handsigns.size;
        let survivedPlayerIds;
        if (size === 2) {
            // ハンドサインが2種類の場合、勝敗が決まる
            // 勝利したプレイヤー以外をplayerIdsから除外する
            if (selection.guu.size === 0) {
                survivedPlayerIds = selection.choki;
            }
            else if (selection.choki.size === 0) {
                survivedPlayerIds = selection.paa;
            }
            else if (selection.paa.size === 0) {
                survivedPlayerIds = selection.guu;
            }
        }
        else if (size === 3 || size === 1) {
            // あいこ
            survivedPlayerIds = mergeSets([selection.guu, selection.choki, selection.paa]);
        }
        else if (size === 0) {
            // 参加プレイヤーなし
            // ゲーム終了フェーズへ移行する
        }
        this.currentPlayerIds = survivedPlayerIds;
        return size;
    }
}
exports.GameScene = GameScene;
function mergeSets(sets) {
    const mergedSet = new Set();
    sets.forEach((set) => {
        set.forEach(mergedSet.add, mergedSet);
    });
    return mergedSet;
}
