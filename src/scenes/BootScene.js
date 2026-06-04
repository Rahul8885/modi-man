import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // We could load a splash screen logo here if needed
  }

  create() {
    if (!document.fonts) {
      this.scene.start('PreloadScene')
      return
    }

    Promise.all([
      document.fonts.load('700 64px Teko'),
      document.fonts.load('600 24px Rajdhani')
    ]).finally(() => {
      this.scene.start('PreloadScene')
    })
  }
}
