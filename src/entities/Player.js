import Phaser from 'phaser'
import { GAME_CONFIG } from '../config.js'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // We start with the run animation loaded in PreloadScene
    super(scene, x, y, 'modi_run')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Physics sizing
    this.body.setSize(32, 50)
    // Offset standard 64x64 frame for center
    this.body.setOffset(16, 14) 

    this.createAnimations()
    
    // Defaults
    this.play('run')
    this.laserCharge = GAME_CONFIG.LASER_CHARGE_MAX
    this.isDead = false
    this.isHurt = false
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
    tryCreate('hurt', 'modi_hurt_run', 1, 6)
  }

  update(cursors, keys) {
    if (this.isDead || this.isHurt) return

    // Natural recharge
    if (this.laserCharge < GAME_CONFIG.LASER_CHARGE_MAX) {
      this.laserCharge += GAME_CONFIG.LASER_RECHARGE_RATE * (1/60)
      this.laserCharge = Math.min(this.laserCharge, GAME_CONFIG.LASER_CHARGE_MAX)
    }

    // Input handlers
    if (cursors.space.isDown) {
      // Fly/Hover logic
      this.body.setVelocityY(GAME_CONFIG.PLAYER_FLY_VELOCITY)
      if (this.anims.currentAnim?.key !== 'fly') {
        this.play('fly', true)
      }
    } else {
      // Grounded check
      if (this.body.touching.down) {
        if (this.anims.currentAnim?.key !== 'run') {
            this.play('run', true)
        }
      } else {
        // Falling
        if (this.anims.currentAnim?.key !== 'fly') {
           this.play('fly', true) 
        }
      }
    }
  }
}
