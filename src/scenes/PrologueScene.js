import Phaser from 'phaser'

export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('PrologueScene')
    this._overlay = null
  }

  create() {
    const { width, height } = this.scale
    this.skipping = false
    this.cameras.main.fadeIn(800)

    // ── Stars ──────────────────────────────────────────────────────────
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
        g, base,
        twinkle: Math.random() < 0.15,
        speed: Phaser.Math.FloatBetween(0.002, 0.007),
        offset: Phaser.Math.FloatBetween(0, Math.PI * 2)
      })
    }
     // Play BGM right away, seek past 2s silence, fade in gently
  try {
    this.bgm = this.sound.add('bgm_prologue', { volume: 0, loop: true })
    this.bgm.play({ seek: 2 })
    this.tweens.add({
      targets: this.bgm,
      volume: 1,
      duration: 1800,
      ease: 'Power1'
    })
  } catch (e) {}
    // ── "MODI MAN" title card ─────────────────────────────────────────
    const title = this.add.text(width / 2, height * 0.38, 'MODI MAN', {
      fontFamily: 'Georgia, serif',
      fontSize: Math.round(Math.min(width, height) * 0.12) + 'px',
      color: '#fff8e6',
      fontStyle: '700'
    }).setOrigin(0.5).setAlpha(0)

    title.setShadow(0, 0, '#ff8c00', 10)

    // fade in → hold → shrink + fade out → start crawl
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 1400,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1800, () => {
          this.tweens.add({
            targets: title,
            alpha: 0,
            scaleX: 0.4,
            scaleY: 0.4,
            y: height * 0.12,          // drift toward top/vanishing point
            duration: 1200,
            ease: 'Power2.easeIn',
            onComplete: () => this.startCrawl()
          })
        })
      }
    })

    // ── Skip ──────────────────────────────────────────────────────────
    this.input.keyboard.once('keydown-SPACE', () => this.skipPrologue())
    this.input.on('pointerdown', () => this.skipPrologue())

    this.bgm = null
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.bgm) this.bgm.stop()
      this._removeOverlay()
      this.scene.start('MenuScene')
    })
  }

  startCrawl() {
    const { width, height } = this.scale

    // ── DOM overlay ───────────────────────────────────────────────────
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

    // Top fade — text dissolves into the stars
    const topFade = document.createElement('div')
    topFade.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0;
      height: 45%; z-index: 2;
      background: linear-gradient(to bottom, #000 25%, transparent);
      pointer-events: none;
    `

    // Bottom fade — text emerges from darkness, not thin air
    const bottomFade = document.createElement('div')
    bottomFade.style.cssText = `
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 22%; z-index: 2;
      background: linear-gradient(to top, #000 40%, transparent);
      pointer-events: none;
    `

    // Perspective container
    const perspBox = document.createElement('div')
    perspBox.style.cssText = `
      position: absolute; inset: 0;
      perspective: ${Math.round(height * 0.65)}px;
      perspective-origin: 50% 18%;
    `

    // The crawl strip
    const strip = document.createElement('div')
    strip.style.cssText = `
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%) rotateX(26deg);
      transform-origin: bottom center;
      width: 56%;
      will-change: bottom;
    `

    const crawlLines = [
      { text: 'A long time ago, in a land of spices and satellites\u2026', big: false },
      { text: 'The forces of chaos \u2014 alien armadas and rogue fighter jets \u2014 threatened the peace of Bharat.', big: false },
      { text: 'One man. One kurta. One laser gaze.', big: false },
      { text: 'Rising from the banks of the Sabarmati, chosen by the cosmos itself, armed with the power of a billion prayers and an unbreakable resolve\u2026', big: false },
      { text: 'MODI MAN AWAKENS.', big: true },
    ]

    const baseFontPx = Math.round(Math.min(width, height) * 0.034)
    crawlLines.forEach(({ text, big }) => {
      const p = document.createElement('p')
      p.textContent = text
      p.style.cssText = `
        margin: 0 0 1.6em;
        text-align: center;
        font-family: Georgia, serif;
        font-weight: 700;
        line-height: 1.7;
        color: ${big ? '#fff8e6' : '#FFB347'};
        font-size: ${big ? Math.round(baseFontPx * 1.4) : baseFontPx}px;
        ${big ? 'letter-spacing: 2px;' : ''}
      `
      strip.appendChild(p)
    })

    perspBox.appendChild(strip)
    overlay.appendChild(perspBox)
    overlay.appendChild(topFade)
    overlay.appendChild(bottomFade)
    document.body.appendChild(overlay)
    this._overlay = overlay
    this._strip = strip

    // ── Scroll animation ──────────────────────────────────────────────
    // Start well below the canvas bottom so text crawls up INTO view
    const SPEED = height * 0.07
    const totalTextH = strip.scrollHeight + height * 0.6
    let startBottom = -(height * 0.6)   // begins hidden below screen
    let startTime = null

    const tick = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const pos = startBottom + SPEED * elapsed
      strip.style.bottom = pos + 'px'

      if (pos < totalTextH) {
        this._raf = requestAnimationFrame(tick)
      } else {
        this.time.delayedCall(1200, () => this.cameras.main.fadeOut(600))
      }
    }
    this._raf = requestAnimationFrame(tick)
  }

  _removeOverlay() {
    if (this._raf) cancelAnimationFrame(this._raf)
    if (this._overlay && this._overlay.parentNode) {
      this._overlay.parentNode.removeChild(this._overlay)
    }
    this._overlay = null
  }

  skipPrologue() {
    if (this.skipping) return
    this.skipping = true
    if (this.bgm) this.bgm.stop()
    this.cameras.main.fadeOut(500)
  }

  update(time) {
    for (const s of this.stars) {
      if (!s.twinkle) continue
      const a = s.base + 0.35 * Math.sin(time * s.speed + s.offset)
      s.g.setAlpha(Phaser.Math.Clamp(a, 0.05, 1))
    }
  }
}