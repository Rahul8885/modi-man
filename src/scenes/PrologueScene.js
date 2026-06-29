import Phaser from 'phaser'

export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('PrologueScene')
    this._overlay = null
    this._raf = null
    this._syncOverlayBounds = null
    this._syncOverlayBoundsDelayed = null
  }

  create() {
    const { width, height } = this.scale
    this.skipping = false
    this.ending = false
    this.bgm = null

    this.cameras.main.fadeIn(700)
    this.createStars(width, height)
    this.startMusic()

    this.time.delayedCall(650, () => this.startCrawl())

    this.input.keyboard.once('keydown-SPACE', () => this.skipPrologue())
    this.input.keyboard.once('keydown-ENTER', () => this.skipPrologue())
    this.input.on('pointerdown', () => this.skipPrologue())

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.stopMusic()
      this._removeOverlay()
      this.scene.start('MenuScene')
    })
  }

  createStars(width, height) {
    this.stars = []
    for (let i = 0; i < 140; i++) {
      const g = this.add.graphics()
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      const r = Phaser.Math.FloatBetween(0.8, 2.2)
      const base = Phaser.Math.FloatBetween(0.35, 0.95)
      g.fillStyle(0xffffff, base)
      g.fillCircle(x, y, r)
      this.stars.push({
        g,
        base,
        twinkle: Math.random() < 0.15,
        speed: Phaser.Math.FloatBetween(0.002, 0.007),
        offset: Phaser.Math.FloatBetween(0, Math.PI * 2)
      })
    }
  }

  startMusic() {
    try {
      this.bgm = this.sound.add('bgm_prologue', { volume: 0, loop: true })
      this.bgm.play({ volume: 0, loop: true })
      this.tweens.add({
        targets: this.bgm,
        volume: 0.72,
        duration: 1800,
        ease: 'Power1'
      })
    } catch (e) {
      this.bgm = null
    }
  }

  stopMusic() {
    try {
      if (this.bgm) this.bgm.stop()
    } catch (e) {}
    this.bgm = null
  }

  startCrawl() {
    if (this.skipping || this._overlay) return

    const { width, height } = this.scale
    const canvas = this.sys.game.canvas
    const rect = canvas.getBoundingClientRect()

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      left: ${rect.left}px; top: ${rect.top}px;
      width: ${rect.width}px; height: ${rect.height}px;
      overflow: hidden;
      pointer-events: none;
      z-index: 10;
    `

    const perspBox = document.createElement('div')
    perspBox.style.cssText = `
      position: absolute; inset: 0;
      perspective: ${Math.round(height * 0.72)}px;
      perspective-origin: 50% 18%;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 78%, transparent 100%);
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 78%, transparent 100%);
    `

    const strip = document.createElement('div')
    strip.style.cssText = `
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%) rotateX(24deg);
      transform-origin: bottom center;
      width: 58%;
      will-change: bottom;
    `

    const crawlLines = [
      { text: 'MODI MAN', big: true },
      { text: 'A long time ago, in a land of spices and satellites...', big: false },
      { text: 'The forces of chaos -- alien armadas and rogue fighter jets -- threatened the peace of Bharat.', big: false },
      { text: 'One man. One kurta. One laser gaze.', big: false },
      { text: 'Rising from the banks of the Sabarmati, chosen by the cosmos itself, armed with the power of a billion prayers and an unbreakable resolve...', big: false },
      { text: 'MODI MAN AWAKENS.', big: true }
    ]

    const baseFontPx = Math.round(Math.min(width, height) * 0.034)
    crawlLines.forEach(({ text, big }) => {
      const p = document.createElement('p')
      p.textContent = text
      p.style.cssText = `
        margin: 0 0 ${big ? 1.1 : 1.55}em;
        text-align: center;
        font-family: Georgia, serif;
        font-weight: 700;
        line-height: ${big ? 1.25 : 1.65};
        color: ${big ? '#fff8e6' : '#FFB347'};
        font-size: ${big ? Math.round(baseFontPx * 1.45) : baseFontPx}px;
        ${big ? 'letter-spacing: 4px; text-shadow: 0 0 14px rgba(255,140,0,0.72);' : ''}
      `
      strip.appendChild(p)
    })

    perspBox.appendChild(strip)
    overlay.appendChild(perspBox)
    document.body.appendChild(overlay)
    this._overlay = overlay
    this._syncOverlayBounds = () => {
      const currentRect = canvas.getBoundingClientRect()
      overlay.style.left = currentRect.left + 'px'
      overlay.style.top = currentRect.top + 'px'
      overlay.style.width = currentRect.width + 'px'
      overlay.style.height = currentRect.height + 'px'
    }
    this._syncOverlayBounds()
    this._syncOverlayBoundsDelayed = () => {
      requestAnimationFrame(() => this._syncOverlayBounds && this._syncOverlayBounds())
      setTimeout(() => this._syncOverlayBounds && this._syncOverlayBounds(), 250)
    }
    window.addEventListener('resize', this._syncOverlayBounds)
    window.addEventListener('orientationchange', this._syncOverlayBounds)
    document.addEventListener('fullscreenchange', this._syncOverlayBounds)
    document.addEventListener('fullscreenchange', this._syncOverlayBoundsDelayed)

    const speed = height * 0.065
    const endBottom = strip.scrollHeight + height * 0.7
    const startBottom = -(strip.scrollHeight + height * 0.08)
    let startTime = null

    const tick = ts => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const pos = startBottom + speed * elapsed
      strip.style.bottom = pos + 'px'

      if (pos < endBottom) {
        this._raf = requestAnimationFrame(tick)
      } else {
        this.time.delayedCall(900, () => this.finishPrologue())
      }
    }

    this._raf = requestAnimationFrame(tick)
  }

  finishPrologue() {
    if (this.ending) return
    this.ending = true
    this.stopMusic()
    this.cameras.main.fadeOut(550)
  }

  _removeOverlay() {
    if (this._raf) cancelAnimationFrame(this._raf)
    this._raf = null
    if (this._syncOverlayBounds) {
      window.removeEventListener('resize', this._syncOverlayBounds)
      window.removeEventListener('orientationchange', this._syncOverlayBounds)
      document.removeEventListener('fullscreenchange', this._syncOverlayBounds)
      document.removeEventListener('fullscreenchange', this._syncOverlayBoundsDelayed)
    }
    this._syncOverlayBounds = null
    this._syncOverlayBoundsDelayed = null
    if (this._overlay && this._overlay.parentNode) {
      this._overlay.parentNode.removeChild(this._overlay)
    }
    this._overlay = null
  }

  skipPrologue() {
    if (this.skipping) return
    this.skipping = true
    this.finishPrologue()
  }

  update(time) {
    for (const s of this.stars) {
      if (!s.twinkle) continue
      const a = s.base + 0.35 * Math.sin(time * s.speed + s.offset)
      s.g.setAlpha(Phaser.Math.Clamp(a, 0.05, 1))
    }
  }
}
