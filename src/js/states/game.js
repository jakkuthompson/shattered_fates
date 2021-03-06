var Game = function () {
  this.map = null;
  this.layer = null;
  this.cursors = null;
  this.music = null;
  this.background = null;
  this.background2 = null;
  this.sword = null;
  this.sword2 = null;
  this.gui = null;
  this.heart1 = null;
  this.heart2 = null;
  this.heart3 = null;
  this.coin = null;
  this.pause = null;
  this.save = null;
};

const GUI = require('../models/player_models/healthbar');
const Main = require('../main');

var enemy1health = 3;
var enemy2health = 3;
var herohealth = 6;
var alreadyhit1 = 0;
var alreadyhit2 = 0;
var coins = 0;
var enemy1x = 400;
var enemy1y = 250;
var enemy2x = 200;
var enemy2y = 300;
var sectimer = 0;
var walkmore = true;
var walkmore2 = true;
var test = true;
var animplaying = false;

module.exports = Game;

Game.prototype = {

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.game.world.setBounds(0, 0, 2304, 609);

    this.music = this.add.audio('overworld');
    this.music.play();

    //tilemap
    this.map = this.add.tilemap('hub');
    this.map.addTilesetImage('t1', 'tileset');

    this.layer = this.map.createLayer('t1');
    this.map.setCollision(967);  //Edge Barrier
    this.map.setTileIndexCallback(979, () => {
      this.game.state.start('Level1');
      this.music.pause();
      test = true;
    }, this.asset);
    this.map.setTileIndexCallback(1005, () => {
      this.game.state.start('Shop');
      this.music.pause(); //bruh
      test = true;
    }, this.asset);
    this.map.setCollision(1193); //Barrier for D1

    this.background = this.add.tileSprite(0, 0, 2304, 609, 'hubimg');

    this.asset = this.add.sprite(128, 32, 'zephyr');
    this.asset.scale.x = .99;
    this.asset.animations.add('left', [3, 4, 5], 20, true);
    this.asset.animations.add('right', [6, 7, 8], 20, true);
    this.asset.animations.add('down', [0, 1, 2], 20, true);
    this.asset.animations.add('up', [9, 10, 11], 20, true);
    this.physics.enable(this.asset, Phaser.Physics.ARCADE);
    this.physics.enable(this.asset, Phaser.Physics.P2JS);
    this.asset.body.immovable = true;
    this.asset.body.collideWorldBounds = true;

    this.background2 = this.add.tileSprite(0, 0, 2304, 609, 'hubimg2');

    //enemy sprite 1
    this.enemy1 = this.add.sprite(enemy1x,enemy1y, 'enemy');
    this.game.physics.enable(this.enemy1, Phaser.Physics.ARCADE);
    //enemy sprite 2
    this.enemy2 = this.add.sprite(enemy2x,enemy2y, 'enemy');
    this.game.physics.enable(this.enemy2, Phaser.Physics.ARCADE);

    //sword sprite
    this.sword = this.add.sprite(this.asset.x,this.asset.y, 'sword');
    this.sword.scale.x = 0.25;
    this.sword.scale.y = 0.25;
    this.sword.animations.add('swing');
    this.sword.visible = false;
    this.game.physics.enable(this.sword, Phaser.Physics.ARCADE);

    //sword two sprite
    this.sword2 = this.add.sprite(this.asset.x,this.asset.y,'sword2');
    this.sword2.scale.x = 0.25;
    this.sword2.scale.y = 0.25;
    this.sword2.animations.add('swingtwo');
    this.sword2.visible = false;
    this.game.physics.enable(this.sword2, Phaser.Physics.ARCADE);

    // Adds the sword for swinging up
    this.sword3 = this.add.sprite(this.asset.x,this.asset.y, 'sword3');
    this.physics.enable(this.sword3, Phaser.Physics.ARCADE);
    this.sword3.scale.x = 0.25;
    this.sword3.scale.y = 0.25;
    // Creates the animation
    this.sword3.animations.add('swingthree');
    this.sword3.kill();
    this.world.swap(this.asset, this.sword3);

    // Adds the sword for swinging down
    this.sword4 = this.add.sprite(this.asset.x,this.asset.y,'sword4');
    this.physics.enable(this.sword4, Phaser.Physics.ARCADE);
    this.sword4.scale.x = 0.25;
    this.sword4.scale.y = 0.25;
    // Creates the animation
    this.sword4.animations.add('swingfour');
    this.sword4.kill();

    this.game.camera.follow(this.asset);

    //keypad input detectors
    this.cursors = this.input.keyboard.createCursorKeys();

    this.heart1 = this.game.add.sprite(0, 0, 'heart');
    this.heart1.fixedToCamera = true;

    this.heart2 = this.game.add.sprite(32, 0, 'heart');
    this.heart2.fixedToCamera = true;

    this.heart3 = this.game.add.sprite(64, 0, 'heart');
    this.heart3.fixedToCamera = true;

    this.coin = this.game.add.sprite(256, 2, 'coin');
    this.coin.animations.add('shine', [0, 1], 5, true);
    this.coin.play('shine');
    this.coin.fixedToCamera = true;

    this.text = this.add.text(290, 5, coins, {font: "20px Arial", fill: "#ffffff"});
    this.text.fixedToCamera = true;

    this.pause = this.add.button(775, 0, 'pause', listenerPause, this, 1, 0, 2);
    this.pause.fixedToCamera = true;
    this.pause.scale.x = .1;
    this.pause.scale.y = .1;
    this.pause.inputEnabled = true;

    this.pause.events.onInputUp.add(() => {
      this.pause.kill();

      this.asset.body.moves = false;

      this.enemy1.body.moves = true;
      this.enemy2.body.moves = true;

      this.music.pause();

      this.pauseMenu = this.add.sprite(0, 0, 'pausemenu');
      this.pauseMenu.animations.add('spiralin', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, false);
      this.pauseMenu.animations.add('spiralout', [8, 7, 6, 5, 4 ,3, 2, 1, 0], 10, false);
      this.pauseMenu.animations.play('spiralin');
      this.pauseMenu.fixedToCamera = true;

      this.time.events.add(1000, () => {
        this.resume = this.add.button(275, 0, 'resume', listenerResume(), true, 1, 0, 2);
        this.resume.fixedToCamera = true;
        this.resume.events.onInputUp.add(() => {
          this.resume.destroy();
          this.pause.revive();
          this.pauseMenu.animations.play('spiralout');
          this.time.events.add(1000, () => {
            this.pauseMenu.destroy();
            this.music.resume();
            this.asset.body.moves = true;
            this.enemy1.body.moves = true;
            this.enemy2.body.moves = true;
          });
        });
      }, this);
    });

    if(this.enemy1.x == 500 && this.enemy1.y == 250){
      console.log("Change Frame");
      this.enemy1.frame = 9;

    }
    if(this.enemy1.x == 500 && this.enemy1.y == 150){
      this.enemy1.frame = 5;

    }
    if(this.enemy1.x == 500 && this.enemy1.y == 150){
      this.enemy1.frame = 13;

    }
    if(this.enemy1.x == 400 && this.enemy1.y == 250){
      this.enemy1.frame = 1;

    }

    tween1 = this.game.add.tween(this.enemy1);
    tween1.to({x: [enemy1x + 100], y: [enemy1y]}, 500, "Linear");
    enemy1x = enemy1x + 100;

    tween3 = this.game.add.tween(this.enemy1);
    tween3.to({x: [enemy1x], y: [enemy1y - 100]}, 500, "Linear");
    enemy1y = enemy1y - 100;

    tween4 = this.game.add.tween(this.enemy1);
    tween4.to({x: [enemy1x - 100], y: [enemy1y]}, 500, "Linear");
    enemy1x = enemy1x - 100;

    tween5 = this.game.add.tween(this.enemy1);
    tween5.to({x: [enemy1x], y: [enemy1y + 100]}, 500, "Linear");
    enemy1y = enemy1y + 100;

    //enemy2 movement

    tween2 = this.game.add.tween(this.enemy2);
    tween2.to({x: [enemy2x], y: [enemy2y+100]}, 500, "Linear");
    enemy2y = enemy2y + 100;

    tween6 = this.game.add.tween(this.enemy2);
    tween6.to({x: [enemy2x - 100], y: [enemy2y]}, 500, "Linear");
    enemy2x = enemy2x - 100;

    tween7 = this.game.add.tween(this.enemy2);
    tween7.to({x: [enemy2x], y: [enemy2y-100]}, 500, "Linear");
    enemy2y = enemy2y - 100;

    tween8 = this.game.add.tween(this.enemy2);
    tween8.to({x: [enemy2x+100], y: [enemy2y]}, 500, "Linear");
    enemy2x = enemy2x + 100;



  },

  update: function () {
    if (sectimer == 60) {
      secstimer = 0;
    }
    sectimer++;

    if(test == true){
      walkmore = true;
      walkmore2 = true;
      test = false;
    }

    var attackKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    var wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    var sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    var aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    var dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.physics.arcade.collide(this.asset, this.layer);
    this.game.physics.arcade.collide(this.asset, this.enemy1, heroattacked1, null, this);
    this.game.physics.arcade.collide(this.asset, this.enemy2, heroattacked2, null, this);
    this.physics.arcade.collide(this.enemy1, this.enemy2);
    this.physics.arcade.collide(this.enemy2, this.enemy1);

    //main character movement
    this.asset.body.velocity.set(0);

    if (this.cursors.left.isDown || aKey.isDown) {
      this.asset.body.velocity.x = -200;
      this.asset.play('left');
    }
    else if (this.cursors.right.isDown || dKey.isDown) {
      this.asset.body.velocity.x = 200;
      this.asset.play('right');
    }
    else if (this.cursors.up.isDown || wKey.isDown) {
      this.asset.body.velocity.y = -200;
      this.asset.play('up');
    }
    else if (this.cursors.down.isDown || sKey.isDown) {
      this.asset.body.velocity.y = 200;
      this.asset.play('down');
    }
    else {
      this.asset.animations.stop();
    }

    //sword attack
    if (attackKey.isDown || spacebar.isDown) {
      if(animplaying == false) {
        if (this.asset.frame == 6 || this.asset.frame == 7 || this.asset.frame == 8) {
          this.sword.revive();
          this.sword.animations.play('swing', 13, false);
          animplaying = true;
        }
        if (this.asset.frame == 3 || this.asset.frame == 4 || this.asset.frame == 5) {
          this.sword2.revive();
          this.sword2.animations.play('swingtwo', 13, false);
          animplaying = true;
        }
        if (this.asset.frame == 9 || this.asset.frame == 10 || this.asset.frame == 11) {
          this.sword3.revive();
          this.sword3.animations.play('swingthree', 13, false);
          animplaying = true;
        }
        if (this.asset.frame == 0 || this.asset.frame == 1 || this.asset.frame == 2) {
          this.sword4.revive();
          this.sword4.animations.play('swingfour', 13, false);
          animplaying = true;
        }
      }
    }

    this.sword.animations.currentAnim.onComplete.add(function () {
      this.sword.visible = false;
      alreadyhit1 = 0;
      alreadyhit2 = 0;
      animplaying = false;
    }, this);
    this.sword2.animations.currentAnim.onComplete.add(function () {
      this.sword2.visible = false;
      alreadyhit1 = 0;
      alreadyhit2 = 0;
      animplaying = false;
    }, this);
    this.sword3.animations.currentAnim.onComplete.add(function () {
      this.sword3.visible = false;
      alreadyhit1 = 0;
      alreadyhit2 = 0;
      animplaying = false;
    }, this);
    this.sword4.animations.currentAnim.onComplete.add(function () {
      this.sword4.visible = false;
      alreadyhit1 = 0;
      alreadyhit2 = 0;
      animplaying = false;
    }, this);

    //keep the sword by the main character
    this.sword.x = this.asset.x;
    this.sword.y = this.asset.y;
    this.sword2.x = this.asset.x - 20;
    this.sword2.y = this.asset.y;
    this.sword3.x = this.asset.x - 5;
    this.sword3.y = this.asset.y - 30;
    this.sword4.x = this.asset.x - 10;
    this.sword4.y = this.asset.y + 10;

    if (herohealth == 6) {
      this.heart3.frame = 0;
      this.heart2.frame = 0;
      this.heart1.frame = 0;
    }
    if (herohealth == 5) {
      this.heart3.frame = 1;
      this.heart2.frame = 0;
      this.heart1.frame = 0;
    }
    if (herohealth == 4) {
      this.heart3.frame = 2;
      this.heart2.frame = 0;
      this.heart1.frame = 0;
    }
    if (herohealth == 3) {
      this.heart3.frame = 2;
      this.heart2.frame = 1;
      this.heart1.frame = 0;
    }
    if (herohealth == 2) {
      this.heart3.frame = 2;
      this.heart2.frame = 2;
      this.heart1.frame = 0;
    }
    if (herohealth == 1) {
      this.heart3.frame = 2;
      this.heart2.frame = 2;
      this.heart1.frame = 1;
    }
    if (herohealth == 0) {
      this.heart3.frame = 2;
      this.heart2.frame = 2;
      this.heart1.frame = 2;
      this.asset.kill();
    }

    //check for enemy kill
    if (enemy1health == 0) {
      this.enemy1.kill();
      coins += 10;
      this.text.setText(coins);

    }

    if (enemy2health <= 0) {
      this.enemy2.kill();
      money = money + 10;
    }

    //collision detection for hero getting attacked
    if (enemy1health > 0) {
      this.game.physics.arcade.collide(this.asset, this.enemy1, heroattacked1, null, this);
    }
    if (enemy2health > 0) {
      this.game.physics.arcade.collide(this.asset, this.enemy2, heroattacked2, null, this);
    }

    //enemy2 movement

    //if (walkmore2 == true) {
      //walkmore2 = false;
      //this.enemy2.frame = 1;
      //tween2.start();
      //tween2.onComplete.add(doSomething, this);
      //function doSomething() {
        //this.enemy2.frame = 13;
        //tween6.start();
        //tween6.onComplete.add(doSomething, this);
        //function doSomething() {
          //this.enemy2.frame = 5;
          //tween7.start();
          //tween7.onComplete.add(doSomething, this);
          //function doSomething() {
            //this.enemy2.frame = 9;
            //tween8.start();
            //tween8.onComplete.add(doSomething, this);
            //function doSomething() {
              //walkmore2 = true;
            //}
          //}
        //}
      //}
    //}


    //enemy1 movement


    //if (walkmore == true) {

      //this.enemy1.frame = 9;
      //tween1.start();
      //walkmore = false;
      //tween1.onComplete.add(doSomething2, this);
      //function doSomething2() {
       //this.enemy1.frame = 5;
        //tween3.start();
        //tween3.onComplete.add(doSomething2, this);
        //function doSomething2() {
          //this.enemy1.frame = 13;
          //tween4.start();
          //tween4.onComplete.add(doSomething2, this);
          //function doSomething2() {
            //this.enemy1.frame = 1;
            //tween5.start();
            //tween5.onComplete.add(doSomething2, this);
            //function doSomething2() {
              //walkmore = true;
            //}
          //}
        //}
      //}
    //}
  }

};

function heroattacked1 () {
  herohealth--;
  if (this.asset.x < this.enemy1.x) {
    this.asset.x -= 32;
  }
  if (this.asset.x > this.enemy1.x) {
    this.asset.x += 32;
  }
  if (this.asset.y < this.enemy1.y) {
    this.asset.y -= 32;
  }
  if (this.asset.y > this.enemy1.y) {
    this.asset.y += 32;
  }

}

function heroattacked2 () {
  herohealth--;
  if (this.asset.x < this.enemy2.x) {
    this.asset.x -= 32;
  }
  if (this.asset.x > this.enemy2.x) {
    this.asset.x += 32;
  }
  if (this.asset.y < this.enemy2.y) {
    this.asset.y -= 32;
  }
  if (this.asset.y > this.enemy2.y) {
    this.asset.y += 32;
  }

}

function enemy1attacked () {
  enemy1health = enemy1health - 1;
  alreadyhit1 = 1;
  console.log(enemy1health);
}

function enemy2attacked () {
  enemy2health = enemy2health - 1;
  alreadyhit2 = 1;
  console.log(enemy2health);
}

function listenerPause () {
}

function listenerResume () {
}

function listenerOptions () {
}

function listenerExit () {
  this.game.state.start('Menu');
}