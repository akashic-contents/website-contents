"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptionSubscene = void 0;
var subscene_1 = require("../commonNicowariGame/subscene");
var commonAsaInfo_1 = require("./commonAsaInfo");
var asaEx_1 = require("../util/asaEx");
var spriteUtil_1 = require("../util/spriteUtil");
var entityUtil_1 = require("../util/entityUtil");
var commonDefine_1 = require("./commonDefine");
/**
 * 説明文言サブシーンの処理と表示を行うクラス
 */
var DescriptionSubscene = /** @class */ (function (_super) {
    __extends(DescriptionSubscene, _super);
    function DescriptionSubscene(_scene) {
        return _super.call(this, _scene) || this;
    }
    /**
     * このクラスで使用するオブジェクトを生成する
     * @override
     */
    DescriptionSubscene.prototype.init = function () {
        this.autoNext = (commonDefine_1.commonDefine.DESCRIPTION_WAIT > 0);
        this.inContent = false;
        this.requestedNextSubscene = new g.Trigger();
        var game = this.scene.game;
        var desc = this.asaDescription =
            new asaEx_1.asaEx.Actor(this.scene, commonAsaInfo_1.CommonAsaInfo.nwTitle.pj);
        desc.x = game.width / 2;
        desc.y = game.height / 2;
        desc.onUpdate.add(spriteUtil_1.spriteUtil.makeActorUpdater(desc));
        desc.hide();
        entityUtil_1.entityUtil.appendEntity(desc, this);
        entityUtil_1.entityUtil.hideEntity(this);
    };
    /**
     * 表示系以外のオブジェクトをdestroyする
     * 表示系のオブジェクトはg.Eのdestroyに任せる
     * @override
     */
    DescriptionSubscene.prototype.destroy = function () {
        if (this.destroyed()) {
            return;
        }
        if (this.requestedNextSubscene) {
            this.requestedNextSubscene.destroy();
            this.requestedNextSubscene = null;
        }
        _super.prototype.destroy.call(this);
    };
    /**
     * 表示を開始する
     * このサブシーンに遷移するワイプ演出で表示が始まる時点で呼ばれる
     * @override
     */
    DescriptionSubscene.prototype.showContent = function () {
        this.asaDescription.play(commonAsaInfo_1.CommonAsaInfo.nwTitle.anim.description, 0, false, 1);
        entityUtil_1.entityUtil.showEntity(this.asaDescription);
        entityUtil_1.entityUtil.showEntity(this);
    };
    /**
     * 動作を開始する
     * このサブシーンに遷移するワイプ演出が完了した時点で呼ばれる
     * @override
     */
    DescriptionSubscene.prototype.startContent = function () {
        this.inContent = true;
        if (this.autoNext) {
            this.scene.setTimeout(this.handleTimeout, commonDefine_1.commonDefine.DESCRIPTION_WAIT, this);
            if (commonDefine_1.commonDefine.TOUCH_SKIP_WAIT > 0) {
                this.scene.setTimeout(this.handleTimeoutToTouch, commonDefine_1.commonDefine.TOUCH_SKIP_WAIT, this);
            }
        }
        else {
            this.scene.onPointDownCapture.add(this.handleTouch, this);
        }
    };
    /**
     * Scene#updateを起点とする処理から呼ばれる
     * @override
     */
    DescriptionSubscene.prototype.handleUpdateSubscene = function () {
        // NOP
    };
    /**
     * 動作を停止する
     * このサブシーンから遷移するワイプ演出が始まる時点で呼ばれる
     * @override
     */
    DescriptionSubscene.prototype.stopContent = function () {
        // console.log("DescriptionSubscene.stopContent: inContent:"+this.inContent+".");
        this.inContent = false;
        this.scene.onPointDownCapture.removeAll();
    };
    /**
     * 表示を終了する
     * このサブシーンから遷移するワイプ演出で表示が終わる時点で呼ばれる
     * @override
     */
    DescriptionSubscene.prototype.hideContent = function () {
        entityUtil_1.entityUtil.hideEntity(this);
        entityUtil_1.entityUtil.hideEntity(this.asaDescription);
    };
    /**
     * Scene#setTimeoutのハンドラ
     * 次のシーンへの遷移を要求する
     */
    DescriptionSubscene.prototype.handleTimeout = function () {
        // console.log("DescriptionSubscene.handleTimeout: inContent:"+this.inContent+".");
        if (this.inContent) {
            this.requestedNextSubscene.fire();
        }
    };
    /**
     * Scene#setTimeoutのハンドラ
     * タッチ受付を開始する
     */
    DescriptionSubscene.prototype.handleTimeoutToTouch = function () {
        // console.log("DescriptionSubscene.handleTimeoutToTouch: inContent:"+this.inContent+".");
        if (this.inContent) {
            this.scene.onPointDownCapture.add(this.handleTouch, this);
        }
    };
    /**
     * Scene#onPointDownCaptureのハンドラ
     * 次のシーンへの遷移を要求する
     * @param {g.PointDownEvent} _e イベントパラメータ
     * @return {boolean} trueを返し、ハンドラ登録を解除する
     */
    DescriptionSubscene.prototype.handleTouch = function (_e) {
        // console.log("DescriptionSubscene.handleTouch: inContent:"+this.inContent+".");
        if (this.inContent) {
            this.requestedNextSubscene.fire();
        }
        return true;
    };
    return DescriptionSubscene;
}(subscene_1.Subscene));
exports.DescriptionSubscene = DescriptionSubscene;
