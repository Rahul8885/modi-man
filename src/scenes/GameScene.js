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
    this.lives = 3
    this.score = 0
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED_BASE

    const width = this.sys.game.config.width
    const height = this.sys.game.config.height

    // Very dark background
    this.cameras.main.setBackgroundColor('#1a0a2e')

    const baseLayerWidth = 640
    const baseLayerHeight = 360
    const layerScale = width / baseLayerWidth
    const groundKey = `${this.selectedCity}_1`
    const groundSource = this.textures.get(groundKey).getSourceImage()
    const groundBaseHeight = groundSource.height
    const groundDisplayHeight = groundBaseHeight * layerScale
    this.groundY = height - groundDisplayHeight

    // Parallax backgrounds. Ground is a cropped strip, so its TileSprite height must match
    // the PNG height; otherwise Phaser tiles it vertically and stacks roads.
    this.bg4 = this.add.tileSprite(0, 0, baseLayerWidth, baseLayerHeight, `${this.selectedCity}_4`).setOrigin(0, 0).setScale(layerScale).setDepth(-4)
    this.bg3 = this.add.tileSprite(0, 0, baseLayerWidth, baseLayerHeight, `${this.selectedCity}_3`).setOrigin(0, 0).setScale(layerScale).setDepth(-3)
    this.bg2 = this.add.tileSprite(0, 0, baseLayerWidth, baseLayerHeight, `${this.selectedCity}_2`).setOrigin(0, 0).setScale(layerScale).setDepth(-2)
    this.bg1 = this.add.tileSprite(0, this.groundY, baseLayerWidth, groundBaseHeight, groundKey).setOrigin(0, 0).setScale(layerScale).setDepth(-1)

    // Enemies group
    this.enemies = this.physics.add.group()
    
    // Spawn timer
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })

    // Floor physics: top edge matches the cropped ground image bounding box.
    const floorHeight = Math.max(groundDisplayHeight, 80)
    const floorY = this.groundY + floorHeight / 2
    this.floor = this.add.rectangle(width / 2, floorY, width + 500, floorHeight, 0x332244)
    this.floor.setAlpha(0)
    this.physics.add.existing(this.floor, true) // static 

    // Character center: physics body bottom now lines up with the road top.
    this.player = new Player(this, 120, this.groundY - 64)
    this.physics.add.collider(this.player, this.floor)
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this)

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = {
      X: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    }
    this.lastTapAt = 0
    this.input.on('pointerdown', this.handlePointerDown, this)

    // Boot the HUD
    this.scene.launch('HUDScene')
    this.hud = this.scene.get('HUDScene')

    // Slight delay to ensure HUD is created before updating lives
    this.time.delayedCall(100, () => {
        if (this.hud && this.hud.updateLives) {
            this.hud.updateLives(this.lives)
        }
    })
  }

  spawnEnemy() {
    if (this.player.isDead) return
    
    // Spawn between Y=100 and the current city ground top.
    const spawnY = Phaser.Math.Between(100, this.groundY - 50)
    const x = this.sys.game.config.width + 100

    const ufo = this.enemies.create(x, spawnY, 'ufo_hover')
    ufo.body.allowGravity = false
    ufo.setVelocityX(-this.scrollSpeed)
    
    // Play hover animation and shrink physics bounds (e.g. 60x60 out of 128x128)
    ufo.play('ufo_hover_anim', true)
    ufo.body.setSize(60, 60)
    ufo.body.setOffset(34, 34)
  }

  hitEnemyWithLaser(laser, enemy) {
    if (!laser.active || !enemy.active || enemy.getData('dying')) return
    enemy.setData('dying', true)
    laser.destroy()
    enemy.setVelocityX(-this.scrollSpeed * 0.2) // Slow it down heavily
    enemy.body.checkCollision.none = true
    enemy.play('ufo_explosion_anim', true)
    
    // Add extra score for kill
    this.score += 150
    this.time.delayedCall(400, () => {
        if (enemy) enemy.destroy()
    })
  }

  hitEnemyWithBeam(enemy, hitX) {
    if (!enemy.active || enemy.getData('dying')) return

    enemy.setData('dying', true)
    this.player.holdLaserAt(hitX, this.time.now + 420)
    enemy.setVelocityX(-this.scrollSpeed * 0.2)
    enemy.body.checkCollision.none = true
    enemy.play('ufo_explosion_anim', true)

    this.score += 150
    this.time.delayedCall(400, () => {
      if (enemy) enemy.destroy()
    })
  }

  getBeamTarget(ray) {
    let target = null
    let hitX = Number.POSITIVE_INFINITY

    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.active || enemy.getData('dying')) return

      const box = {
        left: enemy.x - 45,
        right: enemy.x + 45,
        top: enemy.y - 28,
        bottom: enemy.y + 20
      }

      const verticalHit = ray.startY >= box.top && ray.startY <= box.bottom
      const horizontalHit = box.right >= ray.startX && box.left <= ray.endX
      if (!verticalHit || !horizontalHit) return

      const candidateHitX = Math.max(box.left, ray.startX)
      if (candidateHitX < hitX) {
        hitX = candidateHitX
        target = enemy
      }
    })

    return target ? { enemy: target, hitX } : null
  }

  handlePointerDown(pointer) {
    if (!this.player || this.player.isDead) return

    const now = pointer.event?.timeStamp || this.time.now
    if (now - this.lastTapAt <= 300) {
      this.player.shootLaser()
      this.lastTapAt = 0
      return
    }

    this.lastTapAt = now
  }

  hitEnemy(player, enemy) {
    if (player.isDead || player.isInvincible) return
    player.x = Phaser.Math.Clamp(player.x, 120, 180)
    player.body.setVelocityX(0)

    // Player took real damage
    if (player.takeHit() === false) {
        this.lives--
        if (this.hud && this.hud.updateLives) {
            this.hud.updateLives(this.lives)
        }
        
        this.cameras.main.shake(150, 0.005)

        if (this.lives <= 0) {
            player.die()
            this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
              fontSize: '64px',
              fill: '#ff0000',
              fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(10)

            this.time.delayedCall(2000, () => {
              this.scene.start('MenuScene')
            })
        }
    }
  }

  update(time, delta) {
    // Increase distance score
    if (!this.player.isDead) {
      const dt = delta / 1000
      const distancePoints = (this.scrollSpeed * dt) / 10
      this.score += distancePoints
      this.player.update(this.cursors, this.keys, delta)
      
      // Update Parallax Backgrounds. Divide by layer scale because TileSprite scrolls in source pixels.
      this.bg1.tilePositionX += (this.scrollSpeed * dt * 1.0) / this.bg1.scaleX
      this.bg2.tilePositionX += (this.scrollSpeed * dt * 0.6) / this.bg2.scaleX
      this.bg3.tilePositionX += (this.scrollSpeed * dt * 0.3) / this.bg3.scaleX
      this.bg4.tilePositionX += (this.scrollSpeed * dt * 0.1) / this.bg4.scaleX
      
      // Update Enemies
      this.enemies.getChildren().forEach(enemy => {
        if (enemy.body && !enemy.body.checkCollision.none && !enemy.getData('dying')) enemy.setVelocityX(-this.scrollSpeed)
        if (enemy.x < -100) {
          enemy.destroy()
        }
      })

      const ray = this.player.getLaserRay()
      if (ray) {
        const beamTarget = this.getBeamTarget(ray)
        if (beamTarget) {
          this.hitEnemyWithBeam(beamTarget.enemy, beamTarget.hitX)
        } else {
          this.player.setLaserEndX(this.sys.game.config.width + 80)
        }
      }
      
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
      if (this.player) this.hud.updateLaser(this.player.laserCharge)
    }

  }
}
