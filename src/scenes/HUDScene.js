import Phaser from 'phaser'
import { GAME_CONFIG } from '../config.js'

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    const width = this.sys.game.config.width

    const pad = 22
    const hudDepth = 100
    const textStyle = {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '22px',
      fill: '#fff6d8',
      fontStyle: 'bold',
      stroke: '#1a1028',
      strokeThickness: 4,
      shadow: {
        offsetX: 1,
        offsetY: 2,
        color: '#000000',
        blur: 2,
        fill: true
      }
    }

    this.scoreText = this.add.text(width - pad, 18, 'Score: 0', textStyle)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(hudDepth)
      .setResolution(2)

    this.lifeIcons = []
    const startX = pad + 14
    for (let i = 0; i < 3; i++) {
      const badgeX = startX + (i * 38)
      this.add.circle(badgeX, 28, 17, 0x15172a, 0.8)
        .setStrokeStyle(2, 0xffe7a8, 0.95)
        .setScrollFactor(0)
        .setDepth(hudDepth)

      const icon = this.add.image(badgeX, 28, 'modi_life')
        .setOrigin(0.5)
        .setDisplaySize(30, 30)
        .setScrollFactor(0)
        .setDepth(hudDepth + 1)
      this.lifeIcons.push(icon)
    }

    this.laserWidth = 118
    this.laserHeight = 10
    this.laserX = pad
    this.laserY = 78
    this.laserFillWidth = this.laserWidth

    this.laserBarText = this.add.text(this.laserX, this.laserY - 24, 'LASER', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '12px',
      fill: '#ffdfdf',
      fontStyle: 'bold',
      stroke: '#24070c',
      strokeThickness: 2
    })
      .setScrollFactor(0)
      .setDepth(hudDepth)
      .setResolution(2)

    this.laserGraphics = this.add.graphics()
      .setScrollFactor(0)
      .setDepth(hudDepth)
    this.drawLaserBar(1)
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
    if (this.laserGraphics) {
      const pct = Math.max(0, Math.min(1, charge / GAME_CONFIG.LASER_CHARGE_MAX))
      this.drawLaserBar(pct)
    }
  }

  drawLaserBar(pct) {
    const g = this.laserGraphics
    const x = this.laserX
    const y = this.laserY
    const w = this.laserWidth
    const h = this.laserHeight
    const fillWidth = Math.max(0, (w - 6) * pct)

    g.clear()
    g.fillStyle(0x12070b, 0.78)
    g.fillRoundedRect(x - 3, y - 3, w + 6, h + 6, 6)
    g.lineStyle(2, 0xffd4d4, 0.85)
    g.strokeRoundedRect(x - 3, y - 3, w + 6, h + 6, 6)
    g.fillStyle(0x431018, 1)
    g.fillRoundedRect(x, y, w, h, 4)

    if (fillWidth > 0) {
      g.fillGradientStyle(0xfffbf5, 0xff545d, 0xff2638, 0x9b0716, 1)
      g.fillRoundedRect(x + 3, y + 3, fillWidth, h - 6, 3)
      g.lineStyle(1, 0xffffff, 0.55)
      g.lineBetween(x + 5, y + 4, x + 3 + fillWidth, y + 4)
    }
  }
}
