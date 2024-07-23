function main() {
  g.game.pushScene(createSceneA());
}

function createSceneA() {
  var scene = new g.Scene({ game: g.game });
  scene.loaded.add(function() {
    scene.append(createRect(scene, "red"));
    scene.pointDownCapture.add(function() {
      g.game.replaceScene(createSceneB());
    });
  });
  return scene;
}

function createSceneB() {
  var scene = new g.Scene({ game: g.game });
  scene.loaded.add(function() {
    scene.append(createRect(scene, "blue"));
    scene.pointDownCapture.add(function() {
      g.game.replaceScene(createSceneA());
    });
  });
  return scene;
}

function createRect(scene, color) {
  return new g.FilledRect({
    scene: scene,
    cssColor: color,
    width: 32,
    height: 32
  });
}

module.exports = main;
