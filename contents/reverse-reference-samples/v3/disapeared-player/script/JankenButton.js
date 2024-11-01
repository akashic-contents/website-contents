"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JankenButton = void 0;
exports.createJankenButton = createJankenButton;
function createJankenButton(scene, handSign, touchable) {
    const button = new JankenButton({
        scene,
        src: scene.getJankenImageAsset(handSign),
        handSign,
        width: 100,
        height: 100,
        anchorX: 0.5,
        anchorY: 0.5,
        local: true,
        touchable
    });
    button.onPointDown.add(() => {
        const data = {
            messageType: "selectJanken",
            handSign
        };
        g.game.raiseEvent(new g.MessageEvent(data));
    });
    return button;
}
class JankenButton extends g.Sprite {
    constructor(param) {
        super(param);
    }
}
exports.JankenButton = JankenButton;
