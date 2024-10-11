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
exports.JankenButton = void 0;
exports.createJankenButton = createJankenButton;
function createJankenButton(scene, handSign, touchable) {
  var button = new JankenButton({
    scene: scene,
    src: scene.getJankenImageAsset(handSign),
    handSign: handSign,
    width: 100,
    height: 100,
    anchorX: 0.5,
    anchorY: 0.5,
    local: true,
    touchable: touchable
  });
  button.onPointDown.add(function () {
    var data = {
      messageType: "selectJanken",
      handSign: handSign
    };
    g.game.raiseEvent(new g.MessageEvent(data));
  });
  return button;
}
var JankenButton = /** @class */function (_super) {
  __extends(JankenButton, _super);
  function JankenButton(param) {
    return _super.call(this, param) || this;
  }
  return JankenButton;
}(g.Sprite);
exports.JankenButton = JankenButton;