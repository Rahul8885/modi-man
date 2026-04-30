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
    this.lastLaserStoppedAt = 0
    this.laserImpactUntil = 0
    this.laserEndX = scene.sys.game.config.width + 80
    this.isLaserFiring = false
    this.laserBeamGraphics = scene.add.graphics().setDepth(60)
  }

  die() {
    if (this.isDead) return
    this.isDead = true
    this.play('hurt_fly', true)
    this.body.setVelocityY(-300)
    this.body.checkCollision.none = true

    // Destroy any active lasers on death
    this.stopLaserBeam()
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
    return this.startLaserBeam()
  }

  startLaserBeam() {
    const shotCost = GAME_CONFIG.LASER_SHOT_COST || 20
    const now = this.scene.time.now
    if (
      this.isDead ||
      this.isHurt ||
      this.laserCharge < shotCost ||
      now < this.laserImpactUntil ||
      now - this.lastLaserAt < 120
    ) return false

    this.lastLaserAt = now
    this.isLaserFiring = true

    if (this.scene.cameras && this.scene.cameras.main) this.scene.cameras.main.shake(50, 0.002)
    return true
  }

  stopLaserBeam() {
    if (this.isLaserFiring) this.lastLaserStoppedAt = this.scene.time.now
    this.isLaserFiring = false
    if (this.laserBeamGraphics) this.laserBeamGraphics.clear()
    this.laserEndX = this.scene.sys.game.config.width + 80
  }

  holdLaserAt(x, until) {
    this.isLaserFiring = true
    this.laserEndX = Math.max(this.x + 52, x)
    this.laserImpactUntil = until
    this.lastLaserStoppedAt = this.scene.time.now
    this.drawLaserBeam()
  }

  isGrounded() {
    return Boolean(this.body && (this.body.blocked.down || this.body.touching.down))
  }

  playMovementAnim(key) {
    if (this.isHurt || this.isDead) return
    if (!this.scene.anims.exists(key)) return
    if (this.anims.currentAnim?.key === key) return

    this.stop()
    this.setTexture(key === 'run' ? 'modi_run' : 'modi_fly', 0)
    try { this.play(key, true) } catch (e) { console.warn(`failed to play ${key} anim`, e) }
  }

  updateLaserBeam(dt, keyHeld) {
    const now = this.scene.time.now

    if (this.isDead || this.isHurt) {
      this.stopLaserBeam()
      return
    }

    if (now < this.laserImpactUntil) {
      this.drawLaserBeam()
      return
    }

    if (!keyHeld) {
      this.stopLaserBeam()
      return
    }

    this.laserEndX = this.scene.sys.game.config.width + 80
    if (!this.isLaserFiring && !this.startLaserBeam()) return

    this.laserCharge -= (GAME_CONFIG.LASER_DRAIN_RATE || 20) * dt
    if (this.laserCharge <= 0) {
      this.laserCharge = 0
      this.stopLaserBeam()
      return
    }

    this.drawLaserBeam()
  }

  drawLaserBeam() {
    const startX = this.x + 48
    const startY = this.y - 25
    const endX = this.laserEndX

    const flicker = Phaser.Math.Between(-1, 1)
    this.laserBeamGraphics.clear()
    this.laserBeamGraphics.lineStyle(12, 0xff2638, 0.16)
    this.laserBeamGraphics.beginPath()
    this.laserBeamGraphics.moveTo(startX, startY)
    this.laserBeamGraphics.lineTo(endX, startY + flicker)
    this.laserBeamGraphics.strokePath()
    this.laserBeamGraphics.lineStyle(5, 0xff4050, 0.45)
    this.laserBeamGraphics.beginPath()
    this.laserBeamGraphics.moveTo(startX, startY)
    this.laserBeamGraphics.lineTo(endX, startY)
    this.laserBeamGraphics.strokePath()
    this.laserBeamGraphics.lineStyle(2, 0xfff0f0, 0.95)
    this.laserBeamGraphics.beginPath()
    this.laserBeamGraphics.moveTo(startX, startY)
    this.laserBeamGraphics.lineTo(endX, startY)
    this.laserBeamGraphics.strokePath()
  }

  getLaserRay() {
    if (!this.isLaserFiring) return null
    if (this.scene.time.now < this.laserImpactUntil) return null

    return {
      startX: this.x + 48,
      startY: this.y - 25,
      endX: this.laserEndX
    }
  }

  setLaserEndX(x) {
    this.laserEndX = Math.max(this.x + 52, x)
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
    tryCreate('hurt_run', 'modi_hurt_run', 1, 6)
    tryCreate('hurt_fly', 'modi_hurt_fly', 1, 6)
  }

  update(cursors, keys, delta) {
    if (this.isDead) return

    const dt = (delta || (1000 / 60)) / 1000
    this.body.setVelocityX(0)
    if (this.x < 120) this.x = 120
    if (this.x > 180) this.x = 180

    const laserHeld = Boolean(keys && keys.X && keys.X.isDown)
    const rechargeDelay = GAME_CONFIG.LASER_RECHARGE_DELAY || 0
    const canRecharge = !laserHeld && !this.isLaserFiring && this.scene.time.now - this.lastLaserStoppedAt >= rechargeDelay
    if (canRecharge && this.laserCharge < GAME_CONFIG.LASER_CHARGE_MAX) {
      this.laserCharge += GAME_CONFIG.LASER_RECHARGE_RATE * dt
      this.laserCharge = Math.min(this.laserCharge, GAME_CONFIG.LASER_CHARGE_MAX)
    }

  this.updateLaserBeam(dt, laserHeld)

    // Input handlers & State Machine
  const spaceHeld = Boolean(cursors && cursors.space && cursors.space.isDown)
  if (spaceHeld) {
      this.body.setVelocityY(GAME_CONFIG.PLAYER_FLY_VELOCITY)
      this.setScale(1.15)
      this.playMovementAnim('fly')
    } else if (this.isGrounded()) {
      this.setScale(1.0)
      this.playMovementAnim('run')
    } else {
      this.setScale(1.15)
      this.playMovementAnim('fly')
    }

  }
}
