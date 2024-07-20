import Phaser from 'phaser';
import CardGameScene from './scenes/CardGameScene';
import MenuScene from './scenes/MenuScene';

import EndScene from './scenes/EndScene';
import { colors } from '../theme/index';
import SceneEventHandler from '../services/services.sceneEvents';
import EventHandler from '../services/services.events';
import StoryScene from './scenes/StoryScene';

const { AUTO, Scale } = Phaser;

class Game extends Phaser.Game {
  constructor() {
    var config = {
      type: AUTO,
      parent: 'game-container',
      scale: {
        mode: Scale.RESIZE,
        width: window.innerWidth * window.devicePixelRatio,
        autoCenter: Scale.CENTER_BOTH,
        height: window.innerHeight * window.devicePixelRatio,
      },
      backgroundColor: colors.background,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: [MenuScene, CardGameScene, EndScene, StoryScene],
    };
    super(config);
    SceneEventHandler.on('scene::create', this._onSceneCreate, this);
    SceneEventHandler.on('scene::shutdown', this._onSceneShutdown, this);
    this._addListeners();
    this.init();
  }

  _onRestart() {
    EventHandler.emit('game::restart');
    this.scene.stop('EndScene');
    this.scene.start('CardGameScene', { difficulty: 4 });
  }

  _onClassic() {
    this.scene.stop('MenuScene');
    this.scene.start('CardGameScene', { difficulty: 4 });
  }

  _onStory() {
    this.scene.stop('MenuScene');
    this.scene.start('StoryScene');
  }

  _onEnd(params) {
    this.scene.stop('CardGameScene');
    this.scene.start('EndScene', params);
  }

  _addListeners() {
    EventHandler.on('menu::classic', this._onClassic, this);
    EventHandler.on('menu::story', this._onStory, this);
    EventHandler.on('end::restart', this._onRestart, this);
    EventHandler.on('board::finish', this._onEnd, this);
  }

  init() {
    //setTimeout(() => this._onClassic(), 100);
  }
  _onSceneCreate() {
    this._addListeners();
  }

  _onSceneShutdown() {
    this._addListeners();
  }
}

export default Game;
