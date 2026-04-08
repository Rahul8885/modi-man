import Phaser from 'phaser'

export default class CitySelectScene extends Phaser.Scene {
  constructor() {
    super('CitySelectScene')
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background color
    this.cameras.main.setBackgroundColor('#2a1a4a')

    const title = this.add.text(width / 2, height / 2 - 100, 'Select Your City', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5)

    const btnStyle = {
      fontSize: '32px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }

    const delhiBtn = this.add.text(width / 2 - 150, height / 2, 'Delhi', btnStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame('delhi'))
      
    const mumbaiBtn = this.add.text(width / 2 + 150, height / 2, 'Mumbai', btnStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame('mumbai'))

    // Hover effects
    const addHover = (btn) => {
      btn.on('pointerover', () => btn.setStyle({ fill: '#fff' }))
      btn.on('pointerout', () => btn.setStyle({ fill: '#0f0' }))
    }

    addHover(delhiBtn)
    addHover(mumbaiBtn)
  }

  startGame(city) {
    this.scene.start('GameScene', { city: city })
  }
}
