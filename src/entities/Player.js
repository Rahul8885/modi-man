import Phaser from 'phaser'
import { GAME_CONFIG } from '../config.js'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // We start with the run animation loaded in PreloadScene
    super(scene, x, y, 'modi_run')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Physics sizing
    this.body.setSize(40, 80)
    this.body.setOffset(44, 48)
    this.body.setCollideWorldBounds(true)
    this.body.setMaxVelocity(0, 500)

    this.createAnimations()
    
    // Defaults
    this.play('run')
    this.laserCharge = GAME_CONFIG.LASER_CHARGE_MAX
    this.isDead = false
    this.isHurt = false
    this.isInvincible = false
    this.lastLaserAt = 0
    this.lasers = scene.physics.add.group() // Laser graphics group
  }

  die() {
    if (this.isDead) return
    this.isDead = true
    this.play('hurt_fly', true)
    this.body.setVelocityY(-300)
    this.body.checkCollision.none = true

    // Destroy any active lasers on death
    this.lasers.getChildren().forEach(l => l.destroy())
  }

  takeHit() {
    if (this.isInvincible || this.isDead) return true // true means handled/ignored

    this.isInvincible = true
    this.isHurt = true
    this.body.setVelocityX(0)
    this.play(this.body.touching.down ? 'hurt_run' : 'hurt_fly', true)

  // Flash effect for the configured invincibility duration
  const invDuration = (GAME_CONFIG && GAME_CONFIG.INVINCIBILITY_DURATION) ? GAME_CONFIG.INVINCIBILITY_DURATION : 2000

  const flashes = Math.max(2, Math.floor(invDuration / 150))
  console.debug('Player.takeHit: become invincible for', invDuration)
  this.scene.tweens.add({
    targets: this,
    alpha: 0.2,
    yoyo: true,
    repeat: flashes - 1,
    duration: 150,
    onComplete: () => {
       this.alpha = 1
       this.isInvincible = false
       this.isHurt = false
       console.debug('Player.takeHit: invincibility ended')
    }
  })
    return false // returning false means taking real damage
  }

  shootLaser() {
    // Allow firing while on ground or air (drain exists).
    const shotCost = GAME_CONFIG.LASER_SHOT_COST || 20
    const now = this.scene.time.now
    if (
      this.isDead ||
      this.isHurt ||
      this.laserCharge < shotCost ||
      this.lasers.countActive(true) >= 10 ||
      now - this.lastLaserAt < 120
    ) return false

    this.lastLaserAt = now
    this.laserCharge -= shotCost

    // Show eye glow while firing; projectile handles the actual hit.
    const wasFlying = !(this.body && this.body.touching && this.body.touching.down)
    if (wasFlying && this.scene.anims.exists('fly_laser')) {
      this.play('fly_laser', true)
    }
    this.scene.time.delayedCall(140, () => {
      if (this.isDead || this.isHurt) return
      if (this.body && this.body.touching && this.body.touching.down) {
        if (this.scene.anims.exists('run')) this.play('run', true)
      } else if (this.scene.anims.exists('fly')) {
        this.play('fly', true)
      }
    })

    // Draw a glowing projectile from Modi's eye level.
    const laser = this.scene.add.rectangle(this.x + 44, this.y - 24, 160, 10, 0xff2638, 1)
    laser.setOrigin(0, 0.5)
    laser.setBlendMode(Phaser.BlendModes.ADD)
    laser.setStrokeStyle(2, 0xffd0d0, 0.9)
    this.scene.physics.add.existing(laser)
    laser.body.allowGravity = false
    laser.body.setVelocityX(GAME_CONFIG.LASER_SPEED || 700)
    // Make the physics body match the visible rectangle
    if (laser.body.setSize) laser.body.setSize(160, 12)
    if (laser.body.setOffset) laser.body.setOffset(0, -1)
    // Put laser above player visuals
    if (laser.setDepth) laser.setDepth(50)

    this.lasers.add(laser)

    // Slight camera shake for juice
    if (this.scene.cameras && this.scene.cameras.main) this.scene.cameras.main.shake(50, 0.002)
    return true
  }

  createAnimations() {
    const anims = this.scene.anims

    // Setup safe creation logic in case frame generation fails due to image dimension issues
    const tryCreate = (key, spriteKey, endFrame, frameRate = 12) => {
        if (!anims.exists(key)) {
            try {
                anims.create({
                    key: key,
                    frames: anims.generateFrameNumbers(spriteKey, { start: 0, end: endFrame }),
                    frameRate: frameRate,
                    repeat: -1
                })
            } catch (e) {
                console.warn(`Failed to create anim ${key}`, e)
            }
        }
    }

    tryCreate('run', 'modi_run', 5)
    tryCreate('fly', 'modi_fly', 5, 10)
    tryCreate('jump', 'modi_jump', 5, 12)
    tryCreate('fly_laser', 'modi_fly_laser', 5, 15)
    tryCreate('hurt_run', 'modi_hurt_run', 1, 6)
    tryCreate('hurt_fly', 'modi_hurt_fly', 1, 6)
  }

  update(cursors, keys, delta) {
    if (this.isDead) return

    const dt = (delta || (1000 / 60)) / 1000
    this.body.setVelocityX(0)
    if (this.x < 120) this.x = 120
    if (this.x > 180) this.x = 180

    // Natural recharge (delta-based)
    if (this.laserCharge < GAME_CONFIG.LASER_CHARGE_MAX) {
      this.laserCharge += GAME_CONFIG.LASER_RECHARGE_RATE * dt
      this.laserCharge = Math.min(this.laserCharge, GAME_CONFIG.LASER_CHARGE_MAX)
    }

  // Shoot Laser (guard keys/X existence to avoid runtime errors if update is called early)
  if (keys && keys.X && Phaser.Input.Keyboard.JustDown(keys.X)) {
    this.shootLaser()
  }

    // Input handlers & State Machine
  if (cursors && cursors.space && cursors.space.isDown) {
      // Ascending
      this.body.setVelocityY(GAME_CONFIG.PLAYER_FLY_VELOCITY)
      this.setScale(1.15)
      
    // If we just jumped from the ground, play jump animation (don't override hurt)
    // We know we are ascending heavily here.
    if (!this.isHurt) {
      const velY = (this.body && this.body.velocity) ? this.body.velocity.y : 0
      const anims = this.scene && this.scene.anims
      // Play jump if we have a jump anim and we're ascending fast
      if (velY < -150 && anims && anims.exists('jump') && this.anims.currentAnim?.key !== 'jump' && this.anims.currentAnim?.key !== 'fly') {
        try { this.play('jump', true) } catch (e) { console.warn('failed to play jump anim', e) }
      } else if (anims && this.anims.currentAnim?.key !== 'jump' && this.anims.currentAnim?.key !== 'fly_laser') {
        // If we finish jumping or are cruising, play fly if it exists
        if (anims.exists('fly') && this.anims.currentAnim?.key !== 'fly') {
          try { this.play('fly', true) } catch (e) { console.warn('failed to play fly anim', e) }
        }
      }
    }
    } else {
      // Grounded check
  if (this.body && this.body.touching && this.body.touching.down) {
        this.setScale(1.0)
        if (!this.isHurt && this.anims.currentAnim?.key !== 'run') {
            this.play('run', true)
        }
      } else {
        // Falling
        this.setScale(1.15)
        if (!this.isHurt && this.anims.currentAnim?.key !== 'fly' && this.anims.currentAnim?.key !== 'fly_laser') {
           this.play('fly', true) 
        }
      }
    }

  // Clean up lasers that go off screen
  this.lasers.getChildren().forEach(laser => {
    if (laser.x > this.scene.sys.game.config.width + 100) laser.destroy()
  })
  }
}
