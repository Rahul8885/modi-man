import Phaser from 'phaser'
import { GAME_CONFIG } from '../config.js'

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      fill: '#FFF',
      fontStyle: 'bold'
    })

    this.laserBarText = this.add.text(20, 55, 'Laser', {
      fontSize: '18px',
      fill: '#FF3333'
    })

    // Draw background for laser bar
    this.add.rectangle(90, 65, 100, 14, 0x550000).setOrigin(0, 0.5)
    
    // Draw active laser bar
    this.laserBar = this.add.rectangle(90, 65, 100, 14, 0xff0000).setOrigin(0, 0.5)

    // Lives icons
    this.lifeIcons = []
    const startX = this.sys.game.config.width - 150
    for(let i=0; i<3; i++) {
        const icon = this.add.image(startX + (i * 45), 30, 'modi_life').setOrigin(0.5).setScale(0.15) 
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
      this.laserBar.width = 100 * pct
    }
  }
}
