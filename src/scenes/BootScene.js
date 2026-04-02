import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // We could load a splash screen logo here if needed
  }

  create() {
    this.scene.start('PreloadScene')
  }
}
