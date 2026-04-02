import Phaser from 'phaser'
import Player from '../entities/Player.js'
import { GAME_CONFIG } from '../config.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.score = 0
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED_BASE

    // Very dark background
    this.cameras.main.setBackgroundColor('#1a0a2e')

    // Floor physics
    // Using x=320, y=315 (which is GroundY 270 + bounds)
    const floorHeight = 180
    const floorY = GAME_CONFIG.GROUND_Y + floorHeight / 2
    this.floor = this.add.rectangle(320, floorY, 640, floorHeight, 0x332244)
    this.physics.add.existing(this.floor, true) // static 

    // Character
    this.player = new Player(this, 120, GAME_CONFIG.GROUND_Y - 32)
    this.physics.add.collider(this.player, this.floor)

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('X')

    // Boot the HUD
    this.scene.launch('HUDScene')
    this.hud = this.scene.get('HUDScene')
  }

  update(time, delta) {
    // Increase distance score
    if (!this.player.isDead) {
      const distancePoints = (this.scrollSpeed * (delta / 1000)) / 10
      this.score += distancePoints
      
      // Speed Ramp
      if (this.scrollSpeed < GAME_CONFIG.SCROLL_SPEED_MAX) {
          const expectedSpeed = GAME_CONFIG.SCROLL_SPEED_BASE + (Math.floor(this.score / 500) * GAME_CONFIG.SPEED_RAMP_PER_500PTS * this.scrollSpeed)
          if(expectedSpeed > this.scrollSpeed) {
              this.scrollSpeed += 1 // Increment to smooth transition, basic implementation
          }
      }
    }

    if (this.hud) {
      this.hud.updateScore(this.score)
      this.hud.updateLaser(this.player.laserCharge)
    }

    if (this.player) {
      this.player.update(this.cursors, this.keys)
    }
  }
}
