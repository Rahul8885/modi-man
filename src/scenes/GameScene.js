import Phaser from 'phaser'
import Player from '../entities/Player.js'
import { GAME_CONFIG } from '../config.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  init(data) {
    this.selectedCity = data.city || 'delhi'
  }

  create() {
    this.score = 0
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED_BASE

    const width = this.sys.game.config.width
    const height = this.sys.game.config.height

    // Very dark background
    this.cameras.main.setBackgroundColor('#1a0a2e')

    // Parallax backgrounds (Layer 4 is furthest, Layer 1 is foreground)
    // The images are 640x360, we set TileSprite size to 640x360 and scale by 2 to fit 1280x720 without vertical tiling.
    this.bg4 = this.add.tileSprite(0, 0, 640, 360, `${this.selectedCity}_4`).setOrigin(0, 0).setScale(2).setDepth(-4)
    this.bg3 = this.add.tileSprite(0, 0, 640, 360, `${this.selectedCity}_3`).setOrigin(0, 0).setScale(2).setDepth(-3)
    this.bg2 = this.add.tileSprite(0, 0, 640, 360, `${this.selectedCity}_2`).setOrigin(0, 0).setScale(2).setDepth(-2)
    this.bg1 = this.add.tileSprite(0, 0, 640, 360, `${this.selectedCity}_1`).setOrigin(0, 0).setScale(2).setDepth(-1)

    // Enemies group
    this.enemies = this.physics.add.group()
    
    // Spawn timer
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })

    // Floor physics
    // Using x=320, y=315 (which is GroundY 270 + bounds)
    const floorHeight = 180
    const floorY = GAME_CONFIG.GROUND_Y + floorHeight / 2
    this.floor = this.add.rectangle(width / 2, floorY, width + 500, floorHeight, 0x332244)
    this.floor.setAlpha(0)
    this.physics.add.existing(this.floor, true) // static 

    // Character
    this.player = new Player(this, 120, GAME_CONFIG.GROUND_Y - 32)
    this.physics.add.collider(this.player, this.floor)
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this)

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('X')

    // Boot the HUD
    this.scene.launch('HUDScene')
    this.hud = this.scene.get('HUDScene')
  }

  spawnEnemy() {
    if (this.player.isDead) return
    
    // Spawn between Y=100 and Y=GROUND_Y - 50
    const spawnY = Phaser.Math.Between(100, GAME_CONFIG.GROUND_Y - 50)
    const x = this.sys.game.config.width + 100

    const ufo = this.enemies.create(x, spawnY, 'ufo_hover')
    ufo.body.allowGravity = false
    ufo.setVelocityX(-this.scrollSpeed)
  }

  hitEnemy(player, enemy) {
    if (player.isDead) return
    player.die()
    
    this.cameras.main.shake(200, 0.01)
    
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(10)

    this.time.delayedCall(2000, () => {
      this.scene.start('MenuScene')
    })
  }

  update(time, delta) {
    // Increase distance score
    if (!this.player.isDead) {
      const dt = delta / 1000
      const distancePoints = (this.scrollSpeed * dt) / 10
      this.score += distancePoints
      
      // Update Parallax Backgrounds (Scale 2 means shift is doubled visually, so divide scrolling speed by 2)
      this.bg1.tilePositionX += (this.scrollSpeed * dt * 1.0) / 2
      this.bg2.tilePositionX += (this.scrollSpeed * dt * 0.6) / 2
      this.bg3.tilePositionX += (this.scrollSpeed * dt * 0.3) / 2
      this.bg4.tilePositionX += (this.scrollSpeed * dt * 0.1) / 2
      
      // Update Enemies
      this.enemies.getChildren().forEach(enemy => {
        enemy.setVelocityX(-this.scrollSpeed)
        if (enemy.x < -100) {
          enemy.destroy()
        }
      })
      
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
