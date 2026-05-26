import Phaser from 'phaser'

const CRAWL_COLOR = '#FFB347'

export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('PrologueScene')
  }

  create() {
    const { width, height } = this.scale
    this.skipping = false

    // Camera fade in
    this.cameras.main.fadeIn(800)

    // Stars
    this.stars = []
    const starCount = 120
    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      const g = this.add.graphics()
      const radius = Phaser.Math.Between(1, 2.5)
      const color = Phaser.Math.Between(0, 1) ? 0xffffff : 0xcfeaff
      const baseAlpha = Phaser.Math.FloatBetween(0.4, 1)
      g.fillStyle(color, baseAlpha)
      g.fillCircle(x, y, radius)
      const twinkle = Phaser.Math.Between(0, 6) === 0 // ~1/7 twinkle
      this.stars.push({ g, x, y, baseAlpha, twinkle, speed: Phaser.Math.FloatBetween(0.002, 0.009), offset: Phaser.Math.FloatBetween(0, Math.PI * 2) })
    }

    // Title
    const title = this.add.text(width / 2, height * 0.28, 'MODI MAN', {
      fontFamily: 'Georgia, serif',
      fontSize: Math.round(Math.min(width, height) * 0.12) + 'px',
      color: '#fff8e6',
      fontStyle: '700'
    }).setOrigin(0.5).setAlpha(0)

    title.setShadow(0, 0, '#ff8c00', 8)

    // Title fade in, hold, fade out
    this.tweens.add({ targets: title, alpha: 1, duration: 1500, ease: 'Power1' })
    this.time.delayedCall(1500 + 2000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 800, ease: 'Power1', onComplete: () => this.startCrawl() })
    })

    // Input to skip
    this.input.keyboard.once('keydown-SPACE', () => this.skipPrologue())
    this.input.on('pointerdown', () => this.skipPrologue())

    // Prepare audio reference
    this.bgm = null

    // Listen for camera fade out completion
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.bgm) this.bgm.stop()
      this.scene.start('MenuScene')
    })
  }

  startCrawl() {
    const { width, height } = this.scale

    // Play prologue bgm
    try {
      this.bgm = this.sound.add('bgm_prologue', { volume: 0.6, loop: true })
      this.bgm.play()
    } catch (e) {
      // ignore if not available
    }

    const crawlText = `A long time ago, in a land of spices and satellites…\n\nThe forces of chaos — alien armadas and rogue fighter jets — threatened the peace of Bharat.\n\nOne man. One kurta. One laser gaze.\n\nRising from the banks of the Sabarmati, chosen by the cosmos itself, armed with the power of a billion prayers and an unbreakable resolve…\n\nMODI MAN awakens.`

    const columnWidth = Math.round(width * 0.58)
    const text = this.add.text(0, 0, crawlText, {
      fontFamily: 'Georgia, serif',
      fontSize: Math.round(Math.min(width, height) * 0.035) + 'px',
      color: CRAWL_COLOR,
      fontStyle: '700',
      wordWrap: { width: columnWidth },
      align: 'center'
    }).setOrigin(0.5)

    // container to move and scale
    const container = this.add.container(width / 2, height + 40, [text])
    this.crawlContainer = container

    // Calculate end position so last line goes past y=0
    const textHeight = text.height
    const startY = height + 40
    const endY = -textHeight - 40
    const distance = startY - endY
    const speed = 40 // px/s
    const duration = Math.ceil((distance / speed) * 1000)

    this.tweens.add({ targets: container, y: endY, duration, ease: 'Linear', onComplete: () => {
      this.time.delayedCall(1000, () => {
        // natural end, fade out
        this.cameras.main.fadeOut(500)
      })
    }})
  }

  skipPrologue() {
    if (this.skipping) return
    this.skipping = true
    if (this.bgm) this.bgm.stop()
    this.cameras.main.fadeOut(500)
  }

  update(time) {
    // twinkle stars
    for (const s of this.stars) {
      if (!s.twinkle) continue
      const a = s.baseAlpha + 0.4 * Math.sin(time * s.speed + s.offset)
      s.g.setAlpha(Phaser.Math.Clamp(a, 0.1, 1))
    }

    // perspective scaling for crawl
    if (this.crawlContainer) {
      const { height } = this.scale
      const t = Phaser.Math.Clamp(1 - (this.crawlContainer.y / height), 0, 1)
      const scale = Phaser.Math.Interpolation.Linear([1, 0.4], t)
      this.crawlContainer.setScale(scale)
    }
  }
}
