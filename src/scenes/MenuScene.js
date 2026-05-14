import Phaser from 'phaser'

const RAJDHANI = 'Rajdhani, Arial, sans-serif'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const { width, height } = this.scale
    this.bestScore = Number.parseInt(sessionStorage.getItem('modiManBestScore') || '0', 10)

    this.addCoverImage('menu_bg', width, height)
    this.drawLogo(width, height)
    this.drawMenuButtons(width, height)

    this.input.keyboard.once('keydown-SPACE', () => this.openCitySelect())
    this.input.keyboard.once('keydown-ENTER', () => this.openCitySelect())
  }

  addCoverImage(key, width, height) {
    const image = this.add.image(width / 2, height / 2, key)
    const texture = this.textures.get(key).getSourceImage()
    const scale = Math.max(width / texture.width, height / texture.height)
     const g = this.add.graphics()
    g.fillStyle(0x020818, 0.48)
    g.fillRect(0, 0, width, height)
    image.setScale(scale)
    return image
  }

  drawLogo(width, height) {
    const logo = this.add.image(width / 2, height * 0.42, 'modi_man_logo')
      .setOrigin(0.5)
      .setDepth(2)

    const source = this.textures.get('modi_man_logo').getSourceImage()
    const maxW = width * 0.56
    const maxH = height * 0.56
    logo.setScale(Math.min(maxW / source.width, maxH / source.height))
  }

  drawMenuButtons(width, height) {
    this.makeButton(width / 2, height * 0.66, 220, 54, 'PLAY', () => this.openCitySelect())

    this.add.text(width / 2, height * 0.77, 'BEST: ' + this.bestScore.toLocaleString('en-IN') + ' PTS', {
      fontFamily: RAJDHANI,
      fontSize: '18px',
      fontStyle: '700',
      color: '#ffd700',
      letterSpacing: 2
    }).setOrigin(0.5).setAlpha(0.85).setResolution(2)
  }

  makeButton(x, y, w, h, label, onClick) {
    const c = this.add.container(x, y).setDepth(3)
    const g = this.add.graphics()
    g.fillGradientStyle(0xffb347, 0xffb347, 0xff8c00, 0xff8c00, 1)
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 4)
    g.fillStyle(0x8b3a00, 1)
    g.fillRoundedRect(-w / 2, h / 2 - 2, w, 7, 2)

    const text = this.add.text(0, 1, label, {
      fontFamily: RAJDHANI,
      fontSize: '24px',
      fontStyle: '700',
      color: '#0d0b1e',
      letterSpacing: 3
    }).setOrigin(0.5).setResolution(2)

    c.add([g, text])
    c.setSize(w, h)
    c.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains)
    c.input.cursor = 'pointer'
    c.on('pointerover', () => c.setScale(1.04))
    c.on('pointerout', () => c.setScale(1))
    c.on('pointerdown', onClick)
    return c
  }

  openCitySelect() {
    this.scene.start('CitySelectScene')
  }
}
