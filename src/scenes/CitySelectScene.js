import Phaser from 'phaser'

const TEKO = 'Teko, Impact, sans-serif'
const RAJDHANI = 'Rajdhani, Arial, sans-serif'

export default class CitySelectScene extends Phaser.Scene {
  constructor() {
    super('CitySelectScene')
  }

  create() {
    const { width, height } = this.scale
    this.drawBackground(width, height)

    this.add.text(width / 2, height * 0.16, 'CHOOSE YOUR CITY', {
      fontFamily: TEKO,
      fontSize: '54px',
      fontStyle: '700',
      color: '#fff5cc',
      letterSpacing: 6
    }).setOrigin(0.5).setAlpha(0.92).setResolution(2)

    this.add.text(width / 2, height * 0.235, 'EACH CITY. A DIFFERENT BATTLE.', {
      fontFamily: RAJDHANI,
      fontSize: '16px',
      fontStyle: '600',
      color: '#ffffff55',
      letterSpacing: 3
    }).setOrigin(0.5).setResolution(2)

    const y = height * 0.53
    this.createCityCard(width / 2 - 230, y, 'NEW DELHI', 'MIDNIGHT - MUGHAL SKYLINE', 'AVAILABLE', 'delhi')
    this.createCityCard(width / 2, y, 'CYBER MUMBAI', 'NEON NIGHT - CYBERPUNK', 'AVAILABLE', 'mumbai')
    this.createLockedCard(width / 2 + 230, y)

    this.add.text(width / 2, height * 0.88, 'SURVIVE LONGER TO UNLOCK NEW CITIES', {
      fontFamily: RAJDHANI,
      fontSize: '16px',
      fontStyle: '600',
      color: '#ffffff33',
      letterSpacing: 2
    }).setOrigin(0.5).setResolution(2)

    this.input.keyboard.once('keydown-ESC', () => this.scene.start('MenuScene'))
  }

  drawBackground(width, height) {
    const image = this.add.image(width / 2, height / 2, 'menu_bg')
    const texture = this.textures.get('menu_bg').getSourceImage()
    image.setScale(Math.max(width / texture.width, height / texture.height))

    const g = this.add.graphics()
    g.fillStyle(0x020818, 0.48)
    g.fillRect(0, 0, width, height)
  }

  createCityCard(x, y, title, desc, tag, city) {
    const accent = city === 'delhi' ? 0xff8c00 : 0x00ffcc
    const container = this.add.container(x, y)
    const w = 180
    const previewH = 112
    const infoH = 88

    const border = this.add.graphics()
    border.lineStyle(2, accent, 0.48)
    border.strokeRoundedRect(-w / 2, -previewH / 2, w, previewH + infoH, 8)
    border.fillStyle(0x0a0a1a, 1)
    border.fillRoundedRect(-w / 2 + 2, -previewH / 2 + previewH, w - 4, infoH - 2, { tl: 0, tr: 0, bl: 8, br: 8 })
    container.add(border)

    const thumbnailKey = city === 'delhi' ? 'delhi_thumbnail' : 'mumbai_thumbnail'
    const thumbnail = this.add.image(0, 0, thumbnailKey)
    thumbnail.setDisplaySize(w - 4, previewH - 2)
    container.add(thumbnail)

    const shade = this.add.graphics()
    shade.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.24, 0.24)
    shade.fillRect(-w / 2 + 2, -previewH / 2 + 2, w - 4, previewH - 2)
    container.add(shade)

    container.add(this.add.text(-w / 2 + 16, previewH / 2 + 18, title, {
      fontFamily: TEKO,
      fontSize: '31px',
      fontStyle: '700',
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      letterSpacing: 2
    }).setOrigin(0, 0.5).setResolution(2))

    container.add(this.add.text(-w / 2 + 16, previewH / 2 + 44, desc, {
      fontFamily: RAJDHANI,
      fontSize: '12px',
      fontStyle: '600',
      color: '#ffffff66',
      letterSpacing: 1
    }).setOrigin(0, 0.5).setResolution(2))

    const tagBg = this.add.graphics()
    tagBg.fillStyle(accent, city === 'delhi' ? 0.14 : 0.08)
    tagBg.fillRoundedRect(-w / 2 + 16, previewH / 2 + 60, 82, 20, 2)
    tagBg.lineStyle(1, accent, city === 'delhi' ? 0.28 : 0.2)
    tagBg.strokeRoundedRect(-w / 2 + 16, previewH / 2 + 60, 82, 20, 2)
    container.add(tagBg)
    container.add(this.add.text(-w / 2 + 57, previewH / 2 + 70, tag, {
      fontFamily: RAJDHANI,
      fontSize: '11px',
      fontStyle: '700',
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      letterSpacing: 1
    }).setOrigin(0.5).setResolution(2))

    container.setSize(w, previewH + infoH)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -previewH / 2, w, previewH + infoH),
      Phaser.Geom.Rectangle.Contains
    )
    container.input.cursor = 'pointer'
    container.on('pointerover', () => container.setScale(1.04))
    container.on('pointerout', () => container.setScale(1))
    container.on('pointerdown', () => this.startGame(city))
    return container
  }

  createLockedCard(x, y) {
    const container = this.add.container(x, y).setAlpha(0.5)
    const w = 180
    const previewH = 112
    const infoH = 88
    const g = this.add.graphics()
    g.lineStyle(2, 0xffffff, 0.08)
    g.strokeRoundedRect(-w / 2, -previewH / 2, w, previewH + infoH, 8)
    g.fillStyle(0x0a0a0a, 1).fillRoundedRect(-w / 2 + 2, -previewH / 2 + 2, w - 4, previewH - 2, { tl: 8, tr: 8, bl: 0, br: 0 })
    g.fillStyle(0x0a0a1a, 1).fillRoundedRect(-w / 2 + 2, previewH / 2, w - 4, infoH - 2, { tl: 0, tr: 0, bl: 8, br: 8 })
    container.add(g)
    container.add(this.add.text(0, -5, 'LOCKED', { fontFamily: RAJDHANI, fontSize: '16px', fontStyle: '700', color: '#ffffff66', letterSpacing: 2 }).setOrigin(0.5).setResolution(2))
    container.add(this.add.text(-w / 2 + 16, previewH / 2 + 18, 'HIMALAYA', { fontFamily: TEKO, fontSize: '31px', fontStyle: '700', color: '#ffffff66', letterSpacing: 2 }).setOrigin(0, 0.5).setResolution(2))
    container.add(this.add.text(-w / 2 + 16, previewH / 2 + 44, 'COMING SOON', { fontFamily: RAJDHANI, fontSize: '12px', fontStyle: '600', color: '#ffffff66', letterSpacing: 1 }).setOrigin(0, 0.5).setResolution(2))
    container.add(this.add.text(-w / 2 + 16, previewH / 2 + 70, 'UNLOCK @ 5K', { fontFamily: RAJDHANI, fontSize: '11px', fontStyle: '700', color: '#ffffff44', letterSpacing: 1 }).setOrigin(0, 0.5).setResolution(2))
  }

  startGame(city) {
    this.scene.start('GameScene', { city })
  }
}
