import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    const width = this.scale.width
    const height = this.scale.height
    
    const loadingText = this.add.text(width / 2, height / 2, 'Loading assets...', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5)

    const assetsPath = 'assets/'
    const modiPath = `${assetsPath}sprites/modi/`
    const enemiesPath = `${assetsPath}sprites/enemies/`
    
    // Backgrounds
    for (let i = 1; i <= 4; i++) {
        this.load.image(`delhi_${i}`, `${assetsPath}backgrounds/delhi/delhi_${i}.png`)
        this.load.image(`mumbai_${i}`, `${assetsPath}backgrounds/mumbai/mumbai_${i}.png`)
    }

    // UI Elements
    this.load.image('modi_life', `${assetsPath}modi_life.png`)
    this.load.image('menu_bg', `${assetsPath}backgrounds/menu_bg.png`)
    this.load.image('modi_man_logo', `${assetsPath}modi-man-logo.png`)
    this.load.image('delhi_thumbnail', `${assetsPath}delhi_thumbnail.png`)
    this.load.image('mumbai_thumbnail', `${assetsPath}mumbai_thumbnail.png`)

    const loadSprite = (key, path, frameHeight = 128) => {
        this.load.spritesheet(key, path, { frameWidth: 128, frameHeight })
    }

    // Modi Sprites
    loadSprite('modi_run', modiPath + 'Running.png')
    loadSprite('modi_fly', modiPath + 'Flying.png')
    loadSprite('modi_fly_laser', modiPath + 'Flying_Lasers.png')
    loadSprite('modi_jump', modiPath + 'Jumping.png', 124)
    loadSprite('modi_land', modiPath + 'Landing.png', 124)
    loadSprite('modi_hurt_run', modiPath + 'hurt_run.png')
    loadSprite('modi_hurt_fly', modiPath + 'hurt_flight.png')
    loadSprite('modi_idle', modiPath + 'modi_idle.png')
    loadSprite('modi_walk', modiPath + 'modi_walk.png')

    // Enemy Sprites
    loadSprite('ufo_hover', enemiesPath + 'Ufo_hover.png')
    loadSprite('ufo_explosion', enemiesPath + 'Ufo_explosion.png')

    // Audio
    this.load.audio('bgm_prologue', `${assetsPath}sfx/prologue_epic.mp3`)
    this.load.audio('menu_music', `${assetsPath}sfx/menu_music.mp3`)
    this.load.audio('sfx_laser', `${assetsPath}sfx/sfx_laser.mp3`)
    this.load.audio('sfx_modi_hit', `${assetsPath}sfx/modi_hit_sfx.mp3`)
    this.load.audio('sfx_modi_run', `${assetsPath}sfx/modi_run_sfx.mp3`)
    this.load.audio('sfx_ufo_explosion', `${assetsPath}sfx/ufo_explosion.mp3`)
    // alias death to hit (we'll add same file under another key so code can refer to 'sfx_modi_death')
    this.load.audio('sfx_modi_death', `${assetsPath}sfx/modi_hit_sfx.mp3`)

    this.load.on('complete', () => {
      loadingText.destroy()
    })
  }

  create() {
    // Generate UFO animations
    this.anims.create({
      key: 'ufo_hover_anim',
      frames: this.anims.generateFrameNumbers('ufo_hover', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'ufo_explosion_anim',
      frames: this.anims.generateFrameNumbers('ufo_explosion', { start: 0, end: 5 }), // assuming it has frames, we'll configure dynamically if we must, but standard 6 frames usually
      frameRate: 15,
      repeat: 0
    })

    this.scene.start('PrologueScene')
  }
}
