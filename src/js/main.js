'use strict';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'my-game-game');

window.Utils = require('./utils');

window.playerState = {
    currentLevel: 'Game'
};
game.state.add('Boot', require('./states/boot'));
game.state.add('Splash', require('./states/splash'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('Level1', require('./states/Levels/level1'));
game.state.add('Boss1', require('./states/Levels/Boss1'));
game.state.add('Credits', require('./states/credits'));
game.state.add('Settings', require('./states/settings'));
game.state.add('Shop', require('./states/shop'));
game.state.add('GameOver', require('./states/gameover'));

game.state.start('Boot');

