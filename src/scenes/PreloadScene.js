import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    const width = this.sys.game.config.width
    const height = this.sys.game.config.height
    
    const loadingText = this.add.text(width / 2, height / 2, 'Loading assets...', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5)

    const modiPath = '/src/assets/sprites/modi/'
    const enemiesPath = '/src/assets/sprites/enemies/'
    
    // Backgrounds
    for (let i = 1; i <= 4; i++) {
        this.load.image(`delhi_${i}`, `/src/assets/backgrounds/delhi/delhi_${i}.png`)
        this.load.image(`mumbai_${i}`, `/src/assets/backgrounds/mumbai/mumbai_${i}.png`)
    }

    // Use 128x128 frame dimensions for Modi
    const loadSprite = (key, path) => {
        this.load.spritesheet(key, path, { frameWidth: 128, frameHeight: 128 })
    }

    // Modi Sprites
    loadSprite('modi_run', modiPath + 'Running.png')
    loadSprite('modi_fly', modiPath + 'Flying.png')
    loadSprite('modi_fly_laser', modiPath + 'Flying_Lasers.png')
    loadSprite('modi_jump', modiPath + 'Jumping.png')
    loadSprite('modi_land', modiPath + 'Landing.png')
    loadSprite('modi_hurt_run', modiPath + 'hurt_run.png')
    loadSprite('modi_hurt_fly', modiPath + 'hurt_flight.png')
    loadSprite('modi_idle', modiPath + 'modi_idle.png')
    loadSprite('modi_walk', modiPath + 'modi_walk.png')

    // Enemy Sprites
    loadSprite('ufo_hover', enemiesPath + 'Ufo_hover.png')
    loadSprite('ufo_explosion', enemiesPath + 'Ufo_explosion.png')

    this.load.on('complete', () => {
      loadingText.destroy()
    })
  }

  create() {
    // Generate some basic animations if possible, or wait until entities create them
    this.scene.start('MenuScene')
  }
}
