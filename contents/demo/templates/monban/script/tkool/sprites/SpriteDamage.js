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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite_Damage = void 0;
var core_1 = require("../core");
var managers_1 = require("../managers");
var Sprite_Damage = /** @class */ (function (_super) {
    __extends(Sprite_Damage, _super);
    function Sprite_Damage(scene) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.apply(this, __spreadArray([scene], args, false)) || this;
    }
    Sprite_Damage.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._damageBitmap = managers_1.ImageManager.loadSystem("Damage");
    };
    Sprite_Damage.prototype.setup = function (target) {
        var result = target.result();
        if (result.missed || result.evaded) {
            this.createMiss();
        }
        else if (result.hpAffected) {
            this.createDigits(0, result.hpDamage);
        }
        else if (target.isAlive() && result.mpDamage !== 0) {
            this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    };
    Sprite_Damage.prototype.setupCriticalEffect = function () {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    };
    Sprite_Damage.prototype.digitWidth = function () {
        return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
    };
    Sprite_Damage.prototype.digitHeight = function () {
        return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
    };
    Sprite_Damage.prototype.createMiss = function () {
        var w = this.digitWidth();
        var h = this.digitHeight();
        var sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite.dy = 0;
    };
    Sprite_Damage.prototype.createDigits = function (baseRow, value) {
        var string = Math.abs(value).toString();
        var row = baseRow + (value < 0 ? 1 : 0);
        var w = this.digitWidth();
        var h = this.digitHeight();
        for (var i = 0; i < string.length; i++) {
            var sprite = this.createChildSprite();
            var n = Number(string[i]);
            sprite.setFrame(n * w, row * h, w, h);
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.dy = -i;
        }
    };
    Sprite_Damage.prototype.createChildSprite = function () {
        var sprite = new core_1.Sprite(this.scene);
        sprite.bitmap = this._damageBitmap;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    };
    Sprite_Damage.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            for (var i = 0; i < this.children.length; i++) {
                this.updateChild(this.children[i]);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    };
    Sprite_Damage.prototype.updateChild = function (sprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    };
    Sprite_Damage.prototype.updateFlash = function () {
        if (this._flashDuration > 0) {
            var d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    };
    Sprite_Damage.prototype.updateOpacity = function () {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    };
    Sprite_Damage.prototype.isPlaying = function () {
        return this._duration > 0;
    };
    return Sprite_Damage;
}(core_1.Sprite));
exports.Sprite_Damage = Sprite_Damage;
