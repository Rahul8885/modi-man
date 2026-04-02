import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import PreloadScene from './scenes/PreloadScene.js'
import MenuScene from './scenes/MenuScene.js'
import GameScene from './scenes/GameScene.js'
import HUDScene from './scenes/HUDScene.js'

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  parent: 'game-container',
  backgroundColor: '#1a0a2e',
  pixelArt: true, // extremely important for 16-bit look
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { y: 600 }, 
      debug: false 
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    HUDScene
  ]
}

new Phaser.Game(config)
