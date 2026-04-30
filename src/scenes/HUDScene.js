import Phaser from 'phaser'
import { GAME_CONFIG } from '../config.js'

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    const width = this.sys.game.config.width
    const height = this.sys.game.config.height

    this.scoreText = this.add.text(width - 16, 14, 'Score: 0', {
      fontSize: '14px',
      fill: '#FFF',
      fontStyle: 'bold'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100)

    this.laserBarText = this.add.text(16, height - 36, 'Laser', {
      fontSize: '10px',
      fill: '#FF3333'
    }).setScrollFactor(0).setDepth(100)

    this.add.rectangle(16, height - 16, 70, 8, 0x550000).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100)
    
    this.laserBar = this.add.rectangle(16, height - 16, 70, 8, 0xff0000).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101)

    // Lives icons
    this.lifeIcons = []
    const startX = 18
    for(let i=0; i<3; i++) {
      const icon = this.add.image(startX + (i * 20), 18, 'modi_life').setOrigin(0.5).setScale(0.04).setScrollFactor(0).setDepth(100)
      this.lifeIcons.push(icon)
    }
  }

  updateLives(lives) {
    if (!this.lifeIcons) return
    for(let i=0; i<3; i++) {
        this.lifeIcons[i].setVisible(i < lives)
    }
  }

  updateScore(score) {
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${Math.floor(score)}`)
    }
  }

  updateLaser(charge) {
    if (this.laserBar) {
      const pct = Math.max(0, Math.min(1, charge / GAME_CONFIG.LASER_CHARGE_MAX))
      this.laserBar.width = 70 * pct
    }
  }
}
