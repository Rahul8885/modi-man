import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const width = this.sys.game.config.width
    const height = this.sys.game.config.height

    this.add.text(width / 2, height / 2 - 40, 'MODI MAN\nDefender of Bharat', {
      fontSize: '40px',
      fill: '#FF9933', // Saffron
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 50, 'Press SPACE to Start', {
      fontSize: '24px',
      fill: '#FFFFFF'
    }).setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }
}
