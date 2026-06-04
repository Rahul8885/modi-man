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
    this.bestScore = Number.parseInt(sessionStorage.getItem('modiManBestScore') || '0', 10)
    this.scrollSpeed = GAME_CONFIG.SCROLL_SPEED_BASE

    const width = this.scale.width
    const height = this.scale.height
    this.physics.world.setBounds(0, 0, width, height)

    // Very dark background
    this.cameras.main.setBackgroundColor('#1a0a2e')

    const baseLayerWidth = 640
    const baseLayerHeight = 360
    const layerScale = Math.max(width / baseLayerWidth, height / baseLayerHeight)
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
    this.touchControls = { fly: false, laser: false, bounds: [] }
    this.input.addPointer(2)
    if (this.isMobileView()) {
      this.createTouchControls(width, height)
      this.createRefreshControl(width)
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
    const x = this.scale.width + 100

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
    try { this.sound.play('sfx_ufo_explosion', { volume: 0.6 }) } catch (e) {}
    this.finishEnemyExplosion(enemy)
  }

  hitEnemyWithBeam(enemy, hitX) {
    if (!enemy.active || enemy.getData('dying')) return

    enemy.setData('dying', true)
    this.player.holdLaserAt(hitX, this.time.now + 420)
    enemy.setVelocityX(-this.scrollSpeed * 0.2)
    enemy.body.checkCollision.none = true
    enemy.play('ufo_explosion_anim', true)
    try { this.sound.play('sfx_ufo_explosion', { volume: 0.6 }) } catch (e) {}
    this.finishEnemyExplosion(enemy)
  }

  finishEnemyExplosion(enemy) {
    this.time.delayedCall(400, () => {
      if (!enemy) return
      this.score += 150
      this.updateBestScore()
      enemy.destroy()
    })
  }

  updateBestScore() {
    const score = Math.floor(this.score)
    if (score <= this.bestScore) return

    this.bestScore = score
    sessionStorage.setItem('modiManBestScore', String(score))
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
    if (this.isTouchControlPointer(pointer)) return

    const now = pointer.event?.timeStamp || this.time.now
    if (now - this.lastTapAt <= 300) {
      this.player.shootLaser()
      this.lastTapAt = 0
      return
    }

    this.lastTapAt = now
  }

  isMobileView() {
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches
    return this.sys.game.device.input.touch || isCoarse || window.innerWidth <= 900
  }

  isTouchControlPointer(pointer) {
    if (!this.touchControls || !this.touchControls.bounds) return false

    return this.touchControls.bounds.some(control => {
      const dx = pointer.x - control.x
      const dy = pointer.y - control.y
      return dx * dx + dy * dy <= control.radius * control.radius
    })
  }

  createTouchControls(width, height) {
    const radius = Math.max(52, Math.min(64, width * 0.16))
    const y = height - 94

    this.createTouchButton(104, y, radius, 'FLY', 'fly')
    this.createTouchButton(width - 104, y, radius, 'LASER', 'laser')
  }

  createRefreshControl(width) {
    const c = this.add.container(width - 58, 58).setDepth(101)
    const bg = this.add.circle(0, 0, 34, 0x15172a, 0.58)
    const ring = this.add.graphics()
    ring.lineStyle(2, 0xffe7a8, 0.65)
    ring.strokeCircle(0, 0, 34)
    const text = this.add.text(0, 0, 'R', {
      fontFamily: 'Rajdhani, Arial, sans-serif',
      fontSize: '22px',
      fontStyle: '700',
      color: '#fff8e6'
    }).setOrigin(0.5).setResolution(2)
    const hit = this.add.circle(0, 0, 42, 0xffffff, 0)
    c.add([bg, ring, text, hit])
    this.touchControls.bounds.push({ x: width - 58, y: 58, radius: 48 })
    hit.setInteractive()
    hit.on('pointerdown', () => window.location.reload())
  }

  createTouchButton(x, y, radius, label, key) {
    const c = this.add.container(x, y).setDepth(100)
    const bg = this.add.circle(0, 0, radius, key === 'fly' ? 0x00ffcc : 0xff3048, 0.18)
    const ring = this.add.graphics()
    ring.lineStyle(3, key === 'fly' ? 0x00ffcc : 0xff3048, 0.55)
    ring.strokeCircle(0, 0, radius)
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Rajdhani, Arial, sans-serif',
      fontSize: key === 'fly' ? '22px' : '18px',
      fontStyle: '700',
      color: '#fff8e6',
      letterSpacing: 2
    }).setOrigin(0.5).setResolution(2)
    const hit = this.add.circle(0, 0, radius + 8, 0xffffff, 0)
    c.add([bg, ring, text, hit])
    this.touchControls.bounds.push({ x, y, radius: radius + 16 })

    const setPressed = pressed => {
      this.touchControls[key] = pressed
      c.setScale(pressed ? 0.94 : 1)
      bg.setAlpha(pressed ? 0.34 : 0.18)
    }

    hit.setInteractive()
    hit.on('pointerdown', pointer => {
      this.touchControls[`${key}PointerId`] = pointer.id
      setPressed(true)
    })
    hit.on('pointerup', pointer => {
      if (this.touchControls[`${key}PointerId`] === pointer.id) setPressed(false)
    })
    hit.on('pointerout', pointer => {
      if (this.touchControls[`${key}PointerId`] === pointer.id) setPressed(false)
    })
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
            this.updateBestScore()
            player.die()
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'GAME OVER', {
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
    if (!this.player.isDead) {
      const dt = delta / 1000
      const controls = {
        space: { isDown: this.cursors.space.isDown || this.touchControls.fly }
      }
      const keys = {
        X: { isDown: this.keys.X.isDown || this.touchControls.laser }
      }
      this.player.update(controls, keys, delta)
      
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
          this.player.setLaserEndX(this.scale.width + 80)
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
